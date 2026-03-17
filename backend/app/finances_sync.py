"""
Sync reimbursement-related data from Amazon SP-API Finances into amazon_reimbursements.
Data is displayed in the app only via this automation (no CSV).

Fetches in 30-day windows (API returns empty if PostedAfter–PostedBefore > 180 days),
follows NextToken for full pagination, parses multiple event lists, and applies
negative amount for reversals.
"""
from datetime import datetime, timezone, timedelta
from typing import Any, Dict, List, Optional
import hashlib
import json
import logging

from .sp_api_client import SPAPIClient


logger = logging.getLogger(__name__)
FINANCES_PATH = "/finances/v0/financialEvents"
MAX_PAGES = 50
DAYS_PER_WINDOW = 30  # Fetch in 30-day chunks to avoid incomplete results
# How far back to fetch when no explicit posted_after is given.
# Keep this modest to avoid hammering SP-API and hitting QuotaExceeded.
BACKFILL_DAYS = 90


def _parse_iso(s: Optional[str]) -> Optional[datetime]:
    if not s:
        return None
    try:
        dt = datetime.fromisoformat(s.replace("Z", "+00:00"))
        return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)
    except Exception:
        return None


def _stable_id(parts: List[Any]) -> str:
    h = hashlib.sha256(json.dumps(parts, sort_keys=True, default=str).encode()).hexdigest()
    return f"fin-{h}"[:64]


def _amount_cents(ev: Dict[str, Any]) -> Optional[float]:
    amt = (
        ev.get("AdjustmentAmount")
        or ev.get("Amount")
        or ev.get("TotalAmount")
        or ev.get("ReimbursedAmount")
        or ev.get("ReimbursementAmount")
    )
    if amt is None:
        return None
    if isinstance(amt, (int, float)):
        return float(amt)
    cur = amt.get("CurrencyAmount") or amt.get("Currency", {})
    if isinstance(cur, dict):
        val = cur.get("CurrencyAmount") or cur.get("Amount")
        return float(val) if val is not None else None
    return None


def _currency(ev: Dict[str, Any]) -> str:
    amt = (
        ev.get("AdjustmentAmount")
        or ev.get("Amount")
        or ev.get("TotalAmount")
        or ev.get("ReimbursedAmount")
        or ev.get("ReimbursementAmount")
    )
    if isinstance(amt, dict):
        cc = amt.get("CurrencyCode") or (amt.get("Currency", {}) or {})
        if isinstance(cc, dict):
            return (cc.get("CurrencyCode") or "USD")[:8]
        return (str(cc) or "USD")[:8]
    return "USD"


def _apply_reversal(amount: float, reason: str, event_type: str = "") -> float:
    """Reversals should reduce totals: use negative amount."""
    if not reason and not event_type:
        return amount
    combined = f"{reason} {event_type}".upper()
    if "REVERSAL" in combined:
        return -abs(amount) if amount != 0 else 0.0
    return amount


def _extract_from_adjustment(adj: Dict[str, Any], store_id: int, index: int) -> Optional[Dict[str, Any]]:
    posted = _parse_iso(adj.get("PostedDate") or adj.get("TransactionPostedDate"))
    if not posted:
        return None
    amount = _amount_cents(adj)
    if amount is None:
        amount = 0.0
    reason = (adj.get("AdjustmentType") or adj.get("AdjustmentItemList", [{}])[0].get("AdjustmentType") or "Adjustment")[:64]
    amount = _apply_reversal(amount, reason)
    items = adj.get("AdjustmentItemList") or []
    if not items:
        reimb_id = _stable_id([store_id, "adj", posted.isoformat(), reason, amount, index])
        return {
            "store_id": store_id,
            "approval_date": posted,
            "reimbursement_id": reimb_id,
            "reason": reason,
            "currency_unit": _currency(adj),
            "amount_total": amount,
            "amazon_order_id": adj.get("AmazonOrderId"),
            "sku": None,
            "asin": None,
            "product_name": None,
        }
    rows = []
    for i, it in enumerate(items):
        _sku = it.get("SellerSKU") or it.get("FnSKU")
        sku = _sku[:128] if _sku else None
        _a = it.get("ASIN")
        asin = _a[:32] if _a else None
        reimb_id = _stable_id([
            store_id, "adj", posted.isoformat(), reason,
            it.get("OriginalReimbursementId"), sku, asin, i
        ])
        item_amount = None
        if "PerUnitAmount" in it or "TotalAmount" in it:
            pu = it.get("PerUnitAmount") or it.get("TotalAmount")
            if isinstance(pu, dict):
                item_amount = pu.get("CurrencyAmount") or pu.get("Amount")
            else:
                item_amount = pu
        if item_amount is None and len(items) == 1:
            item_amount = amount
        amt = float(item_amount) if item_amount is not None else amount
        amt = _apply_reversal(amt, reason)
        rows.append({
            "store_id": store_id,
            "approval_date": posted,
            "reimbursement_id": reimb_id,
            "reason": reason,
            "currency_unit": _currency(adj),
            "amount_total": amt,
            "amazon_order_id": it.get("AmazonOrderId") or adj.get("AmazonOrderId"),
            "sku": sku,
            "asin": asin,
            "product_name": (it.get("ProductDescription") or None),
            "fnsku": (it.get("FnSKU") or "")[:64] or None,
        })
    return rows


def _extract_safet(ev: Dict[str, Any], store_id: int, index: int) -> Optional[Dict[str, Any]]:
    posted = _parse_iso(ev.get("PostedDate") or ev.get("ReimbursedDate"))
    if not posted:
        return None
    amount = _amount_cents(ev)
    if amount is None:
        amount = 0.0
    reason = "SAFETReimbursement"
    amount = _apply_reversal(amount, reason, ev.get("ReimbursementEventType") or "")
    reimb_id = _stable_id([store_id, "safet", posted.isoformat(), ev.get("SAFETClaimId"), index])
    return {
        "store_id": store_id,
        "approval_date": posted,
        "reimbursement_id": reimb_id,
        "reason": reason[:64],
        "currency_unit": _currency(ev),
        "amount_total": amount,
        "amazon_order_id": ev.get("AmazonOrderId"),
        "sku": (ev.get("SellerSKU") or "")[:128] or None,
        "asin": (ev.get("ASIN") or "")[:32] or None,
        "product_name": ev.get("ProductDescription") or ev.get("Description"),
    }


def _extract_refund(ev: Dict[str, Any], store_id: int, index: int) -> Optional[Dict[str, Any]]:
    posted = _parse_iso(ev.get("PostedDate") or ev.get("RefundPostedDate"))
    if not posted:
        return None
    amount = _amount_cents(ev)
    if amount is None:
        amount = 0.0
    amount = _apply_reversal(amount, "Refund", ev.get("RefundEventType") or "")
    reimb_id = _stable_id([store_id, "refund", posted.isoformat(), ev.get("AmazonOrderId"), index])
    return {
        "store_id": store_id,
        "approval_date": posted,
        "reimbursement_id": reimb_id,
        "reason": "Refund"[:64],
        "currency_unit": _currency(ev),
        "amount_total": amount,
        "amazon_order_id": ev.get("AmazonOrderId"),
        "sku": None,
        "asin": None,
        "product_name": None,
    }


def _extract_reimbursement_event(ev: Dict[str, Any], store_id: int, index: int) -> Optional[Dict[str, Any]]:
    """ReimbursementEventList from FinancialEvents (main FBA reimbursement list)."""
    posted = _parse_iso(ev.get("PostedDate"))
    if not posted:
        return None
    amount = _amount_cents(ev)
    if amount is None:
        amount = 0.0
    event_type = (ev.get("ReimbursementEventType") or ev.get("ReimbursementType") or "")[:64]
    reason = (ev.get("ReasonCode") or ev.get("AdjustmentReasonCode") or "Reimbursement")[:64]
    amount = _apply_reversal(amount, reason, event_type)
    reimb_id = _stable_id([
        store_id,
        "reimb",
        posted.isoformat(),
        ev.get("ReimbursementId") or ev.get("AmazonOrderId"),
        ev.get("SellerSKU"),
        ev.get("ASIN"),
        index,
    ])
    return {
        "store_id": store_id,
        "approval_date": posted,
        "reimbursement_id": reimb_id,
        "reason": reason or "Reimbursement",
        "currency_unit": _currency(ev),
        "amount_total": amount,
        "amazon_order_id": ev.get("AmazonOrderId"),
        "sku": (ev.get("SellerSKU") or ev.get("FnSKU") or "")[:128] or None,
        "asin": (ev.get("ASIN") or "")[:32] or None,
        "product_name": ev.get("ProductDescription") or ev.get("Description"),
        "fnsku": (ev.get("FnSKU") or "")[:64] or None,
    }


def _flatten(items: List[Any]) -> List[Dict[str, Any]]:
    out: List[Dict[str, Any]] = []
    for x in items:
        if isinstance(x, list):
            out.extend(x)
        elif x is not None:
            out.append(x)
    return out


def _fetch_one_window(
    client: SPAPIClient,
    store_id: int,
    after_str: str,
    before_str: str,
) -> List[Dict[str, Any]]:
    """Fetch one date window (all pages via NextToken) and return normalized rows."""
    all_rows: List[Dict[str, Any]] = []
    next_token: Optional[str] = None
    pages = 0

    while pages < MAX_PAGES:
        params: Dict[str, Any] = {"PostedAfter": after_str, "PostedBefore": before_str, "MaxResultsPerPage": 100}
        if next_token:
            params["NextToken"] = next_token
        data = client.request("GET", FINANCES_PATH, params=params)
        payload = data.get("payload") or data
        next_token = payload.get("NextToken")
        events = payload.get("FinancialEvents") or data.get("FinancialEvents") or payload
        if not isinstance(events, dict):
            events = {}

        # ReimbursementEventList (main FBA reimbursement list)
        for i, ev in enumerate(events.get("ReimbursementEventList") or []):
            row = _extract_reimbursement_event(ev, store_id, i)
            if row:
                all_rows.append(row)

        # AdjustmentEventList (FBA reimbursements, adjustments, reversals)
        for i, adj in enumerate(events.get("AdjustmentEventList") or []):
            r = _extract_from_adjustment(adj, store_id, i)
            if isinstance(r, list):
                all_rows.extend(r)
            elif r:
                all_rows.append(r)

        # SAFETReimbursementEventList
        for i, ev in enumerate(events.get("SAFETReimbursementEventList") or []):
            row = _extract_safet(ev, store_id, i)
            if row:
                all_rows.append(row)

        # RefundEventList
        for i, ev in enumerate(events.get("RefundEventList") or []):
            row = _extract_refund(ev, store_id, i)
            if row:
                all_rows.append(row)

        pages += 1
        if not next_token:
            break

    return all_rows


def fetch_reimbursement_events(
    client: SPAPIClient,
    store_id: int,
    posted_after: Optional[datetime] = None,
    posted_before: Optional[datetime] = None,
    max_posted_before: Optional[datetime] = None,
) -> List[Dict[str, Any]]:
    """
    Call SP-API Finances and return a list of row dicts suitable for
    insert_or_ignore_reimbursements_from_financial_events.
    Fetches in 30-day windows to avoid empty/incomplete responses (API requires
    PostedBefore to be close to "now", but allows historical backfill as long
    as each window is <= 180 days wide).
    PostedBefore is always at least 5 minutes before now.
    max_posted_before: optional cap (e.g. client time) so PostedBefore is never in the future.
    """
    now_utc = datetime.now(timezone.utc)
    max_allowed_before = now_utc - timedelta(minutes=5)
    cap = max_posted_before if max_posted_before is not None else max_allowed_before
    cap = min(cap, max_allowed_before)
    window_end = posted_before if posted_before is not None else cap
    window_end = min(window_end, cap)

    # Backfill at least BACKFILL_DAYS worth of history when posted_after is not provided.
    # This lets us fetch significantly more than 5–6 days of data (up to 1 year by default).
    window_start = posted_after if posted_after is not None else (cap - timedelta(days=BACKFILL_DAYS))
    # Never go further back than BACKFILL_DAYS below the cap unless caller explicitly passes posted_after.
    window_start = max(window_start, cap - timedelta(days=BACKFILL_DAYS))

    all_rows: List[Dict[str, Any]] = []
    while window_start < window_end:
        chunk_end = min(window_start + timedelta(days=DAYS_PER_WINDOW), window_end)
        after_str = window_start.strftime("%Y-%m-%dT%H:%M:%SZ")
        before_str = chunk_end.strftime("%Y-%m-%dT%H:%M:%SZ")
        logger.info(
            "Finances window store_id=%s: PostedAfter=%s PostedBefore=%s",
            store_id,
            after_str,
            before_str,
        )
        try:
            rows = _fetch_one_window(client, store_id, after_str, before_str)
            all_rows.extend(rows)
        except Exception as e:
            logger.warning("Finances API request failed for store_id=%s window %s–%s: %s", store_id, after_str, before_str, e)
            raise
        window_start = chunk_end

    return all_rows
