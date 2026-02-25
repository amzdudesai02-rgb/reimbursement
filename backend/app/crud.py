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




def get_summary(
    db: Session,
    store_ids: Optional[List[int]] = None,
    days_back: Optional[int] = None,
    date_after: Optional[str] = None,
    date_before: Optional[str] = None,
):
    from sqlalchemy import func
    from datetime import datetime, timezone, timedelta
    if store_ids is not None and len(store_ids) == 0:
        return {"total_amount": 0.0, "row_count": 0, "currency": "USD"}
    q = db.query(
        func.coalesce(func.sum(models.Reimbursement.amount_total), 0),
        func.count(models.Reimbursement.id)
    )
    if store_ids is not None and len(store_ids) > 0:
        q = q.filter(models.Reimbursement.store_id.in_(store_ids))
    if date_after is not None and date_after.strip():
        try:
            start = datetime.fromisoformat(date_after.strip() + "T00:00:00+00:00")
            q = q.filter(models.Reimbursement.approval_date >= start)
        except ValueError:
            pass
    if date_before is not None and date_before.strip():
        try:
            end = datetime.fromisoformat(date_before.strip() + "T23:59:59.999999+00:00")
            q = q.filter(models.Reimbursement.approval_date <= end)
        except ValueError:
            pass
    if days_back is not None and days_back > 0 and date_after is None and date_before is None:
        since = datetime.now(timezone.utc) - timedelta(days=days_back)
        q = q.filter(models.Reimbursement.approval_date >= since)
    total, count = q.one()
    return {
        "total_amount": float(total or 0),
        "row_count": int(count or 0),
        "currency": "USD",
    }


def list_reimbursements(
    db: Session,
    skip: int = 0,
    limit: int = 500,
    store_ids: Optional[List[int]] = None,
    days_back: Optional[int] = None,
    date_after: Optional[str] = None,
    date_before: Optional[str] = None,
):
    from datetime import datetime, timezone, timedelta
    if store_ids is not None and len(store_ids) == 0:
        return []
    q = db.query(models.Reimbursement)
    if store_ids is not None and len(store_ids) > 0:
        q = q.filter(models.Reimbursement.store_id.in_(store_ids))
    if date_after is not None and date_after.strip():
        try:
            start = datetime.fromisoformat(date_after.strip() + "T00:00:00+00:00")
            q = q.filter(models.Reimbursement.approval_date >= start)
        except ValueError:
            pass
    if date_before is not None and date_before.strip():
        try:
            end = datetime.fromisoformat(date_before.strip() + "T23:59:59.999999+00:00")
            q = q.filter(models.Reimbursement.approval_date <= end)
        except ValueError:
            pass
    if days_back is not None and days_back > 0 and date_after is None and date_before is None:
        since = datetime.now(timezone.utc) - timedelta(days=days_back)
        q = q.filter(models.Reimbursement.approval_date >= since)
    return q.order_by(models.Reimbursement.approval_date.desc()).offset(skip).limit(min(limit, 10000)).all()


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
            case_id=(ev.get("case_id") or "")[:64] or None,
            condition=(ev.get("condition") or "")[:32] or None,
            amount_per_unit=ev.get("amount_per_unit"),
            quantity_reimbursed_cash=ev.get("quantity_reimbursed_cash"),
            quantity_reimbursed_inventory=ev.get("quantity_reimbursed_inventory"),
            quantity_reimbursed_total=ev.get("quantity_reimbursed_total"),
            original_reimbursement_id=(ev.get("original_reimbursement_id") or "")[:64] or None,
            original_reimbursement_type=(ev.get("original_reimbursement_type") or "")[:64] or None,
        )
        db.add(obj)
        existing_ids.add(ev["reimbursement_id"])
        inserted += 1
    if inserted:
        db.commit()
    return inserted


def upsert_shipments(db: Session, rows: List[dict]) -> int:
    """Insert or update fba_shipments from inbound sync. Returns count upserted."""
    if not rows:
        return 0
    updated = 0
    for r in rows:
        store_id = r.get("store_id")
        sid = (r.get("shipment_id") or "")[:128]
        if not sid:
            continue
        existing = db.query(models.FbaShipment).filter(
            models.FbaShipment.store_id == store_id,
            models.FbaShipment.shipment_id == sid,
        ).first()
        if existing:
            existing.reference_id = (r.get("reference_id") or "")[:128] or None
            existing.shipment_name = (r.get("shipment_name") or "")[:255] or None
            existing.created_at_utc = r.get("created_at_utc")
            existing.updated_at_utc = r.get("updated_at_utc")
            existing.ship_to = (r.get("ship_to") or "")[:32] or None
            existing.sku_count = r.get("sku_count")
            existing.expected_units = r.get("expected_units")
            existing.status = (r.get("status") or "")[:32] or None
            updated += 1
        else:
            obj = models.FbaShipment(
                store_id=store_id,
                shipment_id=sid,
                reference_id=(r.get("reference_id") or "")[:128] or None,
                shipment_name=(r.get("shipment_name") or "")[:255] or None,
                created_at_utc=r.get("created_at_utc"),
                updated_at_utc=r.get("updated_at_utc"),
                ship_to=(r.get("ship_to") or "")[:32] or None,
                sku_count=r.get("sku_count"),
                expected_units=r.get("expected_units"),
                status=(r.get("status") or "")[:32] or None,
            )
            db.add(obj)
            updated += 1
    if updated:
        db.commit()
    return updated


def list_shipments(db: Session, store_ids: Optional[List[int]] = None, skip: int = 0, limit: int = 100):
    """List fba_shipments for display (Shipping Queue)."""
    q = db.query(models.FbaShipment)
    if store_ids is not None and len(store_ids) > 0:
        q = q.filter(models.FbaShipment.store_id.in_(store_ids))
    return q.order_by(models.FbaShipment.updated_at_utc.desc()).offset(skip).limit(limit).all()