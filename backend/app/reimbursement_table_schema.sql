-- Amazon Reimbursement table: same format as Amazon's report/spreadsheet columns.
-- Table is created automatically by the app (models.Base.metadata.create_all).
-- Use this file as reference for the exact column list and types (PostgreSQL).
--
-- Amazon column (spreadsheet/report) -> DB column
-- approval-date                 -> approval_date
-- reimbursement-id              -> reimbursement_id
-- case-id                       -> case_id
-- amazon-order-id               -> amazon_order_id
-- reason                        -> reason
-- sku                           -> sku
-- fnsku                         -> fnsku
-- asin                          -> asin
-- product-name                  -> product_name
-- condition                     -> condition
-- currency-unit                 -> currency_unit
-- amount-per-unit               -> amount_per_unit
-- amount-total                  -> amount_total
-- quantity-reimbursed-cash      -> quantity_reimbursed_cash
-- quantity-reimbursed-inventory -> quantity_reimbursed_inventory
-- quantity-reimbursed-total     -> quantity_reimbursed_total
-- original-reimbursement-id     -> original_reimbursement_id
-- original-reimbursement-type   -> original_reimbursement_type

CREATE TABLE IF NOT EXISTS amazon_reimbursements (
    id SERIAL PRIMARY KEY,
    store_id INTEGER REFERENCES stores(id) ON DELETE SET NULL,
    approval_date TIMESTAMPTZ NOT NULL,
    reimbursement_id VARCHAR(64) NOT NULL UNIQUE,
    case_id VARCHAR(64),
    amazon_order_id VARCHAR(64),
    reason VARCHAR(64) NOT NULL,
    sku VARCHAR(128),
    fnsku VARCHAR(64),
    asin VARCHAR(32),
    product_name TEXT,
    condition VARCHAR(32),
    currency_unit VARCHAR(8) NOT NULL,
    amount_per_unit NUMERIC(12, 2),
    amount_total NUMERIC(12, 2),
    quantity_reimbursed_cash NUMERIC(12, 2),
    quantity_reimbursed_inventory NUMERIC(12, 2),
    quantity_reimbursed_total NUMERIC(12, 2),
    original_reimbursement_id VARCHAR(64),
    original_reimbursement_type VARCHAR(64),
    raw_payload TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_amazon_reimbursements_store_id ON amazon_reimbursements(store_id);
CREATE INDEX IF NOT EXISTS ix_amazon_reimbursements_approval_date ON amazon_reimbursements(approval_date);
CREATE INDEX IF NOT EXISTS ix_amazon_reimbursements_reason ON amazon_reimbursements(reason);
CREATE INDEX IF NOT EXISTS ix_amazon_reimbursements_reason_date ON amazon_reimbursements(reason, approval_date);
