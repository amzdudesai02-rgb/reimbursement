from fastapi import Depends, FastAPI, HTTPException
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
allow_all = "*" in cors_origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if allow_all else cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
SECRET = os.getenv("JWT_SECRET", "dev-secret-change-me")
ALGO = "HS256"
TOKEN_MINUTES = int(os.getenv("JWT_EXPIRES_MINUTES", "120"))

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
def login(body: LoginIn, db: Session = Depends(get_db)):
    user = db.query(models.User).filter_by(email=body.email).first()
    if not user or not bcrypt.verify(body.password, user.password_hash):
        raise HTTPException(401, "Invalid credentials")
    if not user.is_verified:
        raise HTTPException(
            status_code=403,
            detail={"code": "EMAIL_NOT_VERIFIED", "message": "Please verify your email first."},
        )
    return TokenOut(access_token=create_token(user.email))


@app.post(f"{API_PREFIX}/contact", response_model=MessageOut)
def contact(body: ContactIn, db: Session = Depends(get_db)):
    msg = models.ContactMessage(name=body.name, email=body.email, message=body.message)
    db.add(msg)
    db.commit()
    return MessageOut(ok=True, message="Message received. We'll get back to you soon.")


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
        return [ReimbursementOut.model_validate(i) for i in items]