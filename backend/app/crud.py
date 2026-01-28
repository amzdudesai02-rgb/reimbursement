from datetime import datetime, timezone
from sqlalchemy.orm import Session
from . import models, schemas
from typing import Iterable, List, Optional, Optional

def get_reimbursements(db: Session):
    return db.query(models.Reimbursement).all()

def create_user(db: Session, user: schemas.UserCreate):
    new_user = models.User(**user.model_dump())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def bulk_insert_reimbursements(db: Session, rows: Iterable[schemas.ReimbursementCreate]):
    objs = [models.Reimbursement(**r.model_dump()) for r in rows]
    db.add_all(objs)
    db.flush() # get IDs
    return objs


def insert_reimbursements_from_csv(db: Session, rows: List[schemas.CsvReimbursementRow]) -> int:
    """Insert CSV rows into amazon_reimbursements. Returns count inserted."""
    now = datetime.now(timezone.utc)
    objs = []
    for i, r in enumerate(rows):
        approval_dt = now
        if r.date:
            approval_dt = datetime.combine(r.date, datetime.min.time()).replace(tzinfo=timezone.utc)
        reimb_id = f"csv-{int(now.timestamp()*1000)}-{i}"[:64]
        obj = models.AmazonReimbursement(
            approval_date=approval_dt,
            reimbursement_id=reimb_id,
            amazon_order_id=r.order_id,
            reason=(r.issue_type or "unknown")[:64],
            sku=(r.sku[:128] if r.sku else None),
            asin=(r.asin[:32] if r.asin else None),
            product_name=r.notes,
            currency_unit=(r.currency or "USD")[:8],
            amount_total=r.amount,
        )
        objs.append(obj)
    db.add_all(objs)
    db.commit()
    return len(objs)




def get_summary(db: Session, store_ids: Optional[List[int]] = None):
    from sqlalchemy import func
    if store_ids is not None and len(store_ids) == 0:
        return {"total_amount": 0.0, "row_count": 0, "currency": "USD"}
    q = db.query(
        func.coalesce(func.sum(models.Reimbursement.amount_total), 0),
        func.count(models.Reimbursement.id)
    )
    if store_ids is not None and len(store_ids) > 0:
        q = q.filter(models.Reimbursement.store_id.in_(store_ids))
    total, count = q.one()
    return {
        "total_amount": float(total or 0),
        "row_count": int(count or 0),
        "currency": "USD",
    }


def list_reimbursements(
    db: Session, skip: int = 0, limit: int = 100, store_ids: Optional[List[int]] = None
):
    if store_ids is not None and len(store_ids) == 0:
        return []
    q = db.query(models.Reimbursement)
    if store_ids is not None and len(store_ids) > 0:
        q = q.filter(models.Reimbursement.store_id.in_(store_ids))
    return q.order_by(models.Reimbursement.approval_date.desc()).offset(skip).limit(limit).all()


def insert_or_ignore_reimbursements_from_financial_events(db: Session, events: List[dict]) -> int:
    """Insert reimbursement rows from SP-API financial events. Skips duplicates by reimbursement_id. Returns count inserted. Each event must have 'store_id'."""
    inserted = 0
    reimb_ids = [e["reimbursement_id"] for e in events]
    if not reimb_ids:
        return 0
    existing_ids = {r[0] for r in db.query(models.AmazonReimbursement.reimbursement_id).filter(
        models.AmazonReimbursement.reimbursement_id.in_(reimb_ids)
    ).all()}
    for ev in events:
        if ev["reimbursement_id"] in existing_ids:
            continue
        store_id = ev.get("store_id")
        obj = models.AmazonReimbursement(
            store_id=store_id,
            approval_date=ev["approval_date"],
            reimbursement_id=ev["reimbursement_id"][:64],
            reason=(ev.get("reason") or "Unknown")[:64],
            currency_unit=(ev.get("currency_unit") or "USD")[:8],
            amount_total=ev.get("amount_total"),
            amazon_order_id=(ev.get("amazon_order_id") or "")[:64] or None,
            sku=(ev.get("sku") or "")[:128] or None,
            asin=(ev.get("asin") or "")[:32] or None,
            product_name=ev.get("product_name"),
            fnsku=(ev.get("fnsku") or "")[:64] or None,
        )
        db.add(obj)
        existing_ids.add(ev["reimbursement_id"])
        inserted += 1
    if inserted:
        db.commit()
    return inserted