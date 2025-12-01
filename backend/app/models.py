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
    ForeignKey,
    JSON,
)
from sqlalchemy.orm import relationship
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


class SecurityEvent(Base):
    """Security/audit log for auth and sensitive actions"""
    __tablename__ = "security_events"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    ip = Column(String(64), nullable=True, index=True)
    event_type = Column(String(64), nullable=False, index=True)  # e.g. login_success, login_failed
    detail = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", backref="security_events")

class Store(Base):
    """Represents an Amazon store/seller account"""
    __tablename__ = 'stores'
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    store_name = Column(String(255), nullable=False)
    region = Column(String(50), nullable=True)  # US, CA, UK, etc.
    marketplace_id = Column(String(50), nullable=True)  # ATVPDKIKX0DER for US
    is_active = Column(Boolean, nullable=False, server_default=text("true"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", backref="stores")
    amazon_connection = relationship("AmazonConnection", back_populates="store", uselist=False)


class AmazonConnection(Base):
    """Stores OAuth tokens and credentials for Amazon SP-API"""
    __tablename__ = 'amazon_connections'
    
    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey('stores.id'), nullable=False, unique=True, index=True)
    selling_partner_id = Column(String(255), nullable=False, unique=True, index=True)
    
    # LWA (Login with Amazon) tokens
    lwa_refresh_token = Column(Text, nullable=False)  # Encrypted in production
    lwa_access_token = Column(Text, nullable=True)  # Short-lived, cached
    lwa_token_expires_at = Column(DateTime(timezone=True), nullable=True)
    
    # AWS credentials for signing requests
    aws_access_key_id = Column(String(255), nullable=True)
    aws_secret_access_key = Column(Text, nullable=True)  # Encrypted in production
    aws_session_token = Column(Text, nullable=True)  # From STS AssumeRole
    aws_session_expires_at = Column(DateTime(timezone=True), nullable=True)
    
    # Additional metadata
    marketplace_ids = Column(JSON, nullable=True)  # List of marketplace IDs seller operates in
    mws_auth_token = Column(String(255), nullable=True)  # Legacy MWS token if needed
    
    # Status
    is_connected = Column(Boolean, nullable=False, server_default=text("true"))
    last_sync_at = Column(DateTime(timezone=True), nullable=True)
    last_error = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    store = relationship("Store", back_populates="amazon_connection")


# Alias for backward compatibility
Reimbursement = AmazonReimbursement