# app/routers/orders.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas, security
from ..db import get_db

router = APIRouter()


@router.post("/", response_model=schemas.OrderOut, summary="Создать новый заказ")
def create_order(
    order_in: schemas.OrderCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.require_active_user)
):
    order = models.Order(
        user_id=current_user.id,
        items=[item.dict() for item in order_in.items],
        total=order_in.total
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    return order


@router.get("/", response_model=List[schemas.OrderOut], summary="Получить свои заказы")
def read_my_orders(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.require_active_user)
):
    return db.query(models.Order).filter(models.Order.user_id == current_user.id).all()


@router.get("/all", response_model=List[schemas.OrderOut], summary="Получить все заказы (админ)")
def read_all_orders(
    db: Session = Depends(get_db),
    admin: models.User = Depends(security.require_superuser)
):
    return db.query(models.Order).all()


@router.put("/{order_id}/status", response_model=schemas.OrderOut, summary="Изменить статус заказа")
def update_order_status(
    order_id: int,
    status: str,
    db: Session = Depends(get_db),
    admin: models.User = Depends(security.require_superuser)
):
    order = db.query(models.Order).get(order_id)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Заказ не найден"
        )
    order.status = status
    db.commit()
    db.refresh(order)
    return order