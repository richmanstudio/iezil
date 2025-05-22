# app/main.py

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from .db import engine, Base
from .routers import auth, users, products, orders, categories, promocodes

# Создаём таблицы в базе (если ещё нет)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Iezil API",
    description="Backend for Iezil digital store",
    version="1.0.0"
)

# Раздача статических файлов (изображения продуктов)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Подключаем роутеры
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(products.router, prefix="/api/products", tags=["products"])
app.include_router(orders.router, prefix="/api/orders", tags=["orders"])
app.include_router(categories.router, prefix="/api/categories", tags=["categories"])
app.include_router(promocodes.router, prefix="/api/promocodes", tags=["promocodes"])