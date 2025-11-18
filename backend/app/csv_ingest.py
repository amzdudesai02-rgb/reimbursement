import pandas as pd
from typing import List, Tuple
from .utils import normalize_header, pick_column, parse_date
from .schemas import ReimbursementCreate




EXPECTED = ["order_id","sku","asin","issue_type","amount","currency","date","notes"]




def map_and_clean(df: pd.DataFrame) -> Tuple[List[ReimbursementCreate], List[str]]:
    # Normalize headers
    header_map = {col: normalize_header(col) for col in df.columns}


    # Find columns
    colmap = {}
    for key in EXPECTED:
        colmap[key] = pick_column(header_map, key)


    rows: List[ReimbursementCreate] = []
    errors: List[str] = []


    # Coerce amounts & dates
    for i, r in df.iterrows():
        try:
            amount_raw = r[colmap["amount"]] if colmap["amount"] else 0
            try:
                amount = float(str(amount_raw).replace(",", ""))
            except Exception:
                amount = 0


            currency = (str(r[colmap["currency"]]).strip() if colmap["currency"] else "USD") or "USD"


            # Date handling: try utils.parse_date first, else pandas to_datetime
            date_val = None
            if colmap["date"] and pd.notna(r[colmap["date"]]):
                date_val = parse_date(str(r[colmap["date"]]))
                if date_val is None:
                   try:
                       date_val = pd.to_datetime(r[colmap["date"]]).date()
                   except Exception:
                       date_val = None


            rc = ReimbursementCreate(
                order_id=(str(r[colmap["order_id"]]).strip() if colmap["order_id"] else None),
                sku=(str(r[colmap["sku"]]).strip() if colmap["sku"] else None),
                asin=(str(r[colmap["asin"]]).strip() if colmap["asin"] else None),
                issue_type=(str(r[colmap["issue_type"]]).strip() if colmap["issue_type"] else None),
                amount=amount,
                currency=currency,
                date=date_val,
                notes=(str(r[colmap["notes"]]).strip() if colmap["notes"] else None),
            )
            rows.append(rc)
        except Exception as e:
            errors.append(f"Row {i+1}: {e}")
    return rows, errors