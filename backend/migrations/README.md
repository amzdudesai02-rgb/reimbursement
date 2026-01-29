# Database migrations

Run SQL migrations against your Neon (or PostgreSQL) database when adding new tables or columns.

## Dashboard layout → table mapping

| Dashboard page | Database table |
|----------------|----------------|
| Dashboard | `amazon_reimbursements` |
| Cases | `amazon_reimbursements` |
| Documents | `inbound_documents` |
| Manage Stores | `stores` |
| Orders | `removal_orders` |
| Users | `users` + `user_store_access` |
| Settings (Payment Methods) | `payment_methods` |
| FBA Fees | `fba_fees` |
| Weight & Dims Alert NA | `weight_dims_alerts` |
| W&D Successful Cases | `wd_successful_cases` |
| Export/Import Dimensions | `export_import_dimensions` |

## How to run

1. Open **Neon Console** → your project → **SQL Editor**.
2. Paste the contents of `001_dashboard_layout_tables.sql`.
3. Execute.

Alternatively, use `psql` or any PostgreSQL client with your `DATABASE_URL`.

The app also runs `ensure_user_columns()` at startup (adds `users.role` if missing) and `create_all` for new tables when using the same DB.
