# app/routers/products.py

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas, security
from ..db import get_db
from ..utils import save_image_to_storage

router = APIRouter()


@router.post(
    "/",
    response_model=schemas.ProductOut,
    status_code=status.HTTP_201_CREATED,
    summary="Создать новый товар"
)
def create_product(
    product_in: schemas.ProductCreate,
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin: models.User = Depends(security.require_superuser)
):
    # Сохраняем изображение и получаем его URL
    image_url = save_image_to_storage(image)
    product = models.Product(
        name=product_in.name,
        category=product_in.category,
        sizes=product_in.sizes,
        price=product_in.price,
        description=product_in.description,
        image_url=image_url
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.get(
    "/",
    response_model=List[schemas.ProductOut],
    summary="Получить список товаров"
)
def read_products(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return db.query(models.Product).offset(skip).limit(limit).all()


@router.get(
    "/{product_id}",
    response_model=schemas.ProductOut,
    summary="Получить товар по ID"
)
def read_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    product = db.query(models.Product).get(product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Товар не найден"
        )
    return product


@router.put(
    "/{product_id}",
    response_model=schemas.ProductOut,
    summary="Обновить товар"
)
def update_product(
    product_id: int,
    product_in: schemas.ProductUpdate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(security.require_superuser)
):
    product = db.query(models.Product).get(product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Товар не найден"
        )
    for field, value in product_in.dict(exclude_unset=True).items():
        setattr(product, field, value)
    db.commit()
    db.refresh(product)
    return product


@router.delete(
    "/{product_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Удалить товар"
)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    admin: models.User = Depends(security.require_superuser)
):
    product = db.query(models.Product).get(product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Товар не найден"
        )
    db.delete(product)
    db.commit()