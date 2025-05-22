# app/routers/categories.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas, security
from ..db import get_db

router = APIRouter()


@router.post("/", response_model=schemas.CategoryOut, summary="Создать новую категорию")
def create_category(
    category_in: schemas.CategoryCreate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(security.require_superuser)
):
    existing = db.query(models.Category).filter(models.Category.name == category_in.name).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Категория с таким именем уже существует"
        )
    category = models.Category(name=category_in.name)
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


@router.get("/", response_model=List[schemas.CategoryOut], summary="Получить список категорий")
def read_categories(db: Session = Depends(get_db)):
    return db.query(models.Category).all()


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Удалить категорию")
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    admin: models.User = Depends(security.require_superuser)
):
    category = db.query(models.Category).get(category_id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Категория не найдена"
        )
    db.delete(category)
    db.commit()