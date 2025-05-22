# app/routers/users.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas, security
from ..db import get_db

router = APIRouter()


@router.get(
    "/",
    response_model=List[schemas.UserOut],
    summary="Получить список всех пользователей (админ)"
)
def list_users(
    db: Session = Depends(get_db),
    admin: models.User = Depends(security.require_superuser)
):
    return db.query(models.User).all()


@router.get(
    "/{user_id}",
    response_model=schemas.UserOut,
    summary="Получить пользователя по ID (админ)"
)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin: models.User = Depends(security.require_superuser)
):
    user = db.query(models.User).get(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Пользователь не найден"
        )
    return user