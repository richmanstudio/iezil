# app/routers/promocodes.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas, security
from ..db import get_db

router = APIRouter()


@router.post(
    "/",
    response_model=schemas.PromocodeOut,
    status_code=status.HTTP_201_CREATED,
    summary="Создать новый промокод"
)
def create_promocode(
    promocode_in: schemas.PromocodeCreate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(security.require_superuser)
):
    existing = db.query(models.Promocode).filter(models.Promocode.code == promocode_in.code).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Промокод с таким кодом уже существует"
        )
    promocode = models.Promocode(
        code=promocode_in.code,
        discount=promocode_in.discount
    )
    db.add(promocode)
    db.commit()
    db.refresh(promocode)
    return promocode


@router.get(
    "/",
    response_model=List[schemas.PromocodeOut],
    summary="Получить список промокодов"
)
def read_promocodes(db: Session = Depends(get_db)):
    return db.query(models.Promocode).all()


@router.delete(
    "/{promocode_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Удалить промокод"
)
def delete_promocode(
    promocode_id: int,
    db: Session = Depends(get_db),
    admin: models.User = Depends(security.require_superuser)
):
    promocode = db.query(models.Promocode).get(promocode_id)
    if not promocode:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Промокод не найден"
        )
    db.delete(promocode)
    db.commit()