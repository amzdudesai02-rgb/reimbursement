"""
Sync reimbursement-related data from Amazon SP-API Finances into amazon_reimbursements.
Data is displayed in the app only via this automation (no CSV).
"""
from datetime import datetime, timezone, timedelta
from typing import Any, Dict, List, Optional
import hashlib
import json

from .sp_api_client import SPAPIClient


FINANCES_PATH = "/finances/v0/financialEvents"
MAX_PAGES = 50


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
    amt = ev.get("AdjustmentAmount") or ev.get("Amount") or ev.get("TotalAmount")
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
    amt = ev.get("AdjustmentAmount") or ev.get("Amount") or ev.get("TotalAmount")
    if isinstance(amt, dict):
        cc = amt.get("CurrencyCode") or (amt.get("Currency", {}) or {})
        if isinstance(cc, dict):
            return (cc.get("CurrencyCode") or "USD")[:8]
        return (str(cc) or "USD")[:8]
    return "USD"


def _extract_from_adjustment(adj: Dict[str, Any], store_id: int, index: int) -> Optional[Dict[str, Any]]:
    posted = _parse_iso(adj.get("PostedDate") or adj.get("TransactionPostedDate"))
    if not posted:
        return None
    amount = _amount_cents(adj)
    if amount is None:
        amount = 0.0
    reason = (adj.get("AdjustmentType") or adj.get("AdjustmentItemList", [{}])[0].get("AdjustmentType") or "Adjustment")[:64]
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
    reimb_id = _stable_id([store_id, "safet", posted.isoformat(), ev.get("SAFETClaimId"), index])
    return {
        "store_id": store_id,
        "approval_date": posted,
        "reimbursement_id": reimb_id,
        "reason": "SAFETReimbursement"[:64],
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


def _flatten(items: List[Any]) -> List[Dict[str, Any]]:
    out: List[Dict[str, Any]] = []
    for x in items:
        if isinstance(x, list):
            out.extend(x)
        elif x is not None:
            out.append(x)
    return out


def fetch_reimbursement_events(
    client: SPAPIClient,
    store_id: int,
    posted_after: Optional[datetime] = None,
    posted_before: Optional[datetime] = None,
) -> List[Dict[str, Any]]:
    """
    Call SP-API Finances and return a list of row dicts suitable for
    insert_or_ignore_reimbursements_from_financial_events.
    """
    # Use full 180-day window (API max) so we don't miss data
    now = datetime.now(timezone.utc)
    if posted_after is None:
        posted_after = now - timedelta(days=180)
    if posted_before is None:
        posted_before = now
    # Clamp to now; SP-API returns 400 if PostedBefore is in the future
    if posted_before > now:
        posted_before = now
    after_str = posted_after.strftime("%Y-%m-%dT%H:%M:%SZ")
    before_str = posted_before.strftime("%Y-%m-%dT%H:%M:%SZ")

    all_rows: List[Dict[str, Any]] = []
    next_token: Optional[str] = None
    pages = 0

    while pages < MAX_PAGES:
        params: Dict[str, Any] = {"PostedAfter": after_str, "PostedBefore": before_str, "MaxResultsPerPage": 100}
        if next_token:
            params["NextToken"] = next_token
        try:
            data = client.request("GET", FINANCES_PATH, params=params)
        except Exception as e:
            import logging
            logging.getLogger(__name__).warning("Finances API request failed for store_id=%s: %s", store_id, e)
            raise
        payload = data.get("payload") or data
        next_token = payload.get("NextToken")
        # Support both payload.FinancialEvents and top-level FinancialEvents
        events = payload.get("FinancialEvents") or data.get("FinancialEvents") or payload
        if not isinstance(events, dict):
            events = {}

        # AdjustmentEventList (FBA reimbursements, etc.)
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

        # RefundEventList (optional)
        for i, ev in enumerate(events.get("RefundEventList") or []):
            row = _extract_refund(ev, store_id, i)
            if row:
                all_rows.append(row)

        pages += 1
        if not next_token:
            break

    return all_rows
