"""
Fetch Reports → Fulfillment → Reimbursement via SP-API Reports API (GET_FBA_REIMBURSEMENTS_DATA).
Maps report columns to amazon_reimbursements rows.
"""
from datetime import datetime, timezone, timedelta
from typing import Any, Dict, List, Optional
import csv
import io
import time

import httpx
from .sp_api_client import SPAPIClient

REPORTS_PATH = "/reports/2021-06-30/reports"
DOCUMENTS_PATH = "/documents/2021-06-30/documents"
REPORT_TYPE = "GET_FBA_REIMBURSEMENTS_DATA"
POLL_INTERVAL = 15
MAX_WAIT_SEC = 600
# Default lookback window for the FBA reimbursement report when no explicit dates are provided.
# 365 days ensures we always request at least a year of data (more than the 180-day minimum requested).
BACKFILL_DAYS = 365


def _parse_approval_date(s: Optional[str]) -> Optional[datetime]:
    if not s or not s.strip():
        return None
    try:
        dt = datetime.fromisoformat(s.strip().replace("Z", "+00:00"))
        return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)
    except Exception:
        return None


def _parse_float(s: Optional[str]) -> Optional[float]:
    if s is None or not str(s).strip():
        return None
    try:
        return float(str(s).strip().replace(",", ""))
    except ValueError:
        return None


def fetch_reimbursements_report(
    client: SPAPIClient,
    store_id: int,
    marketplace_id: str,
    data_start_time: Optional[datetime] = None,
    data_end_time: Optional[datetime] = None,
) -> List[Dict[str, Any]]:
    """
    Request GET_FBA_REIMBURSEMENTS_DATA, wait for completion, download and parse.
    Returns list of row dicts suitable for insert_or_ignore (reimbursement_id, approval_date, reason, etc.).
    """
    if data_end_time is None:
        data_end_time = datetime.now(timezone.utc)
    if data_start_time is None:
        data_start_time = data_end_time - timedelta(days=BACKFILL_DAYS)

    body: Dict[str, Any] = {
        "reportType": REPORT_TYPE,
        "marketplaceIds": [marketplace_id],
    }
    body["dataStartTime"] = data_start_time.strftime("%Y-%m-%dT%H:%M:%SZ")
    body["dataEndTime"] = data_end_time.strftime("%Y-%m-%dT%H:%M:%SZ")

    create_resp = client.request("POST", REPORTS_PATH, body=body)
    report_id = create_resp.get("reportId")
    if not report_id:
        return []

    # Poll until done
    started = time.monotonic()
    while time.monotonic() - started < MAX_WAIT_SEC:
        report = client.request("GET", f"{REPORTS_PATH}/{report_id}")
        status = (report.get("processingStatus") or "").upper()
        if status == "DONE":
            break
        if status in ("CANCELLED", "FATAL"):
            return []
        time.sleep(POLL_INTERVAL)

    report_document_id = report.get("reportDocumentId")
    if not report_document_id:
        return []

    doc_resp = client.request("GET", f"{DOCUMENTS_PATH}/{report_document_id}")
    url = doc_resp.get("url")
    if not url:
        return []

    # Download document (presigned URL; no SP-API auth needed)
    with httpx.Client() as http:
        r = http.get(url, timeout=60.0)
        r.raise_for_status()
        raw = r.content

    # Parse TSV (typical for this report)
    encoding = "utf-8"
    try:
        text = raw.decode(encoding)
    except UnicodeDecodeError:
        text = raw.decode("latin-1")
    reader = csv.DictReader(io.StringIO(text), delimiter="\t")
    rows: List[Dict[str, Any]] = []
    for i, row in enumerate(reader):
        # Amazon report may send reimbursement-id as number or string
        raw_reimb = row.get("reimbursement-id") or row.get("reimbursement_id") or ""
        reimb_id = (str(raw_reimb).strip() if raw_reimb else "") or f"rpt-{report_id}-{i}"
        reimb_id = reimb_id[:64]
        approval = _parse_approval_date(row.get("approval-date") or row.get("approval_date"))
        if not approval:
            continue
        reason = (row.get("reason") or "Unknown")[:64]
        currency = (row.get("currency-unit") or row.get("currency_unit") or "USD")[:8]
        amount_total = _parse_float(row.get("amount-total") or row.get("amount_total"))
        amount_per_unit = _parse_float(row.get("amount-per-unit") or row.get("amount_per_unit"))
        qty_cash = _parse_float(row.get("quantity-reimbursed-cash") or row.get("quantity_reimbursed_cash"))
        qty_inv = _parse_float(row.get("quantity-reimbursed-inventory") or row.get("quantity_reimbursed_inventory"))
        qty_total = _parse_float(row.get("quantity-reimbursed-total") or row.get("quantity_reimbursed_total"))
        rows.append({
            "store_id": store_id,
            "approval_date": approval,
            "reimbursement_id": reimb_id,
            "case_id": ((row.get("case-id") or row.get("case_id") or "").strip()[:64] or None),
            "amazon_order_id": (row.get("amazon-order-id") or row.get("amazon_order_id") or "")[:64] or None,
            "reason": reason,
            "sku": (row.get("sku") or "")[:128] or None,
            "fnsku": (row.get("fnsku") or "")[:64] or None,
            "asin": (row.get("asin") or "")[:32] or None,
            "product_name": (row.get("product-name") or row.get("product_name")) or None,
            "condition": (row.get("condition") or "")[:32] or None,
            "currency_unit": currency,
            "amount_per_unit": amount_per_unit,
            "amount_total": amount_total,
            "quantity_reimbursed_cash": qty_cash,
            "quantity_reimbursed_inventory": qty_inv,
            "quantity_reimbursed_total": qty_total,
            "original_reimbursement_id": (row.get("original-reimbursement-id") or row.get("original_reimbursement_id")) or None,
            "original_reimbursement_type": (row.get("original-reimbursement-type") or row.get("original_reimbursement_type")) or None,
        })
    return rows
