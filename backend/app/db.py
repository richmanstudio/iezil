# app/db.py

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings

# Формируем URL подключения к MySQL
DATABASE_URL = (
    f"mysql+pymysql://{settings.DB_USER}:"
    f"{settings.DB_PASS}@{settings.DB_HOST}/{settings.DB_NAME}"
)

# Создаём движок SQLAlchemy
engine = create_engine(DATABASE_URL, pool_pre_ping=True)

# Сессии ORM
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Базовый класс для моделей
Base = declarative_base()

# Зависимость для получения сессии в эндпоинтах
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()