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
    total_reimbursements: float
    total_orders: int
    average_refund: Optional[float] = None

    class Config:
        orm_mode = True

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
    order_id: str
    reason: str
    amount: float
    status: str
    created_at: datetime

    class Config:
        orm_mode = True