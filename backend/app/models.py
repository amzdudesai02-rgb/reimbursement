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
    store_id = Column(Integer, ForeignKey("stores.id", ondelete="SET NULL"), nullable=True, index=True)
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
   role = Column(String(32), nullable=True, server_default=text("'User'"))  # Admin | User


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
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    ip = Column(String(64), nullable=True, index=True)
    event_type = Column(String(64), nullable=False, index=True)  # e.g. login_success, login_failed
    detail = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", backref="security_events")

class Store(Base):
    """Represents an Amazon store/seller account"""
    __tablename__ = 'stores'
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete="CASCADE"), nullable=False, index=True)
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
    store_id = Column(Integer, ForeignKey('stores.id', ondelete="CASCADE"), nullable=False, unique=True, index=True)
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


class FbaShipment(Base):
    """Shipping Queue: Inventory → Shipping Queue (Fulfillment center / distribution center shipments)"""
    __tablename__ = "fba_shipments"

    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id", ondelete="SET NULL"), nullable=True, index=True)
    shipment_id = Column(String(128), nullable=False, index=True)
    reference_id = Column(String(128), nullable=True)
    shipment_name = Column(String(255), nullable=True)  # Shipment name / display
    created_at_utc = Column(DateTime(timezone=True), nullable=True)
    updated_at_utc = Column(DateTime(timezone=True), nullable=True)
    ship_to = Column(String(32), nullable=True)  # Destination fulfillment center
    sku_count = Column(Integer, nullable=True)
    expected_units = Column(Integer, nullable=True)
    status = Column(String(32), nullable=True, index=True)  # WORKING, SHIPPED, RECEIVING, CLOSED, etc.
    synced_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (Index("ix_fba_shipments_store_status", "store_id", "status"),)


class UserStoreAccess(Base):
    """User ↔ Store access (Users dashboard: Store Access column)"""
    __tablename__ = "user_store_access"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    store_id = Column(Integer, ForeignKey("stores.id", ondelete="CASCADE"), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (Index("ix_user_store_access_user_store", "user_id", "store_id", unique=True),)


class InboundDocument(Base):
    """Documents dashboard: Inbound Documents table"""
    __tablename__ = "inbound_documents"

    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id", ondelete="SET NULL"), nullable=True, index=True)
    fba_shipment_id = Column(String(128), nullable=True, index=True)
    expires_at = Column(DateTime(timezone=True), nullable=True)
    total_potential_value = Column(Numeric(12, 2), nullable=True)
    currency_unit = Column(String(8), nullable=True)
    pod_bol_status = Column(String(32), nullable=True)       # All, Submitted, Missing, Pending
    brand_registry_status = Column(String(32), nullable=True)
    invoices_packing_list_status = Column(String(32), nullable=True)
    packing_list_generator_status = Column(String(32), nullable=True)
    case_action = Column(String(64), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class RemovalOrder(Base):
    """Orders dashboard: Removal Orders table"""
    __tablename__ = "removal_orders"

    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id", ondelete="SET NULL"), nullable=True, index=True)
    order_id = Column(String(128), nullable=True, index=True)
    status = Column(String(32), nullable=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class PaymentMethod(Base):
    """Settings dashboard: Payment Methods table (Store Name, Actions)"""
    __tablename__ = "payment_methods"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    store_id = Column(Integer, ForeignKey("stores.id", ondelete="CASCADE"), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class FbaFee(Base):
    """FBA Fees dashboard table"""
    __tablename__ = "fba_fees"

    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id", ondelete="SET NULL"), nullable=True, index=True)
    title = Column(String(255), nullable=True)
    sku = Column(String(128), nullable=True)
    asin = Column(String(32), nullable=True)
    status = Column(String(64), nullable=True, index=True)
    updated_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class WeightDimsAlert(Base):
    """Weight & Dims Alert NA dashboard table"""
    __tablename__ = "weight_dims_alerts"

    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id", ondelete="SET NULL"), nullable=True, index=True)
    title = Column(String(255), nullable=True)
    sku = Column(String(128), nullable=True)
    asin = Column(String(32), nullable=True)
    status = Column(String(64), nullable=True, index=True)
    updated_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class WdSuccessfulCase(Base):
    """W&D Successful Cases dashboard table"""
    __tablename__ = "wd_successful_cases"

    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id", ondelete="SET NULL"), nullable=True, index=True)
    title = Column(String(255), nullable=True)
    sku = Column(String(128), nullable=True)
    asin = Column(String(32), nullable=True)
    status = Column(String(64), nullable=True, index=True)
    updated_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ExportImportDimension(Base):
    """Export/Import Dimensions dashboard table"""
    __tablename__ = "export_import_dimensions"

    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id", ondelete="SET NULL"), nullable=True, index=True)
    title = Column(String(255), nullable=True)
    sku = Column(String(128), nullable=True)
    asin = Column(String(32), nullable=True)
    status = Column(String(64), nullable=True, index=True)
    updated_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


# Alias for backward compatibility
Reimbursement = AmazonReimbursement