# Workflow: How Reimbursement Data Is Displayed in the Web App

Step-by-step flow from data source to the UI.

---

## Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   DATA SOURCE   │────►│    BACKEND      │────►│    DATABASE     │────►│   WEB APP (UI)  │
│  CSV or (later) │     │  /upload, APIs  │     │ amazon_reimb.   │     │ Dashboard/Cases │
│  Amazon SP-API  │     │                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
```

All reimbursement data is stored in one table: **`amazon_reimbursements`**.  
The web app only reads from this table. So anything you put here is what users see.

---

## Workflow A: Put Data In (so it can be displayed)

### Option 1 — CSV/TSV upload (current)

1. **User logs in**  
   Gets a JWT; API calls use `Authorization: Bearer <token>`.

2. **User opens Dashboard**  
   Route: `/dashboard`.

3. **User uploads a file**  
   - In the “Import from CSV” area, user selects a `.csv` or `.tsv`.
   - `UploadArea` sends it to the backend as `POST /api/upload` with the file in the body.

4. **Backend receives and processes**
   - `main.py` → `upload_reimbursements_csv()` handles `POST /api/upload`.
   - Reads the file with **pandas** (CSV or TSV by extension).
   - Calls **`csv_ingest.map_and_clean(df)`**:
     - Uses `utils.COL_ALIASES` to find columns (e.g. “order id” → `order_id`, “reason” → `issue_type`).
     - Builds one **`CsvReimbursementRow`** per row (order_id, sku, asin, issue_type, amount, currency, date, notes).
   - Calls **`crud.insert_reimbursements_from_csv(db, rows)`**:
     - Converts each `CsvReimbursementRow` into an **`AmazonReimbursement`** row.
     - Inserts into **`amazon_reimbursements`** and commits.

5. **UI refreshes**
   - `UploadArea`’s `onDone()` calls **`loadData()`**.
   - `loadData()` runs again and refetches summary + reimbursements.
   - New data appears on the Dashboard (and will appear on Cases when that page is opened).

**Required CSV columns (or aliases):**  
`order_id`, `sku`, `asin`, `issue_type`, `amount`, `currency`, `date`, `notes`.  
See `backend/app/utils.py` (COL_ALIASES) and `backend/app/csv_ingest.py` (EXPECTED).

### Option 2 — Amazon SP-API (future)

1. User clicks **“Connect Amazon”** on **Manage Stores** (`/stores`).
2. OAuth flow runs; refresh token is stored in **`amazon_connections`**.
3. A separate job/script (to be built) will:
   - Use that token to call Amazon Finances/Reports (or similar).
   - Map the response into **`AmazonReimbursement`** rows.
   - Insert into **`amazon_reimbursements`** (same as CSV path).
4. The web app does not change: it already reads from **`amazon_reimbursements`**, so new rows will show as soon as that job inserts them.

---

## Workflow B: How the Web App Displays Reimbursement Data

Everything the user sees comes from two API calls that read **`amazon_reimbursements`**.

### 1. Dashboard (`/dashboard`)

**When the page loads:**

1. **`loadData()`** runs (from `Dashboard.tsx`).
2. It calls in parallel:
   - **`GET /api/summary`**  
     - Backend: `crud.get_summary(db)`  
     - SQL: `SUM(amount_total)`, `COUNT(*)` on `amazon_reimbursements`  
     - Response: `{ total_amount, row_count, currency }`
   - **`GET /api/reimbursements?skip=0&limit=500`**  
     - Backend: `crud.list_reimbursements(db, skip=0, limit=500)`  
     - SQL: `SELECT * FROM amazon_reimbursements ORDER BY id OFFSET 0 LIMIT 500`  
     - Response: list of `{ id, order_id, sku, asin, issue_type, amount, currency, date, notes }`
   - **`GET /api/stores`**  
     - Used for “Connect Amazon” and store filter; not the source of reimbursement numbers.

3. **State is set:**  
   `setSummary(...)`, `setReimbursements(...)`, `setStores(...)`.

4. **UI renders:**
   - **“Total Recovered”** = `summary.total_amount` and `summary.row_count`.
   - **Breakdown by reason** = reimbursements grouped by `issue_type`, showing sum of `amount` and count.
   - **“Import from CSV”** uses `UploadArea`; after a successful upload, `onDone` calls **`loadData()`** again, so Total Recovered and breakdown update without a full reload.

**Files:**
- **`frontend/src/pages/Dashboard.tsx`** — defines `loadData()`, calls `/summary` and `/reimbursements`, renders cards and breakdown.
- **`frontend/src/components/UploadArea.tsx`** — sends file to `POST /api/upload`, then runs `onDone()` (which is `loadData()`).

### 2. Cases / Reimbursements table (`/cases`)

**When the page loads:**

1. **`useEffect`** runs and calls:
   - **`GET /api/reimbursements?skip=0&limit=1000`**  
     - Same backend and table as Dashboard: `crud.list_reimbursements(db, skip=0, limit=1000)`.
   - **`GET /api/stores`**  
     - For the store filter and “Connect Amazon” prompt.

2. **State is set:**  
   `setReimbursements(...)`, `setStores(...)`.

3. **UI renders:**
   - Table with columns: **Date**, **Order ID**, **SKU**, **ASIN**, **Issue**, **Amount**.
   - Rows come from `reimbursements` (i.e. from **`amazon_reimbursements`** via `/api/reimbursements`).
   - Search/filter and pagination work on this in-memory list.

**Files:**
- **`frontend/src/pages/Cases.tsx`** — fetches `/reimbursements` and `/stores`, renders the table and filters.

### 3. Backend: from DB to JSON

For **`GET /api/summary`**:

- **`main.py`** → `summary()` → **`crud.get_summary(db)`**.
- **`crud.get_summary`** runs aggregation on **`models.Reimbursement`** (i.e. **`amazon_reimbursements`**), returns `{ total_amount, row_count, currency }`.
- **`main.py`** returns that as **`SummaryOut`**.

For **`GET /api/reimbursements`**:

- **`main.py`** → `list_items()` → **`crud.list_reimbursements(db, skip, limit)`**.
- **`crud.list_reimbursements`** queries **`amazon_reimbursements`** with offset/limit.
- Each row is converted with **`ReimbursementOut.from_amazon_reimbursement(item)`**  
  (maps e.g. `amount_total` → `amount`, `reason` → `issue_type`, `approval_date` → `date`, `product_name` → `notes`).
- **`main.py`** returns a list of **`ReimbursementOut`**.

**Files:**
- **`backend/app/main.py`** — defines `GET /api/summary` and `GET /api/reimbursements`, calls crud and schemas.
- **`backend/app/crud.py`** — `get_summary()`, `list_reimbursements()`.
- **`backend/app/schemas.py`** — `SummaryOut`, `ReimbursementOut`, `ReimbursementOut.from_amazon_reimbursement()`.
- **`backend/app/models.py`** — `AmazonReimbursement` (table **`amazon_reimbursements`**).

---

## End-to-end summary

| Step | What happens |
|------|----------------|
| 1. Data in DB | Rows are inserted into **`amazon_reimbursements`** (today: via **CSV upload** → **`POST /api/upload`** → **`csv_ingest.map_and_clean`** → **`crud.insert_reimbursements_from_csv`**). |
| 2. User opens Dashboard | **`loadData()`** runs → **`GET /api/summary`** + **`GET /api/reimbursements`** → backend reads **`amazon_reimbursements`** and returns JSON. |
| 3. Dashboard shows numbers | “Total Recovered” uses **`summary.total_amount`** and **`summary.row_count`**; breakdown uses **`reimbursements`** grouped by **`issue_type`**. |
| 4. User opens Cases | Page fetches **`GET /api/reimbursements`** → same table → table shows **Date, Order ID, SKU, ASIN, Issue, Amount** for each row. |
| 5. User uploads CSV | **`POST /api/upload`** → **`map_and_clean`** → **`insert_reimbursements_from_csv`** → new rows in **`amazon_reimbursements`** → **`onDone()`** calls **`loadData()`** → Dashboard (and later Cases) show the new data. |

So: **to display reimbursement data in the web app**, you only need rows in **`amazon_reimbursements`**.  
The app never “ingests” on its own; it only **reads** that table via **`/api/summary`** and **`/api/reimbursements`** and renders it on Dashboard and Cases.
