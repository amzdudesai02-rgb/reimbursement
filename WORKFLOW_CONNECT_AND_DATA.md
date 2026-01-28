# Workflow: Connect Amazon (popup + auto-close) and fetch Reimbursement + Shipping Queue

## 1. Connect Amazon flow (new tab + auto-close)

**Goal:** Client clicks “Connect Amazon” → Amazon Seller Central opens in a **new tab** → client logs in and approves → that tab **closes automatically** → your app continues with the connection and can fetch data.

### Current behavior
- “Connect Amazon” does a **full redirect** (`window.location.href = authorization_url`).
- User leaves your app, completes OAuth on Amazon, then is sent to your callback URL (often in the same tab).

### Target behavior (popup)

| Step | Action |
|------|--------|
| 1 | User clicks “Connect Amazon” in your app. |
| 2 | Your app opens `authorization_url` in a **new window/tab** (`window.open(authorization_url, 'amazon-connect', 'width=600,height=700')`). |
| 3 | User logs in to Amazon Seller Central (if needed) and approves the app in that tab. |
| 4 | Amazon redirects to your **callback URL** inside that same tab (e.g. `https://yoursite.com/auth/amazon/callback?spapi_oauth_code=...&selling_partner_id=...&state=...`). |
| 5 | Your **callback page** (in the popup): |
|    | (a) Sends the code to your backend (e.g. `POST /api/auth/amazon/callback`), |
|    | (b) On success, posts a message to the opener: `window.opener.postMessage({ type: 'AMAZON_CONNECTED', ... }, origin)`, |
|    | (c) Calls `window.close()`. |
| 6 | Your **main app** listens for `message` and, when it receives `AMAZON_CONNECTED`, refreshes stores (and can start syncing reimbursement + shipping queue). |

**Implementation notes:**
- Backend: `GET /api/auth/amazon/init` accepts optional `?redirect_uri=...` so the frontend can pass its callback URL (e.g. `https://yoursite.com/auth/amazon/callback`). Use this for the popup flow so Amazon redirects to your frontend.
- Frontend: **ManageStores** calls init with `params: { redirect_uri: window.location.origin + '/auth/amazon/callback' }`, uses `window.open(authUrl)` for a new tab, and listens for `message` type `AMAZON_CONNECTED` to refresh stores and call `POST /api/sync`.
- **AmazonAuthCallback**: On success, if `window.opener` exists it does `postMessage({ type: 'AMAZON_CONNECTED', ... })` and `window.close()`; otherwise redirects to `/stores`.
- Callback must run on the **same origin** as the opener so `postMessage` is allowed.

---

## 2. Reimbursement data (Reports → Fulfillment → Reimbursement)

**Source:** SP-API **Reports API**, report type **`GET_FBA_REIMBURSEMENTS_DATA`**.

**Columns (from your screenshot) and report attributes:**

| Your screenshot column | SP-API report attribute / source |
|------------------------|----------------------------------|
| Date | `approval-date` |
| Reimbursement ID | `reimbursement-id` |
| Case ID | `case-id` |
| Amazon Order Id | `amazon-order-id` |
| Reason | `reason` |
| Merchant SKU | `sku` |
| FNSKU | `fnsku` |
| ASIN | `asin` |
| Title | `product-name` |
| Condition | `condition` |
| Amount Per Unit | `amount-per-unit` |
| Amount Total | `amount-total` |
| Quantity Reimbursed [Cash] | `quantity-reimbursed-cash` |
| Quantity Reimbursed [Inventory] | `quantity-reimbursed-inventory` |
| Quantity Reimbursed [Total] | `quantity-reimbursed-total` |
| Original Reimbursement ID | `original-reimbursement-id` |
| Original Reimbursement Type | `original-reimbursement-type` |

**API flow:**
1. `POST /reports/2021-06-30/reports` with `reportType: "GET_FBA_REIMBURSEMENTS_DATA"` and `marketplaceIds`.
2. Poll `GET /reports/2021-06-30/reports/{reportId}` until `processingStatus === DONE` (or CANCELLED/FAILED).
3. Use `reportDocumentId` from the report, then `GET /documents/2021-06-30/documents/{documentId}` to download the report (e.g. tab-separated or JSON).
4. Parse and map into your `amazon_reimbursements` (or equivalent) so the UI can show the same columns.

**Limitation:** FBA reimbursement reports are generated at most about once every several hours; you cannot request a new document too frequently.

---

## 3. Shipping Queue data (Inventory → Shipping Queue)

**Source:** SP-API **Fulfillment Inbound API** – **list inbound shipments** (e.g. `GET /fba/inbound/2024-03-20/shipments` or the equivalent in your API version).  
This corresponds to “Fulfillment center shipments” / “Amazon distribution center shipments” and “Export table data” on the Shipping Queue page.

**Columns (from your screenshot) and typical API/usage mapping:**

| Your screenshot column | Inbound API / usage |
|------------------------|---------------------|
| Shipment name | Shipment ID + Reference ID (e.g. `shipmentId`, `shipmentName` or similar in the list response). |
| Created | `createdAt` or similar (create time of the shipment). |
| Last updated | `updatedAt` or last update time. |
| Ship to | Destination fulfillment center code (e.g. `destinationFulfillmentCenterId` or `shipToFulfillmentCenterId`). |
| SKUs | Count or list of SKUs in the shipment (from shipment items or summary fields). |
| Expected units | “Located units, Prime eligible units” – from shipment item summaries or a related report if the list endpoint doesn’t expose them. |
| Status | `status` (e.g. WORKING, SHIPPED, IN_TRANSIT, RECEIVING, CLOSED, etc.). |
| Next steps | UI-only (e.g. “Track shipment”); not an API field. |

**API flow:**
1. Call the Fulfillment Inbound **list shipments** (or **getShipments**) endpoint with optional filters: date range, status, etc.
2. Paginate with `nextToken` if the response returns more than one page.
3. For “Expected units” / “Located units, Prime eligible units,” use shipment-detail or shipment-items endpoints if the list response doesn’t include them.

**Report alternative:** If you need the *exact* “Export table data” layout from Shipping Queue, check the Reports API for an FBA inbound/shipment report type that matches that export (e.g. under [Report type values – FBA](https://developer-docs.amazon.com/sp-api/docs/report-type-values-fba)); otherwise, the Inbound API list is the main programmatic source for “Shipping Queue”–style data.

---

## 4. End-to-end sequence

```
[User]  Clicks “Connect Amazon”
   →
[App]   Opens Amazon OAuth URL in new tab (popup)
   →
[User]  Logs in to Seller Central (in that tab) and approves app
   →
[Amazon] Redirects to your callback URL in the same tab
   →
[Callback page]
  - POST /api/auth/amazon/callback with code & selling_partner_id
  - postMessage(AMAZON_CONNECTED) to opener
  - window.close()
   →
[App]   On AMAZON_CONNECTED:
   - Refresh stores list
   - Optionally trigger “Sync” that:
     a) Requests GET_FBA_REIMBURSEMENTS_DATA and, when ready, downloads and stores reimbursement rows (all columns above).
     b) Calls Fulfillment Inbound list shipments and stores Shipping Queue rows (shipment name, created, last updated, ship to, SKUs, expected units, status).
   - Show reimbursement and shipping-queue data in your UI (tables matching the screenshots).
```

---

## 5. Implementation checklist

- [ ] **Connect Amazon (popup):** In ManageStores, use `window.open(authUrl)` and add a `message` listener for `AMAZON_CONNECTED`; refresh stores on success.
- [ ] **Callback in popup:** In AmazonAuthCallback, after successful backend callback, `postMessage` to `opener` and `window.close()`. If no opener (direct open of callback URL), redirect to `/stores` or dashboard instead.
- [ ] **Reimbursement:** Add Reports API client logic: create `GET_FBA_REIMBURSEMENTS_DATA`, poll until done, download document, parse and map all columns into DB/UI.
- [ ] **Shipping Queue:** Add Fulfillment Inbound client logic: list shipments, map to “Shipment name, Created, Last updated, Ship to, SKUs, Expected units, Status” and store/display.
- [ ] **Sync endpoint:** Extend `POST /api/sync` (or add dedicated endpoints) to run reimbursement report + inbound list per connected store and persist/return data for the UI.
