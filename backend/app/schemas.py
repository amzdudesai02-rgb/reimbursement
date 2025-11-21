from pydantic import BaseModel, EmailStr
from datetime import datetime
from pydantic import BaseModel
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