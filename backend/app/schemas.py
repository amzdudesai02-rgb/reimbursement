from pydantic import BaseModel, EmailStr
from datetime import datetime, date
from typing import Optional

# ---------- USER SCHEMAS ----------
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserOut(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True  # ✅ replaces old "orm_mode" in Pydantic v2

class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    message: str

class ReimbursementCreate(BaseModel):
    order_id: str
    reason: str
    amount: float
    status: str = "Pending"  # default if not provided


class CsvReimbursementRow(BaseModel):
    """One row from CSV upload; maps to amazon_reimbursements."""
    order_id: Optional[str] = None
    sku: Optional[str] = None
    asin: Optional[str] = None
    issue_type: Optional[str] = None
    amount: float = 0
    currency: str = "USD"
    date: Optional[date] = None
    notes: Optional[str] = None


class SummaryOut(BaseModel):
    total_amount: float
    row_count: int
    currency: str

    class Config:
        from_attributes = True

class SignupIn(BaseModel):
   name: str
   email: EmailStr
   password: str


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = 'bearer'


class CurrentUserOut(BaseModel):
    id: int
    email: EmailStr
    name: Optional[str] = None

    class Config:
        from_attributes = True

class ContactIn(BaseModel):
    name: str
    email: EmailStr
    message: str

class MessageOut(BaseModel):
    ok: bool
    message: str


class VerifyTokenIn(BaseModel):
    token: str


class ResendVerificationIn(BaseModel):
    email: EmailStr

# ---------- AMAZON STORE SCHEMAS ----------
class StoreBase(BaseModel):
    store_name: str
    region: Optional[str] = None
    marketplace_id: Optional[str] = None


class StoreCreate(StoreBase):
    pass


class StoreOut(StoreBase):
    id: int
    user_id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    is_connected: Optional[bool] = False  # From AmazonConnection

    class Config:
        from_attributes = True


class AmazonConnectionOut(BaseModel):
    id: int
    store_id: int
    selling_partner_id: str
    is_connected: bool
    last_sync_at: Optional[datetime] = None
    marketplace_ids: Optional[list[str]] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ---------- AMAZON OAUTH SCHEMAS ----------
class AmazonOAuthInitOut(BaseModel):
    """Response with authorization URL for seller to visit"""
    authorization_url: str
    state: str  # CSRF token for verification


class AmazonOAuthCallbackIn(BaseModel):
    """Request body when Amazon redirects back with authorization code"""
    spapi_oauth_code: str
    selling_partner_id: str
    state: str  # Must match the state from init
    redirect_uri: str | None = None  # Must match the URL used in the consent request (e.g. frontend callback URL)


class AmazonOAuthCallbackOut(BaseModel):
    """Response after successful OAuth callback"""
    store_id: int
    store_name: str
    message: str


class ReimbursementOut(BaseModel):
    id: int
    order_id: Optional[str] = None
    sku: Optional[str] = None
    asin: Optional[str] = None
    issue_type: Optional[str] = None
    amount: float
    currency: Optional[str] = None
    date: Optional[str] = None
    notes: Optional[str] = None

    class Config:
        from_attributes = True

    @classmethod
    def from_amazon_reimbursement(cls, item):
        """Map AmazonReimbursement model to ReimbursementOut schema"""
        return cls(
            id=item.id,
            order_id=item.amazon_order_id,
            sku=item.sku,
            asin=item.asin,
            issue_type=item.reason,
            amount=float(item.amount_total or 0),
            currency=item.currency_unit,
            date=item.approval_date.isoformat() if item.approval_date else None,
            notes=item.product_name,
        )