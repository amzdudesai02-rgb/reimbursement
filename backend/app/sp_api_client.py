"""
Amazon SP-API Client Utilities

Handles OAuth token exchange, AWS STS role assumption, and SP-API request signing.
"""
import os
import json
import logging
import time
import random
import threading
import hmac
import hashlib
import base64
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from urllib.parse import urlparse, quote

import httpx

# 429 retry: exponential backoff with Retry-After support
MAX_RETRIES_429 = 5
RETRY_BASE_SECONDS = 1
import boto3
from botocore.exceptions import ClientError

logger = logging.getLogger(__name__)


class _RateLimiter:
    """
    Very small in-process rate limiter to avoid SP-API throttling.
    Amazon support confirmed Finances listFinancialEvents is 0.5 req/sec (1 request every 2 seconds).
    We enforce a minimum interval per "bucket".
    """

    def __init__(self) -> None:
        self._lock = threading.Lock()
        self._next_allowed_at: dict[str, float] = {}

    def wait(self, bucket: str, min_interval_sec: float) -> None:
        now = time.monotonic()
        with self._lock:
            next_allowed = self._next_allowed_at.get(bucket, 0.0)
            wait_for = max(0.0, next_allowed - now)
            # Reserve the next slot now to prevent concurrent callers from bursting.
            self._next_allowed_at[bucket] = max(next_allowed, now) + min_interval_sec
        if wait_for > 0:
            time.sleep(wait_for)


_rate_limiter = _RateLimiter()


def _bucket_for_path(path: str) -> tuple[str, float] | None:
    """
    Return (bucket_name, min_interval_sec) for API paths that need strict pacing.
    """
    p = (path or "").lower()
    if p.startswith("/finances/"):
        # Per Amazon support: 0.5 req/sec -> 2 seconds minimum spacing.
        return ("finances", 2.0)
    return None


def _retry_sleep_seconds(response: httpx.Response, attempt: int) -> float:
    """
    Determine how long to sleep before retrying after throttling.
    - Honor Retry-After if provided
    - Otherwise exponential backoff with small jitter
    """
    ra = response.headers.get("Retry-After")
    if ra:
        try:
            return max(0.0, float(ra))
        except ValueError:
            pass
    # Exponential backoff: 1, 2, 4, 8, 16 (plus jitter)
    base = RETRY_BASE_SECONDS * (2 ** attempt)
    return base + random.uniform(0.0, 0.25 * base)

# Load environment variables
LWA_CLIENT_ID = os.getenv("AMAZON_LWA_CLIENT_ID")
LWA_CLIENT_SECRET = os.getenv("AMAZON_LWA_CLIENT_SECRET")
# App ID for consent URL (Website Authorization Workflow). Do NOT use LWA Client ID here.
# See: https://developer-docs.amazon.com/sp-api/docs/website-authorization-workflow
AMAZON_APP_ID = os.getenv("AMAZON_APP_ID")
AWS_IAM_ROLE_ARN = os.getenv("AMAZON_AWS_IAM_ROLE_ARN")
AWS_REGION = os.getenv("AMAZON_AWS_REGION", "us-east-1")
OAUTH_REDIRECT_URI = os.getenv(
    "AMAZON_OAUTH_REDIRECT_URI",
    # Default to frontend callback route. The SPA page at /auth/amazon/callback
    # reads Amazon's query params and posts them to the backend.
    "https://reimbursement.amzdudes.io/auth/amazon/callback",
)

# SP-API endpoints
SP_API_BASE_URL = "https://sellingpartnerapi-na.amazon.com"  # Default to North America
LWA_TOKEN_URL = "https://api.amazon.com/auth/o2/token"


class SPAPIClient:
    """Client for making authenticated SP-API requests"""
    
    def __init__(
        self,
        refresh_token: str,
        selling_partner_id: str,
        marketplace_id: str = "ATVPDKIKX0DER",  # US marketplace
        region: str = "us-east-1"
    ):
        self.refresh_token = refresh_token
        self.selling_partner_id = selling_partner_id
        self.marketplace_id = marketplace_id
        self.region = region
        
        # Cache for tokens
        self._lwa_access_token: Optional[str] = None
        self._lwa_token_expires_at: Optional[datetime] = None
        self._aws_credentials: Optional[Dict[str, Any]] = None
        self._aws_credentials_expire_at: Optional[datetime] = None
        
        # Set base URL based on region
        if region.startswith("us"):
            self.base_url = "https://sellingpartnerapi-na.amazon.com"
        elif region.startswith("eu"):
            self.base_url = "https://sellingpartnerapi-eu.amazon.com"
        else:
            self.base_url = "https://sellingpartnerapi-fe.amazon.com"
    
    def get_lwa_access_token(self) -> str:
        """Get or refresh LWA access token"""
        # Check if token is still valid (with 5 minute buffer)
        if (
            self._lwa_access_token
            and self._lwa_token_expires_at
            and datetime.utcnow() < (self._lwa_token_expires_at - timedelta(minutes=5))
        ):
            return self._lwa_access_token
        
        # Exchange refresh token for access token
        data = {
            "grant_type": "refresh_token",
            "refresh_token": self.refresh_token,
            "client_id": LWA_CLIENT_ID,
            "client_secret": LWA_CLIENT_SECRET,
        }
        
        response = httpx.post(LWA_TOKEN_URL, data=data, timeout=10.0)
        response.raise_for_status()
        
        token_data = response.json()
        self._lwa_access_token = token_data["access_token"]
        expires_in = token_data.get("expires_in", 3600)
        self._lwa_token_expires_at = datetime.utcnow() + timedelta(seconds=expires_in)
        
        return self._lwa_access_token
    
    def get_aws_credentials(self) -> Dict[str, str]:
        """
        Get AWS credentials via STS AssumeRole (Step 3: Assume AWS Role).
        Required for SP-API calls - obtains temporary AWS credentials.
        """
        # Check if credentials are still valid (with 5 minute buffer)
        if (
            self._aws_credentials
            and self._aws_credentials_expire_at
            and datetime.utcnow() < (self._aws_credentials_expire_at - timedelta(minutes=5))
        ):
            return self._aws_credentials
        
        # Get LWA access token first
        self.get_lwa_access_token()
        
        # boto3 reads AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY; support AMAZON_ prefixed names (e.g. on Render)
        access_key = os.getenv("AWS_ACCESS_KEY_ID") or os.getenv("AMAZON_AWS_ACCESS_KEY_ID")
        secret_key = os.getenv("AWS_SECRET_ACCESS_KEY") or os.getenv("AMAZON_AWS_SECRET_ACCESS_KEY")
        if not access_key or not secret_key:
            raise Exception(
                "Unable to locate credentials. Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY (or AMAZON_AWS_ACCESS_KEY_ID and AMAZON_AWS_SECRET_ACCESS_KEY) in the backend environment."
            )
        if not os.getenv("AWS_ACCESS_KEY_ID"):
            os.environ["AWS_ACCESS_KEY_ID"] = access_key
        if not os.getenv("AWS_SECRET_ACCESS_KEY"):
            os.environ["AWS_SECRET_ACCESS_KEY"] = secret_key

        # Assume role using STS
        sts_client = boto3.client("sts", region_name=self.region)
        
        logger.info(
            "get_aws_credentials: Assuming role %s for selling_partner_id=%s",
            AWS_IAM_ROLE_ARN,
            self.selling_partner_id
        )
        
        try:
            # External ID is typically the selling_partner_id
            response = sts_client.assume_role(
                RoleArn=AWS_IAM_ROLE_ARN,
                RoleSessionName=f"sp-api-session-{self.selling_partner_id}",
                DurationSeconds=3600,  # 1 hour
                ExternalId=self.selling_partner_id,
            )
            
            creds = response["Credentials"]
            self._aws_credentials = {
                "access_key_id": creds["AccessKeyId"],
                "secret_access_key": creds["SecretAccessKey"],
                "session_token": creds["SessionToken"],
            }
            self._aws_credentials_expire_at = creds["Expiration"].replace(tzinfo=None)
            
            logger.info(
                "get_aws_credentials: SUCCESS - expires_at=%s",
                self._aws_credentials_expire_at
            )
            
            return self._aws_credentials
            
        except ClientError as e:
            logger.error(
                "get_aws_credentials: FAILED - %s",
                str(e)
            )
            raise Exception(f"Failed to assume AWS role: {str(e)}") from e
    
    def _sign_request(
        self,
        method: str,
        url: str,
        headers: Dict[str, str],
        body: Optional[str] = None
    ) -> Dict[str, str]:
        """
        Sign SP-API request using AWS Signature Version 4 (AWS SigV4).
        Amazon SP-API requires AWS Signature V4 for all requests.
        """
        aws_creds = self.get_aws_credentials()
        
        parsed_url = urlparse(url)
        host = parsed_url.netloc
        path = parsed_url.path or "/"
        query = parsed_url.query
        
        # Create canonical request
        canonical_headers = f"host:{host}\n"
        signed_headers = "host"
        
        if body:
            payload_hash = hashlib.sha256(body.encode()).hexdigest()
        else:
            payload_hash = hashlib.sha256("".encode()).hexdigest()
        
        canonical_request = f"{method}\n{path}\n{query}\n{canonical_headers}\n{signed_headers}\n{payload_hash}"
        
        # Create string to sign
        algorithm = "AWS4-HMAC-SHA256"
        now = datetime.utcnow()
        amz_date = now.strftime("%Y%m%dT%H%M%SZ")
        date_stamp = now.strftime("%Y%m%d")
        
        credential_scope = f"{date_stamp}/{self.region}/execute-api/aws4_request"
        string_to_sign = f"{algorithm}\n{amz_date}\n{credential_scope}\n{hashlib.sha256(canonical_request.encode()).hexdigest()}"
        
        # Calculate signature
        def sign(key, msg):
            return hmac.new(key, msg.encode(), hashlib.sha256).digest()
        
        k_date = sign(("AWS4" + aws_creds["secret_access_key"]).encode(), date_stamp)
        k_region = sign(k_date, self.region)
        k_service = sign(k_region, "execute-api")
        k_signing = sign(k_service, "aws4_request")
        signature = hmac.new(k_signing, string_to_sign.encode(), hashlib.sha256).hexdigest()
        
        # Add authorization header
        authorization = (
            f"{algorithm} "
            f"Credential={aws_creds['access_key_id']}/{credential_scope}, "
            f"SignedHeaders={signed_headers}, "
            f"Signature={signature}"
        )
        
        lwa_token = self.get_lwa_access_token()
        headers["x-amz-date"] = amz_date
        headers["x-amz-access-token"] = lwa_token
        headers["Authorization"] = authorization
        headers["x-amz-security-token"] = aws_creds["session_token"]
        
        return headers
    
    def request(
        self,
        method: str,
        path: str,
        params: Optional[Dict[str, Any]] = None,
        body: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Make an authenticated SP-API request"""
        # Enforce per-operation pacing to prevent QuotaExceeded throttling.
        bucket = _bucket_for_path(path)
        if bucket is not None:
            bucket_name, min_interval_sec = bucket
            _rate_limiter.wait(bucket_name, min_interval_sec)

        url = f"{self.base_url}{path}"
        
        # Build query string
        query_parts = []
        if params:
            for key, value in params.items():
                query_parts.append(f"{quote(str(key))}={quote(str(value))}")
        if query_parts:
            url += "?" + "&".join(query_parts)
        
        # Prepare headers (GET/HEAD must not have Content-Type or body per SP-API to avoid 400)
        headers: Dict[str, str] = {
            "x-amz-marketplace-id": self.marketplace_id,
            "Accept": "application/json",
        }
        body_str: Optional[str] = None
        if body is not None:
            body_str = json.dumps(body)
            headers["Content-Type"] = "application/json"

        # Sign request
        headers = self._sign_request(method, url, headers, body_str)

        # GET/HEAD: no body (SP-API returns 400 if GET has body or Content-Length)
        send_content = body_str if method.upper() not in ("GET", "HEAD") else None
        last_response: httpx.Response | None = None
        for attempt in range(MAX_RETRIES_429):
            response = httpx.request(
                method=method,
                url=url,
                headers=headers,
                content=send_content,
                timeout=30.0,
            )
            last_response = response
            if response.status_code == 429 and attempt < MAX_RETRIES_429 - 1:
                wait_sec = _retry_sleep_seconds(response, attempt)
                logger.warning(
                    "SP-API 429 QuotaExceeded for %s %s, retry %s/%s in %s seconds",
                    method,
                    path,
                    attempt + 1,
                    MAX_RETRIES_429,
                    wait_sec,
                )
                time.sleep(wait_sec)
                continue
            break

        response = last_response
        try:
            response.raise_for_status()
        except httpx.HTTPStatusError as e:
            # Log rich context so we can see why Amazon rejected the request
            status = e.response.status_code
            content_type = e.response.headers.get("Content-Type", "")
            body_preview = ""
            error_summary = ""
            try:
                if "application/json" in content_type:
                    err_json = e.response.json()
                    body_preview = json.dumps(err_json)[:500]
                    # Standard SP-API error shape: {"errors": [{"code": "...", "message": "...", "details": "..."}]}
                    if isinstance(err_json, dict) and isinstance(err_json.get("errors"), list) and err_json["errors"]:
                        first = err_json["errors"][0] or {}
                        code = first.get("code")
                        msg = first.get("message")
                        details = first.get("details")
                        parts = [str(p) for p in (code, msg, details) if p]
                        error_summary = " | ".join(parts)
                else:
                    body_preview = (e.response.text or "")[:500]
            except Exception:
                # If parsing the body fails, fall back to generic info only
                pass

            logger.warning(
                "SP-API request failed: %s %s -> status=%s content_type=%s body=%s",
                method,
                url,
                status,
                content_type,
                body_preview,
            )

            detail = error_summary or body_preview or str(e)
            raise Exception(f"SP-API error {status}: {detail}") from e

        return response.json()


def exchange_authorization_code(
    authorization_code: str,
    redirect_uri: str = OAUTH_REDIRECT_URI
) -> Dict[str, Any]:
    """
    Exchange Amazon authorization code for refresh token and access token.
    
    Step 1: Exchange Code → Access Token (Mandatory)
    POST https://api.amazon.com/auth/o2/token
    Content-Type: application/x-www-form-urlencoded
    
    Returns:
        {
            "access_token": "...",
            "refresh_token": "...",
            "token_type": "bearer",
            "expires_in": 3600
        }
    """
    data = {
        "grant_type": "authorization_code",
        "code": authorization_code,
        "client_id": LWA_CLIENT_ID,
        "client_secret": LWA_CLIENT_SECRET,
        "redirect_uri": redirect_uri,
    }
    
    logger.info(
        "exchange_authorization_code: POST %s (redirect_uri=%s, code=***)",
        LWA_TOKEN_URL,
        redirect_uri
    )
    
    try:
        response = httpx.post(LWA_TOKEN_URL, data=data, timeout=10.0)
        response.raise_for_status()
        
        token_data = response.json()
        
        # Log success (without exposing secrets)
        logger.info(
            "exchange_authorization_code: SUCCESS - token_type=%s expires_in=%s (has access_token=%s, has refresh_token=%s)",
            token_data.get("token_type"),
            token_data.get("expires_in"),
            "access_token" in token_data,
            "refresh_token" in token_data
        )
        
        return token_data
        
    except httpx.HTTPStatusError as e:
        error_detail = None
        try:
            error_detail = e.response.json()
        except Exception:
            error_detail = e.response.text
        
        logger.error(
            "exchange_authorization_code: FAILED - status=%d response=%s",
            e.response.status_code,
            error_detail
        )
        raise Exception(
            f"Amazon token exchange failed (status {e.response.status_code}): {error_detail}"
        ) from e
    except Exception as e:
        logger.exception("exchange_authorization_code: UNEXPECTED ERROR")
        raise Exception(f"Failed to exchange authorization code: {str(e)}") from e


def generate_authorization_url(
    state: str,
    redirect_uri: str = OAUTH_REDIRECT_URI
) -> str:
    """
    Generate the Amazon authorization URL for OAuth flow.
    Uses AMAZON_APP_ID (app ID) in application_id, NOT LWA Client ID.
    No version=beta. return_url must be .../api/auth/amazon/callback.
    """
    if not AMAZON_APP_ID:
        raise ValueError(
            "AMAZON_APP_ID is required for the consent URL (e.g. amzn1.sp.solution.xxx). "
            "Do not use LWA Client ID in the consent URL. See: "
            "https://developer-docs.amazon.com/sp-api/docs/website-authorization-workflow"
        )
    # Ensure backend callback path (/api/auth/amazon/callback), never /auth/amazon/callback
    uri = redirect_uri.rstrip("/")
    if "/auth/amazon/callback" in uri and "/api/auth/amazon/callback" not in uri:
        uri = uri.replace("/auth/amazon/callback", "/api/auth/amazon/callback")
    params = {
        "application_id": AMAZON_APP_ID,
        "return_url": uri,
        "state": state,
    }
    # return_url must be fully encoded: https%3A%2F%2F... (slashes as %2F)
    def _enc(k: str, v: str) -> str:
        return f"{k}={quote(v, safe='')}" if k == "return_url" else f"{k}={quote(v)}"
    query_string = "&".join(_enc(k, v) for k, v in params.items())
    return f"https://sellercentral.amazon.com/apps/authorize/consent?{query_string}"

