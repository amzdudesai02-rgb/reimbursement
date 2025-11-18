"""Business rules for classifying/validating reimbursements.
Adjust as needed after we see your CSV.
"""
from typing import Dict, Any, List


REQUIRED_FIELDS = ["amount"] # keep minimal; we’ll accept partial rows & warn




def validate_row(row: Dict[str, Any]) -> List[str]:
    errors = []
    for f in REQUIRED_FIELDS:
        if row.get(f) in (None, ""):
           errors.append(f"Missing required field: {f}")
    try:
        amt = float(row.get("amount", 0))
        if abs(amt) < 0.0001:
           errors.append("Amount is zero")
    except Exception:
        errors.append("Amount is not a number")
    return errors