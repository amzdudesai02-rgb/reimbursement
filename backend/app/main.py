from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.security import OAuth2PasswordBearer
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from jose import jwt, JWTError
from passlib.hash import bcrypt
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import inspect, text
import secrets
import os
import json
import time

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

# ✅ Create tables automatically when server starts
models.Base.metadata.create_all(bind=engine)


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
def amazon_oauth_init(user=Depends(get_current_user)):
    """
    Initialize Amazon OAuth flow.
    Returns authorization URL for seller to visit.
    """
    # Generate CSRF token
    state = secrets.token_urlsafe(32)
    
    # Store state in session/cache (in production, use Redis or similar)
    # For now, we'll include it in the response and verify on callback
    
    authorization_url = generate_authorization_url(state)
    
    return AmazonOAuthInitOut(
        authorization_url=authorization_url,
        state=state
    )


@app.post(f"{API_PREFIX}/auth/amazon/callback", response_model=AmazonOAuthCallbackOut)
def amazon_oauth_callback(
    body: AmazonOAuthCallbackIn,
    user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Handle Amazon OAuth callback.
    Exchange authorization code for tokens and create/store connection.
    """
    try:
        # Exchange authorization code for tokens
        token_response = exchange_authorization_code(body.spapi_oauth_code)
        
        refresh_token = token_response["refresh_token"]
        selling_partner_id = body.selling_partner_id
        
        # Check if connection already exists
        existing_conn = db.query(models.AmazonConnection).filter_by(
            selling_partner_id=selling_partner_id
        ).first()
        
        if existing_conn:
            # Update existing connection
            existing_conn.lwa_refresh_token = refresh_token
            existing_conn.lwa_access_token = token_response.get("access_token")
            expires_in = token_response.get("expires_in", 3600)
            existing_conn.lwa_token_expires_at = datetime.utcnow() + timedelta(seconds=expires_in)
            existing_conn.is_connected = True
            existing_conn.last_error = None
            db.commit()
            
            store = existing_conn.store
        else:
            # Create new store and connection
            # Try to get store name from SP-API (or use default)
            store_name = f"Amazon Store {selling_partner_id[:8]}"
            
            # Create store
            store = models.Store(
                user_id=user.id,
                store_name=store_name,
                region="US",  # Default, can be updated later
                marketplace_id="ATVPDKIKX0DER",  # US marketplace
            )
            db.add(store)
            db.flush()  # Get store.id
            
            # Create connection
            expires_in = token_response.get("expires_in", 3600)
            connection = models.AmazonConnection(
                store_id=store.id,
                selling_partner_id=selling_partner_id,
                lwa_refresh_token=refresh_token,
                lwa_access_token=token_response.get("access_token"),
                lwa_token_expires_at=datetime.utcnow() + timedelta(seconds=expires_in),
                is_connected=True,
            )
            db.add(connection)
            db.commit()
        
        return AmazonOAuthCallbackOut(
            store_id=store.id,
            store_name=store.store_name,
            message="Amazon store connected successfully!"
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to connect Amazon store: {str(e)}"
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


# Protect these endpoints if desired:
@app.get(f"{API_PREFIX}/summary", response_model=SummaryOut)
async def summary(user=Depends(get_current_user)):
    with get_session() as db:
        s = crud.get_summary(db)
        return SummaryOut(**s)


@app.get(f"{API_PREFIX}/reimbursements", response_model=list[ReimbursementOut])
async def list_items(skip: int = 0, limit: int = 100, user=Depends(get_current_user)):
    with get_session() as db:
        items = crud.list_reimbursements(db, skip=skip, limit=limit)
        return [ReimbursementOut.from_amazon_reimbursement(i) for i in items]