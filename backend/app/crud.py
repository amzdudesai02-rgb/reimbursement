from sqlalchemy.orm import Session
from . import models, schemas
from typing import Iterable

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




def get_summary(db: Session):
    from sqlalchemy import func
    # Use amount_total from AmazonReimbursement model
    q = db.query(
        func.coalesce(func.sum(models.Reimbursement.amount_total), 0),
        func.count(models.Reimbursement.id)
    )
    total, count = q.one()
    return {
        "total_amount": float(total or 0),
        "row_count": int(count or 0),
        "currency": "USD",
    }




def list_reimbursements(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Reimbursement).offset(skip).limit(limit).all()