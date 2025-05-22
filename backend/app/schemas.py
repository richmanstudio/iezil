# app/schemas.py

from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

# --- USERS ---
class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    email: EmailStr
    is_active: bool

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# --- PRODUCTS ---
class ProductBase(BaseModel):
    name: str
    category: str
    sizes: List[str]
    price: int
    description: Optional[str]

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str]
    category: Optional[str]
    sizes: Optional[List[str]]
    price: Optional[int]
    description: Optional[str]

class ProductOut(ProductBase):
    id: int
    image_url: Optional[str]

    class Config:
        orm_mode = True


# --- ORDERS ---
class OrderItem(BaseModel):
    product_id: int
    name: str
    price: int
    quantity: int
    size: str

class OrderCreate(BaseModel):
    items: List[OrderItem]
    total: int

class OrderOut(BaseModel):
    id: int
    user_id: int
    items: List[OrderItem]
    total: int
    status: str
    created_at: datetime

    class Config:
        orm_mode = True


# --- CATEGORIES ---
class CategoryBase(BaseModel):
    name: str

class CategoryCreate(CategoryBase):
    pass

class CategoryOut(CategoryBase):
    id: int

    class Config:
        orm_mode = True


# --- PROMOCODES ---
class PromocodeBase(BaseModel):
    code: str
    discount: int

class PromocodeCreate(PromocodeBase):
    pass

class PromocodeOut(PromocodeBase):
    id: int

    class Config:
        orm_mode = True