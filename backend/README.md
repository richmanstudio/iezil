# Iezil Backend

Руководство по запуску и локальной разработке серверной части проекта «Iezil».

## 📂 Структура

backend/
├── .env                   — переменные окружения (не в репозитории)
├── Dockerfile             — сборка образа FastAPI-приложения
├── docker-compose.yml     — настройка сервисов (MySQL + API)
├── requirements.txt       — Python-зависимости
├── README.md              — этот файл
└── app/
├── init.py
├── main.py            — точка входа FastAPI
├── config.py          — настройки через Pydantic BaseSettings
├── db.py              — подключение к БД, сессии SQLAlchemy
├── models.py          — SQLAlchemy-модели
├── schemas.py         — Pydantic-схемы для валидации/сериализации
├── security.py        — хеширование паролей, JWT, зависимости
├── utils.py           — утилиты (сохранение изображений)
└── routers/           — REST-эндпоинты
├── auth.py
├── users.py
├── products.py
├── orders.py
├── categories.py
└── promocodes.py

---

## 🔧 Требования

- [Docker](https://www.docker.com/get-started) и [Docker Compose](https://docs.docker.com/compose/install/)  
- Опционально: Python 3.11+ для запуска без Docker  

---

## ⚙️ Конфигурация

Создайте файл `.env` рядом с `docker-compose.yml`:

```dotenv
DB_USER=iezil_user
DB_PASS=strongpassword
DB_HOST=db
DB_NAME=iezil_db
JWT_SECRET=your_jwt_secret_here

	•	DB_* — параметры подключения к MySQL
	•	JWT_SECRET — секрет для подписи JWT-токенов

⸻

🚀 Запуск через Docker
	1.	Перейдите в папку backend/:

cd backend


	2.	Запустите контейнеры:

docker-compose up --build

	•	MySQL будет доступен на порту 3306
	•	FastAPI на http://localhost:8000

	3.	Проверьте работу API:
	•	Откройте в браузере или Postman http://localhost:8000/docs
	•	Доступна автодокументация Swagger UI

⸻

🚀 Локальный запуск без Docker
	1.	Установите зависимости:

pip install -r requirements.txt


	2.	Убедитесь, что MySQL запущен и создана база iezil_db, а пользователь с правами есть.
	3.	Экспортируйте переменные окружения (или создайте .env):

export DB_USER=iezil_user
export DB_PASS=strongpassword
export DB_HOST=localhost
export DB_NAME=iezil_db
export JWT_SECRET=your_jwt_secret_here


	4.	Запустите приложение:

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000


	5.	Откройте http://localhost:8000/docs для проверки эндпоинтов.

⸻

🛠️ Отладка и миграции
	•	Логи Docker:

docker-compose logs -f


	•	Перезапуск сервисов:

docker-compose down
docker-compose up --build


	•	Миграции (Alembic): при наличии папки alembic/, настройте alembic.ini и запускайте:

alembic revision --autogenerate -m "описание"
alembic upgrade head



⸻

🎉 Готово!

Ваш FastAPI-сервер «Iezil» запущен и готов к работе. Удачной разработки! 🚀

