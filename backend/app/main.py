from fastapi import Depends, FastAPI, File, HTTPException, Query, Request, UploadFile
from fastapi.security import OAuth2PasswordBearer
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from jose import jwt, JWTError
from passlib.hash import bcrypt
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import inspect, text
import io
import logging
import secrets
import os
import json
import time
from typing import Any, Dict

logger = logging.getLogger(__name__)

# Frontend origin for redirects (backend GET callback redirects here)
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "https://reimbursement.amzdudes.io").rstrip("/")
BACKEND_CALLBACK_URL = f"{FRONTEND_ORIGIN}/api/auth/amazon/callback"

# In-memory cache for OAuth state (CSRF protection).
# Entries: {state: {"exp": datetime, "user_id": int}}
# In production, consider Redis or DB-backed storage for multi-server deployments.
_oauth_state_cache: Dict[str, Dict[str, Any]] = {}

from .database import engine
from . import models
from .email_utils import send_verification_email
from app.database import get_session
import app.crud as crud
from app.schemas import (
    SignupIn,
    LoginIn,
    TokenOut,
    ContactIn,
    SummaryOut,
    ReimbursementOut,
    MessageOut,
    VerifyTokenIn,
    ResendVerificationIn,
    AmazonOAuthInitOut,
    AmazonOAuthCallbackIn,
    AmazonOAuthCallbackOut,
    StoreCreate,
    StoreOut,
    AmazonConnectionOut,
    CurrentUserOut,
)
from app.sp_api_client import (
    exchange_authorization_code,
    generate_authorization_url,
    SPAPIClient,
)
from app import finances_sync, reports_sync, inbound_sync
from app.csv_ingest import map_and_clean

# ✅ Create tables automatically when server starts
models.Base.metadata.create_all(bind=engine)


def ensure_reimbursement_store_id():
    try:
        inspector = inspect(engine)
        if "amazon_reimbursements" in inspector.get_table_names():
            cols = {c["name"] for c in inspector.get_columns("amazon_reimbursements")}
            if "store_id" not in cols:
                with engine.connect() as conn:
                    conn.execute(text(
                        "ALTER TABLE amazon_reimbursements ADD COLUMN store_id INTEGER REFERENCES stores(id) ON DELETE SET NULL"
                    ))
                    conn.commit()
    except Exception:
        pass


def ensure_user_columns():
    inspector = inspect(engine)
    cols = {col["name"] for col in inspector.get_columns("users")}
    statements = []
    if "is_verified" not in cols:
        statements.append(
            "ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT FALSE NOT NULL"
        )
    if "verification_token" not in cols:
        statements.append("ALTER TABLE users ADD COLUMN verification_token VARCHAR(255)")
    if "verification_sent_at" not in cols:
        statements.append("ALTER TABLE users ADD COLUMN verification_sent_at TIMESTAMP")
    if "verified_at" not in cols:
        statements.append("ALTER TABLE users ADD COLUMN verified_at TIMESTAMP")

    if statements:
        with engine.connect() as conn:
            for stmt in statements:
                conn.execute(text(stmt))
            conn.commit()


ensure_user_columns()
ensure_reimbursement_store_id()

API_PREFIX = "/api"
app = FastAPI(title="amzDUDES Reimbursement API")
def parse_origins(raw: str | None) -> list[str]:
    if not raw:
        return ["http://localhost:5173"]
    try:
        parsed = json.loads(raw)
        if isinstance(parsed, str):
            return [parsed]
        if isinstance(parsed, list):
            return [str(x) for x in parsed]
    except json.JSONDecodeError:
        pass
    return [o.strip() for o in raw.split(",") if o.strip()]


cors_origins = parse_origins(os.getenv("CORS_ORIGINS"))
allow_all = "*" in cors_origins or not cors_origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if allow_all else cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
SECRET = os.getenv("JWT_SECRET", "dev-secret-change-me")
ALGO = "HS256"
# Default access token lifetime (can be overridden via JWT_EXPIRES_MINUTES)
TOKEN_MINUTES = int(os.getenv("JWT_EXPIRES_MINUTES", "60"))

# Simple in-memory rate limiting store: {(scope, ip): [timestamps...]}
_rate_limit_store: dict[tuple[str, str], list[float]] = {}
RATE_LIMIT_WINDOW_SECONDS = 5 * 60  # 5 minutes
RATE_LIMIT_MAX_ATTEMPTS = 10        # per window per IP


def rate_limiter(scope: str):
    """Dependency factory for basic per-IP rate limiting."""

    def _inner(request: Request):
        ip = request.client.host if request.client else "unknown"
        key = (scope, ip)
        now = time.time()
        window_start = now - RATE_LIMIT_WINDOW_SECONDS

        timestamps = _rate_limit_store.get(key, [])
        # Drop timestamps outside the window
        timestamps = [ts for ts in timestamps if ts >= window_start]
        if len(timestamps) >= RATE_LIMIT_MAX_ATTEMPTS:
            raise HTTPException(
                status_code=429,
                detail="Too many requests. Please wait a few minutes and try again.",
            )

        timestamps.append(now)
        _rate_limit_store[key] = timestamps

    return _inner

oauth2 = OAuth2PasswordBearer(tokenUrl=f"{API_PREFIX}/auth/login")

@app.api_route("/", methods=["GET", "HEAD"])
def root():
    return {
        "message": "amzDUDES Reimbursement API is running",
        "docs": "/docs",
        "contact": "support@amzdudes.io",
    }


@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    return RedirectResponse("https://reimbursement.amzdudes.io/favicon.ico")


# Helper: get current user
def get_db():
    from .database import SessionLocal

    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_token(sub: str):
    exp = datetime.utcnow() + timedelta(minutes=TOKEN_MINUTES)
    return jwt.encode({"sub": sub, "exp": exp}, SECRET, algorithm=ALGO)


def get_current_user(token: str = Depends(oauth2), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET, algorithms=[ALGO])
        email = payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(models.User).filter_by(email=email).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    if not user.is_verified:
        raise HTTPException(status_code=403, detail="Email not verified")
    return user


@app.post(f"{API_PREFIX}/auth/signup", response_model=MessageOut)
def signup(body: SignupIn, db: Session = Depends(get_db)):
    if db.query(models.User).filter_by(email=body.email).first():
        raise HTTPException(400, "Email already registered")
    if len(body.password) < 8 or len(body.password.encode("utf-8")) > 72:
        raise HTTPException(
            status_code=400,
            detail="Password must be between 8 and 72 characters long.",
        )
    token = secrets.token_urlsafe(32)
    try:
        password_hash = bcrypt.hash(body.password)
    except ValueError as exc:
        if "72" in str(exc):
            raise HTTPException(
                status_code=400,
                detail="Password must be between 8 and 72 characters long.",
            )
        raise

    user = models.User(
        name=body.name,
        email=body.email,
        password_hash=password_hash,
        is_verified=False,
        verification_token=token,
        verification_sent_at=datetime.utcnow(),
    )
    db.add(user)
    db.commit()
    send_verification_email(body.name, body.email, token)
    return MessageOut(ok=True, message="Verification email sent. Please check your inbox.")


@app.post(f"{API_PREFIX}/auth/resend-verification", response_model=MessageOut)
def resend_verification(body: ResendVerificationIn, db: Session = Depends(get_db)):
    user = db.query(models.User).filter_by(email=body.email).first()
    if not user:
        raise HTTPException(404, "No account with that email.")
    if user.is_verified:
        return MessageOut(ok=True, message="Account already verified. You can log in.")
    user.verification_token = secrets.token_urlsafe(32)
    user.verification_sent_at = datetime.utcnow()
    db.commit()
    send_verification_email(user.name or "", user.email, user.verification_token)
    return MessageOut(ok=True, message="Verification email resent.")


@app.post(f"{API_PREFIX}/auth/verify", response_model=TokenOut)
def verify_email(body: VerifyTokenIn, db: Session = Depends(get_db)):
    user = (
        db.query(models.User)
        .filter_by(verification_token=body.token)
        .first()
    )
    if not user:
        raise HTTPException(400, "Invalid or expired verification link.")
    user.is_verified = True
    user.verification_token = None
    user.verified_at = datetime.utcnow()
    db.commit()
    return TokenOut(access_token=create_token(user.email))


@app.post(f"{API_PREFIX}/auth/login", response_model=TokenOut)
def login(
    body: LoginIn,
    request: Request,
    _: None = Depends(rate_limiter("login")),
    db: Session = Depends(get_db),
):
    ip = request.client.host if request.client else None

    user = db.query(models.User).filter_by(email=body.email).first()
    if not user or not bcrypt.verify(body.password, user.password_hash):
        # Record failed login attempt
        evt = models.SecurityEvent(
            user_id=user.id if user else None,
            ip=ip,
            event_type="login_failed",
            detail="Invalid credentials",
        )
        db.add(evt)
        db.commit()
        raise HTTPException(401, "Invalid credentials")

    if not user.is_verified:
        evt = models.SecurityEvent(
            user_id=user.id,
            ip=ip,
            event_type="login_blocked_unverified",
            detail="Email not verified",
        )
        db.add(evt)
        db.commit()
        raise HTTPException(
            status_code=403,
            detail={"code": "EMAIL_NOT_VERIFIED", "message": "Please verify your email first."},
        )

    # Successful login
    evt = models.SecurityEvent(
        user_id=user.id,
        ip=ip,
        event_type="login_success",
        detail=None,
    )
    db.add(evt)
    db.commit()

    return TokenOut(access_token=create_token(user.email))


@app.get(f"{API_PREFIX}/auth/me", response_model=CurrentUserOut)
def get_me(user=Depends(get_current_user)):
    """Return the current authenticated user's basic profile."""
    return user


@app.post(f"{API_PREFIX}/contact", response_model=MessageOut)
def contact(body: ContactIn, db: Session = Depends(get_db)):
    msg = models.ContactMessage(name=body.name, email=body.email, message=body.message)
    db.add(msg)
    db.commit()
    return MessageOut(ok=True, message="Message received. We'll get back to you soon.")


# ---------- AMAZON STORE & OAUTH ENDPOINTS ----------

@app.get(f"{API_PREFIX}/auth/amazon/init", response_model=AmazonOAuthInitOut)
def amazon_oauth_init(
    user=Depends(get_current_user),
):
    """
    Initialize Amazon OAuth flow.
    Returns authorization URL for seller to visit.
    Uses backend callback URL: /api/auth/amazon/callback (no version=beta).
    """
    # Always use backend callback - must match Developer Central OAuth Redirect URI
    callback_url = BACKEND_CALLBACK_URL.rstrip('/')
    state = secrets.token_urlsafe(32)
    
    # Store state with 10-minute TTL and user_id (for GET callback)
    now = datetime.utcnow()
    _oauth_state_cache[state] = {"exp": now + timedelta(minutes=10), "user_id": user.id}
    
    # Clean up expired states (simple cleanup, in production use Redis TTL)
    expired = [s for s, v in _oauth_state_cache.items() if v["exp"] < now]
    for s in expired:
        _oauth_state_cache.pop(s, None)
    
    authorization_url = generate_authorization_url(state, redirect_uri=callback_url)
    logger.info("amazon_oauth_init: Generated state=%s for user_id=%s redirect_uri=%s", state[:8] + "...", user.id, callback_url)
    
    return AmazonOAuthInitOut(authorization_url=authorization_url, state=state)


def _do_oauth_exchange_and_connect(
    db: Session,
    user_id: int,
    code: str,
    redirect_uri: str,
    selling_partner_id: str,
) -> models.Store:
    """Exchange code for tokens, create/update connection, return store. Raises on error."""
    token_response = exchange_authorization_code(code, redirect_uri=redirect_uri)
    logger.info(
        "oauth exchange: selling_partner_id=%s expires_in=%s",
        selling_partner_id,
        token_response.get("expires_in"),
    )
    refresh_token = token_response.get("refresh_token")
    access_token = token_response.get("access_token")
    if not refresh_token:
        logger.error("oauth exchange: missing refresh_token, keys=%s", list(token_response.keys()))
        raise ValueError("Amazon token response missing refresh_token.")
    if not access_token:
        logger.warning("oauth exchange: missing access_token")

    existing_conn = db.query(models.AmazonConnection).filter_by(selling_partner_id=selling_partner_id).first()
    if existing_conn:
        existing_conn.lwa_refresh_token = refresh_token
        existing_conn.lwa_access_token = access_token
        expires_in = token_response.get("expires_in", 3600)
        existing_conn.lwa_token_expires_at = datetime.utcnow() + timedelta(seconds=expires_in)
        existing_conn.is_connected = True
        existing_conn.last_error = None
        db.commit()
        db.refresh(existing_conn)
        if not existing_conn.lwa_refresh_token:
            raise Exception("Failed to save refresh_token to database")
        logger.info("oauth exchange: updated connection store_id=%s", existing_conn.store_id)
        return existing_conn.store

    store_name = f"Amazon Store {selling_partner_id[:8]}"
    store = models.Store(
        user_id=user_id,
        store_name=store_name,
        region="US",
        marketplace_id="ATVPDKIKX0DER",
    )
    db.add(store)
    db.flush()
    expires_in = token_response.get("expires_in", 3600)
    connection = models.AmazonConnection(
        store_id=store.id,
        selling_partner_id=selling_partner_id,
        lwa_refresh_token=refresh_token,
        lwa_access_token=access_token,
        lwa_token_expires_at=datetime.utcnow() + timedelta(seconds=expires_in),
        is_connected=True,
    )
    db.add(connection)
    db.commit()
    db.refresh(connection)
    if not connection.lwa_refresh_token:
        raise Exception("Failed to save refresh_token to database")
    logger.info("oauth exchange: created store_id=%s selling_partner_id=%s", store.id, selling_partner_id)
    return store


@app.get(f"{API_PREFIX}/auth/amazon/callback")
def amazon_oauth_callback_get(
    request: Request,
    code: str | None = Query(None),
    spapi_oauth_code: str | None = Query(None),
    state: str | None = Query(None),
    selling_partner_id: str | None = Query(None),
    db: Session = Depends(get_db),
):
    """
    GET callback for Amazon OAuth (Amazon redirects the browser here).
    Exchanges code for tokens, stores them, then redirects to frontend /stores?amazon_connected=1.
    """
    auth_code = code or spapi_oauth_code
    if not auth_code or not state or not selling_partner_id:
        raise HTTPException(
            status_code=400,
            detail="Missing code, state, or selling_partner_id. Use Connect Amazon from Manage Stores.",
        )
    ent = _oauth_state_cache.get(state)
    if not ent:
        logger.warning("amazon_oauth_callback_get: invalid or expired state=%s", state[:8] + "...")
        raise HTTPException(status_code=400, detail="Invalid or expired state. Please restart the OAuth flow.")
    if ent["exp"] < datetime.utcnow():
        _oauth_state_cache.pop(state, None)
        raise HTTPException(status_code=400, detail="State expired. Please restart the OAuth flow.")
    _oauth_state_cache.pop(state, None)
    user_id = ent["user_id"]
    redirect_uri = BACKEND_CALLBACK_URL.rstrip("/")
    logger.info("amazon_oauth_callback_get: code=*** selling_partner_id=%s redirect_uri=%s", selling_partner_id, redirect_uri)
    try:
        store = _do_oauth_exchange_and_connect(db, user_id, auth_code, redirect_uri, selling_partner_id)
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("amazon_oauth_callback_get failed: %s", e)
        ip = request.client.host if request.client else None
        evt = models.SecurityEvent(user_id=user_id, ip=ip, event_type="amazon_connect_failed", detail=str(e)[:500])
        db.add(evt)
        db.commit()
        err = str(e)
        if "refresh_token" in err.lower():
            err = "Refresh token missing. Revoke and reconnect the app, then try again."
        elif "redirect" in err.lower() or "redirect_uri" in err.lower():
            err = f"Redirect URI mismatch. Use exactly: {redirect_uri}"
        raise HTTPException(status_code=400, detail=f"Failed to connect Amazon store: {err}")
    ip = request.client.host if request.client else None
    evt = models.SecurityEvent(user_id=user_id, ip=ip, event_type="amazon_connect_success", detail=f"store_id={store.id}")
    db.add(evt)
    db.commit()
    return RedirectResponse(url=f"{FRONTEND_ORIGIN}/stores?amazon_connected=1", status_code=302)


@app.post(f"{API_PREFIX}/auth/amazon/callback", response_model=AmazonOAuthCallbackOut)
def amazon_oauth_callback_post(
    request: Request,
    body: AmazonOAuthCallbackIn,
    user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    POST callback (frontend sends code after Amazon redirects to frontend /auth/amazon/callback).
    Exchange code for tokens, create/store connection, return JSON.
    """
    from app.sp_api_client import OAUTH_REDIRECT_URI

    logger.info("amazon_oauth_callback_post: request received user_id=%s", user.id)

    if not body.spapi_oauth_code:
        raise HTTPException(status_code=400, detail="Missing authorization code (spapi_oauth_code)")
    if not body.selling_partner_id:
        raise HTTPException(status_code=400, detail="Missing selling_partner_id")
    if not body.state:
        raise HTTPException(status_code=400, detail="Missing state parameter")

    ent = _oauth_state_cache.get(body.state)
    if not ent:
        logger.warning("amazon_oauth_callback_post: invalid or expired state=%s", body.state[:8] + "...")
        raise HTTPException(status_code=400, detail="Invalid or expired state. Please restart the OAuth flow.")
    if ent["exp"] < datetime.utcnow():
        _oauth_state_cache.pop(body.state, None)
        raise HTTPException(status_code=400, detail="State expired. Please restart the OAuth flow.")
    _oauth_state_cache.pop(body.state, None)

    redirect_uri = (body.redirect_uri or OAUTH_REDIRECT_URI).rstrip("/")
    logger.info(
        "amazon_oauth_callback_post: code=*** selling_partner_id=%s redirect_uri=%s",
        body.selling_partner_id,
        redirect_uri,
    )
    try:
        store = _do_oauth_exchange_and_connect(
            db, user.id, body.spapi_oauth_code, redirect_uri, body.selling_partner_id
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("amazon_oauth_callback_post failed: %s", e)
        ip = request.client.host if request.client else None
        evt = models.SecurityEvent(user_id=user.id, ip=ip, event_type="amazon_connect_failed", detail=str(e)[:500])
        db.add(evt)
        db.commit()
        err = str(e)
        if "refresh_token" in err.lower():
            err = "Critical: refresh_token missing. Revoke and reconnect, then try again."
        elif "redirect" in err.lower() or "redirect_uri" in err.lower():
            err = f"Redirect URI mismatch. Use exactly: {redirect_uri}"
        raise HTTPException(status_code=400, detail=f"Failed to connect Amazon store: {err}")
    ip = request.client.host if request.client else None
    evt = models.SecurityEvent(user_id=user.id, ip=ip, event_type="amazon_connect_success", detail=f"store_id={store.id}")
    db.add(evt)
    db.commit()
    return AmazonOAuthCallbackOut(
        store_id=store.id,
        store_name=store.store_name,
        message="Amazon store connected successfully!",
    )


@app.get(f"{API_PREFIX}/stores", response_model=list[StoreOut])
def list_stores(user=Depends(get_current_user), db: Session = Depends(get_db)):
    """List all stores for the current user"""
    stores = db.query(models.Store).filter_by(user_id=user.id).all()
    
    result = []
    for store in stores:
        store_dict = {
            "id": store.id,
            "user_id": store.user_id,
            "store_name": store.store_name,
            "region": store.region,
            "marketplace_id": store.marketplace_id,
            "is_active": store.is_active,
            "created_at": store.created_at,
            "updated_at": store.updated_at,
            "is_connected": False,
        }
        
        # Check connection status
        if store.amazon_connection:
            store_dict["is_connected"] = store.amazon_connection.is_connected
        
        result.append(StoreOut(**store_dict))
    
    return result


@app.get(f"{API_PREFIX}/stores/{{store_id}}/connection", response_model=AmazonConnectionOut)
def get_store_connection(
    store_id: int,
    user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get connection details for a store"""
    store = db.query(models.Store).filter_by(id=store_id, user_id=user.id).first()
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    
    connection = store.amazon_connection
    if not connection:
        raise HTTPException(status_code=404, detail="No connection found for this store")
    
    return AmazonConnectionOut(
        id=connection.id,
        store_id=connection.store_id,
        selling_partner_id=connection.selling_partner_id,
        is_connected=connection.is_connected,
        last_sync_at=connection.last_sync_at,
        marketplace_ids=connection.marketplace_ids,
        created_at=connection.created_at,
    )


def _user_store_ids(db: Session, user) -> list:
    return [s.id for s in db.query(models.Store).filter_by(user_id=user.id).all()]


# Protect these endpoints if desired:
@app.get(f"{API_PREFIX}/summary", response_model=SummaryOut)
async def summary(user=Depends(get_current_user)):
    with get_session() as db:
        store_ids = _user_store_ids(db, user)
        s = crud.get_summary(db, store_ids=store_ids)
        return SummaryOut(**s)


@app.get(f"{API_PREFIX}/reimbursements", response_model=list[ReimbursementOut])
async def list_items(skip: int = 0, limit: int = 100, user=Depends(get_current_user)):
    with get_session() as db:
        store_ids = _user_store_ids(db, user)
        items = crud.list_reimbursements(db, skip=skip, limit=limit, store_ids=store_ids)
        return [ReimbursementOut.from_amazon_reimbursement(i) for i in items]


@app.get(f"{API_PREFIX}/shipping-queue")
async def list_shipping_queue(skip: int = 0, limit: int = 100, user=Depends(get_current_user)):
    """Inventory → Shipping Queue data (Fulfillment center shipments)."""
    with get_session() as db:
        store_ids = _user_store_ids(db, user)
        rows = crud.list_shipments(db, store_ids=store_ids, skip=skip, limit=limit)
        return [
            {
                "id": r.id,
                "shipment_id": r.shipment_id,
                "reference_id": r.reference_id,
                "shipment_name": r.shipment_name,
                "created_at": r.created_at_utc.isoformat() if r.created_at_utc else None,
                "updated_at": r.updated_at_utc.isoformat() if r.updated_at_utc else None,
                "ship_to": r.ship_to,
                "sku_count": r.sku_count,
                "expected_units": r.expected_units,
                "status": r.status,
            }
            for r in rows
        ]


@app.post(f"{API_PREFIX}/sync")
async def sync_reimbursements(user=Depends(get_current_user)):
    """Sync Reimbursement (Reports + Finances) and Shipping Queue for all connected stores."""
    errors: list[str] = []
    stores_synced = 0
    reimbursements_added = 0
    shipments_updated = 0
    with get_session() as db:
        stores = (
            db.query(models.Store)
            .filter(models.Store.user_id == user.id)
            .join(models.AmazonConnection, models.Store.id == models.AmazonConnection.store_id)
            .filter(
                models.AmazonConnection.is_connected == True,
                models.AmazonConnection.lwa_refresh_token.isnot(None),
            )
            .all()
        )
        for store in stores:
            conn = store.amazon_connection
            if not conn or not conn.lwa_refresh_token:
                continue
            try:
                client = SPAPIClient(
                    refresh_token=conn.lwa_refresh_token,
                    selling_partner_id=conn.selling_partner_id,
                    marketplace_id=store.marketplace_id or "ATVPDKIKX0DER",
                )
                # Finances API (existing)
                events = finances_sync.fetch_reimbursement_events(client, store.id)
                n = crud.insert_or_ignore_reimbursements_from_financial_events(db, events)
                reimbursements_added += n
                # Reports → Fulfillment → Reimbursement (GET_FBA_REIMBURSEMENTS_DATA)
                try:
                    report_rows = reports_sync.fetch_reimbursements_report(
                        client, store.id, store.marketplace_id or "ATVPDKIKX0DER"
                    )
                    reimbursements_added += crud.insert_or_ignore_reimbursements_from_financial_events(db, report_rows)
                except Exception as report_err:
                    errors.append(f"{store.store_name} (report): {report_err}")
                # Inventory → Shipping Queue (Fulfillment Inbound)
                try:
                    ship_rows = inbound_sync.fetch_shipments(client, store.id)
                    shipments_updated += crud.upsert_shipments(db, ship_rows)
                except Exception as inbound_err:
                    errors.append(f"{store.store_name} (inbound): {inbound_err}")
                stores_synced += 1
                conn.last_sync_at = datetime.utcnow()
                conn.last_error = None
                db.commit()
            except Exception as e:
                conn.last_error = str(e)
                db.commit()
                errors.append(f"{store.store_name}: {e}")
    return {
        "synced": stores_synced > 0 and len(errors) == 0,
        "stores_synced": stores_synced,
        "reimbursements_added": reimbursements_added,
        "shipments_updated": shipments_updated,
        "errors": errors,
    }


@app.post(f"{API_PREFIX}/upload")
async def upload_reimbursements_csv(
    file: UploadFile = File(...),
    user=Depends(get_current_user),
):
    """Upload a CSV/TSV of reimbursements; parses and inserts into amazon_reimbursements. Data shows automatically in Dashboard and Cases."""
    if not file.filename or not (file.filename.lower().endswith(".csv") or file.filename.lower().endswith(".tsv")):
        raise HTTPException(status_code=400, detail="File must be .csv or .tsv")
    try:
        raw = await file.read()
        sep = "\t" if (file.filename or "").lower().endswith(".tsv") else ","
        df = pd.read_csv(io.BytesIO(raw), sep=sep, dtype=str, keep_default_na=False)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not parse file: {e}")
    rows, errors = map_and_clean(df)
    inserted = 0
    if rows:
        with get_session() as db:
            inserted = crud.insert_reimbursements_from_csv(db, rows)
    return {
        "total_rows": len(rows) + len(errors),
        "inserted_rows": inserted,
        "skipped_rows": len(errors),
        "errors": errors[:50],
    }