from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    Numeric,
    Text,
    Boolean,
    func,
    text,
    Index,
)
from .database import Base


class AmazonReimbursement(Base):
    __tablename__ = "amazon_reimbursements"

    id = Column(Integer, primary_key=True, index=True)
    approval_date = Column(DateTime(timezone=True), nullable=False, index=True)
    reimbursement_id = Column(String(64), nullable=False, unique=True)
    case_id = Column(String(64), nullable=True)
    amazon_order_id = Column(String(64), nullable=True)
    reason = Column(String(64), nullable=False, index=True)
    sku = Column(String(128), nullable=True)
    fnsku = Column(String(64), nullable=True)
    asin = Column(String(32), nullable=True)
    product_name = Column(Text, nullable=True)
    condition = Column(String(32), nullable=True)
    currency_unit = Column(String(8), nullable=False)
    amount_per_unit = Column(Numeric(12, 2), nullable=True)
    amount_total = Column(Numeric(12, 2), nullable=True)
    quantity_reimbursed_cash = Column(Numeric(12, 2), nullable=True)
    quantity_reimbursed_inventory = Column(Numeric(12, 2), nullable=True)
    quantity_reimbursed_total = Column(Numeric(12, 2), nullable=True)
    original_reimbursement_id = Column(String(64), nullable=True)
    original_reimbursement_type = Column(String(64), nullable=True)
    raw_payload = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        Index("ix_amazon_reimbursements_reason_date", "reason", "approval_date"),
    )


class User(Base):
   __tablename__ = 'users'
   id = Column(Integer, primary_key=True)
   name = Column(String(120))
   email = Column(String(255), unique=True, index=True, nullable=False)
   password_hash = Column(String(255), nullable=False)
   is_verified = Column(Boolean, nullable=False, server_default=text("false"))
   verification_token = Column(String(255), unique=True, nullable=True, index=True)
   verification_sent_at = Column(DateTime, nullable=True)
   verified_at = Column(DateTime, nullable=True)


class ContactMessage(Base):
    __tablename__ = 'contact_messages'
    id = Column(Integer, primary_key=True)
    name = Column(String(120))
    email = Column(String(255))
    message = Column(Text)
    created_at = Column(DateTime, server_default=func.now())