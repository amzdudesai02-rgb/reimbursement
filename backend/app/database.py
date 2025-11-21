import os
from contextlib import contextmanager

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

DEFAULT_POSTGRES = "postgresql+psycopg://postgres:postgres@localhost:5432/amz_reimbursements"
DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_POSTGRES)

# Connection args for SQLite vs PostgreSQL
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
    pool_settings = {}
else:
    # Neon/PostgreSQL connection settings
    connect_args = {}
    pool_settings = {
        "pool_pre_ping": True,  # Verify connections before using
        "pool_size": 5,  # Number of connections to maintain
        "max_overflow": 10,  # Additional connections beyond pool_size
        "pool_recycle": 300,  # Recycle connections after 5 minutes
        "pool_reset_on_return": "commit",  # Reset connections on return
    }

engine = create_engine(
    DATABASE_URL,
    echo=False,
    future=True,
    connect_args=connect_args,
    **pool_settings,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, future=True)
Base = declarative_base()


@contextmanager
def get_session():
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()