# app/utils.py

import os
from fastapi import UploadFile
from uuid import uuid4

# Директория для хранения загруженных файлов
UPLOAD_DIR = "static/uploads"

def save_image_to_storage(image: UploadFile) -> str:
    """
    Сохраняет UploadFile в папку UPLOAD_DIR и возвращает публичный URL.
    """
    # Создать директорию, если не существует
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    # Определить расширение и уникальное имя
    _, ext = os.path.splitext(image.filename)
    filename = f"{uuid4().hex}{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    # Записать содержимое файла
    with open(filepath, "wb") as f:
        f.write(image.file.read())

    # Вернуть путь для статической раздачи через /static
    return f"/static/uploads/{filename}"