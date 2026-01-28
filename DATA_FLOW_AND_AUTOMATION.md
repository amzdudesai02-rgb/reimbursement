# How Reimbursement Data Reaches the UI (Data Flow & Automation)

This doc describes what code connects so that **reimbursement data shows automatically** in the app.

---

## End-to-end flow

```
[ CSV upload ]  ──►  POST /api/upload  ──►  csv_ingest + crud  ──►  DB (amazon_reimbursements)
                                                                         │
[ Amazon OAuth ] ──►  Connect Amazon   ──►  stores + connections          │
                                                                         ▼
[ UI ]  ◄──  GET /api/summary  ──►  crud.get_summary(db)  ◄──  amazon_reimbursements
[ UI ]  ◄──  GET /api/reimbursements  ──►  crud.list_reimbursements(db)  ◄──  same table
```

---

## 1. What fills the database

Data gets into `amazon_reimbursements` in two ways:

### A. CSV/TSV upload (automated in-app)

| Step | Code | Role |
|------|------|------|
| User chooses file in Dashboard | `frontend/src/pages/Dashboard.tsx` | Renders `UploadArea` |
| File sent to backend | `frontend/src/components/UploadArea.tsx` | `api.post('/upload', form)` |
| Backend receives file | `backend/app/main.py` → `upload_reimbursements_csv()` | `POST /api/upload` |
| Parse CSV | `backend/app/csv_ingest.py` → `map_and_clean(df)` | Uses `utils.normalize_header`, `pick_column`, `parse_date` |
| Map to DB rows | `backend/app/crud.py` → `insert_reimbursements_from_csv(db, rows)` | Builds `AmazonReimbursement` from `CsvReimbursementRow` |
| Write to DB | `crud.insert_reimbursements_from_csv` | `db.add_all(objs); db.commit()` |

After upload, the Dashboard calls `loadData()` again, so new rows show up in **Total Recovered** and in **Cases** without a full reload.

**CSV columns** (names or aliases):  
`order_id`, `sku`, `asin`, `issue_type`, `amount`, `currency`, `date`, `notes`.  
See `backend/app/utils.py` → `COL_ALIASES` and `backend/app/csv_ingest.py` → `EXPECTED`.

### B. Amazon SP-API sync (future)

When you add a job that pulls from Amazon Finances/Reports and writes to `amazon_reimbursements`, that will use the **same** table. The UI already reads from it via `/summary` and `/reimbursements`, so no frontend change is needed.

---

## 2. What the UI reads

| UI surface | API used | Backend |
|------------|----------|---------|
| Dashboard – Total Recovered, breakdown | `GET /api/summary` | `crud.get_summary(db)` |
| Dashboard – same data + list | `GET /api/reimbursements?skip=0&limit=500` | `crud.list_reimbursements(db)` |
| Cases – table | `GET /api/reimbursements?skip=0&limit=1000` | `crud.list_reimbursements(db)` |

All of these read from the **same** table: `amazon_reimbursements`.  
So **anything** you insert (CSV upload today, SP-API tomorrow) automatically appears in Dashboard and Cases.

---

## 3. Files that implement “automate the data shows”

| File | Role |
|------|------|
| `backend/app/main.py` | `POST /api/upload`, `GET /api/summary`, `GET /api/reimbursements` |
| `backend/app/csv_ingest.py` | `map_and_clean(df)` — CSV → `CsvReimbursementRow[]` |
| `backend/app/crud.py` | `insert_reimbursements_from_csv()`, `get_summary()`, `list_reimbursements()` |
| `backend/app/schemas.py` | `CsvReimbursementRow` (upload), `ReimbursementOut` (API response) |
| `backend/app/models.py` | `AmazonReimbursement` → table `amazon_reimbursements` |
| `frontend/src/pages/Dashboard.tsx` | Loads summary + reimbursements, shows `UploadArea`, refetches after upload |
| `frontend/src/components/UploadArea.tsx` | Calls `POST /api/upload` and then `onDone()` to refetch |

---

## 4. Quick check: “Did my code connect?”

- **Upload CSV**  
  Dashboard → “Import from CSV” → choose `.csv`/`.tsv` → after success, Total Recovered and Cases should update (Dashboard calls `loadData()` in `onDone`).

- **Backend**  
  - `POST /api/upload` exists and uses `map_and_clean` and `insert_reimbursements_from_csv`.  
  - `GET /api/summary` and `GET /api/reimbursements` both use `amazon_reimbursements`.

- **CSV shape**  
  Headers should match (or alias to):  
  `order_id`, `sku`, `asin`, `issue_type`, `amount`, `currency`, `date`, `notes`.

---

## 5. Optional: automate without clicking “Upload”

To have data show without a manual upload:

1. **Scheduled CSV ingest**  
   Run a script/cron that:
   - Fetches or reads a CSV (e.g. from S3, email, shared drive),
   - Calls `POST /api/upload` (with auth) or calls `map_and_clean` + `insert_reimbursements_from_csv` in process.

2. **Amazon SP-API sync**  
   Add a background job or cron that:
   - Uses stored tokens (from “Connect Amazon”) to call Finances/Reports,
   - Maps responses to `AmazonReimbursement` rows,
   - Inserts into `amazon_reimbursements`.  
   The same Dashboard/Cases endpoints will then show that data automatically.
