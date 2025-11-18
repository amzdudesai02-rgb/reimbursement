import re
from datetime import datetime
from typing import Optional

DATE_FORMATS =[
    "%Y-%m-%d", "%d-%m-%Y", "%m/%d/%Y", "%d/%m/%Y", "%b %d, %Y", "%d %b %Y",
]

COL_ALIASES = {
    "order_id": ["order id", "order-id", "amazon order-id", "order" ],
    "sku": ["seller sku","sku"],
    "asin": ["asin", "product asin"],
    "issue_type": ["issue type", "reason", "type"],
    "amount": ["amount", "reimbursed amount", "total amount", "value"],
    "currency": ["currency"],
    "date": ["date", "posted date", "transaction date", "reimbursement date"],
    "notes": ["notes", "comment", "details"],
}
def normalize_header(h: str) -> str:
    return re.sub(r"\s+", " ", h.strip().lower())

def pick_column(header_map: dict, key: str) -> Optional[str]:
    candidates = [normalize_header(c) for c in COL_ALIASES.get(key, [])]
    for col, norm in header_map.items():
        if norm == key or norm in candidates:
            return col
    return None
def parse_date(v: str):
    if v is None or v == "":
        return None
    for fmt in DATE_FORMATS:
        try:
             return datetime.strptime(str(v), fmt).date()
        except Exception:
            continue
    # Try pandas to_datetime style numeric dates (e.g., Excel serials) are handled upstream
    return None