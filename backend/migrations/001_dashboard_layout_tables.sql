-- Dashboard layout → database table mapping
-- Run this on Neon (or your PostgreSQL DB) to create tables for every dashboard page that shows a table.
--
-- Layout / Page              | Table
-- ---------------------------|-----------------------------------
-- Dashboard                  | amazon_reimbursements (existing)
-- Cases                      | amazon_reimbursements (existing)
-- Documents                  | inbound_documents
-- Manage Stores              | stores (existing)
-- Orders                     | removal_orders
-- Users                      | users + user_store_access (role on users)
-- Settings (Payment Methods) | payment_methods
-- FBA Fees                   | fba_fees
-- Weight & Dims Alert NA     | weight_dims_alerts
-- W&D Successful Cases       | wd_successful_cases
-- Export/Import Dimensions   | export_import_dimensions

-- 1. Add role to users (Users dashboard)
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(32) DEFAULT 'User';

-- 2. User store access (Users dashboard: Store Access)
CREATE TABLE IF NOT EXISTS user_store_access (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ix_user_store_access_user_id ON user_store_access(user_id);
CREATE INDEX IF NOT EXISTS ix_user_store_access_store_id ON user_store_access(store_id);
CREATE UNIQUE INDEX IF NOT EXISTS ix_user_store_access_user_store ON user_store_access(user_id, store_id);

-- 3. Documents dashboard
CREATE TABLE IF NOT EXISTS inbound_documents (
    id SERIAL PRIMARY KEY,
    store_id INTEGER REFERENCES stores(id) ON DELETE SET NULL,
    fba_shipment_id VARCHAR(128),
    expires_at TIMESTAMPTZ,
    total_potential_value NUMERIC(12, 2),
    currency_unit VARCHAR(8),
    pod_bol_status VARCHAR(32),
    brand_registry_status VARCHAR(32),
    invoices_packing_list_status VARCHAR(32),
    packing_list_generator_status VARCHAR(32),
    case_action VARCHAR(64),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ix_inbound_documents_store_id ON inbound_documents(store_id);
CREATE INDEX IF NOT EXISTS ix_inbound_documents_fba_shipment_id ON inbound_documents(fba_shipment_id);

-- 4. Orders dashboard (Removal Orders)
CREATE TABLE IF NOT EXISTS removal_orders (
    id SERIAL PRIMARY KEY,
    store_id INTEGER REFERENCES stores(id) ON DELETE SET NULL,
    order_id VARCHAR(128),
    status VARCHAR(32),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ix_removal_orders_store_id ON removal_orders(store_id);
CREATE INDEX IF NOT EXISTS ix_removal_orders_order_id ON removal_orders(order_id);
CREATE INDEX IF NOT EXISTS ix_removal_orders_status ON removal_orders(status);

-- 5. Settings dashboard (Payment Methods)
CREATE TABLE IF NOT EXISTS payment_methods (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ix_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX IF NOT EXISTS ix_payment_methods_store_id ON payment_methods(store_id);

-- 6. FBA Fees dashboard
CREATE TABLE IF NOT EXISTS fba_fees (
    id SERIAL PRIMARY KEY,
    store_id INTEGER REFERENCES stores(id) ON DELETE SET NULL,
    title VARCHAR(255),
    sku VARCHAR(128),
    asin VARCHAR(32),
    status VARCHAR(64),
    updated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ix_fba_fees_store_id ON fba_fees(store_id);
CREATE INDEX IF NOT EXISTS ix_fba_fees_status ON fba_fees(status);

-- 7. Weight & Dims Alert NA dashboard
CREATE TABLE IF NOT EXISTS weight_dims_alerts (
    id SERIAL PRIMARY KEY,
    store_id INTEGER REFERENCES stores(id) ON DELETE SET NULL,
    title VARCHAR(255),
    sku VARCHAR(128),
    asin VARCHAR(32),
    status VARCHAR(64),
    updated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ix_weight_dims_alerts_store_id ON weight_dims_alerts(store_id);
CREATE INDEX IF NOT EXISTS ix_weight_dims_alerts_status ON weight_dims_alerts(status);

-- 8. W&D Successful Cases dashboard
CREATE TABLE IF NOT EXISTS wd_successful_cases (
    id SERIAL PRIMARY KEY,
    store_id INTEGER REFERENCES stores(id) ON DELETE SET NULL,
    title VARCHAR(255),
    sku VARCHAR(128),
    asin VARCHAR(32),
    status VARCHAR(64),
    updated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ix_wd_successful_cases_store_id ON wd_successful_cases(store_id);
CREATE INDEX IF NOT EXISTS ix_wd_successful_cases_status ON wd_successful_cases(status);

-- 9. Export/Import Dimensions dashboard
CREATE TABLE IF NOT EXISTS export_import_dimensions (
    id SERIAL PRIMARY KEY,
    store_id INTEGER REFERENCES stores(id) ON DELETE SET NULL,
    title VARCHAR(255),
    sku VARCHAR(128),
    asin VARCHAR(32),
    status VARCHAR(64),
    updated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ix_export_import_dimensions_store_id ON export_import_dimensions(store_id);
CREATE INDEX IF NOT EXISTS ix_export_import_dimensions_status ON export_import_dimensions(status);
