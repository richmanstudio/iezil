# Iezil Digital Store

Простой гайд по запуску проекта «Iezil» для новичков.

## 📋 Структура

iezil/
├── frontend/    — статические файлы сайта (HTML, CSS, JS, изображения)
└── backend/     — API на FastAPI + MySQL (контейнеризовано)

---

## 🔧 Требования

- Установленный [Docker](https://www.docker.com/get-started) и [Docker Compose](https://docs.docker.com/compose/install/)  
- Любой современный браузер (Chrome, Firefox, Edge)  
- Python 3.x (для простого локального HTTP-сервера)

---

## 🚀 Запуск в два шага

### 1. Поднять backend + базу

1. Склонируйте репозиторий и перейдите в корень:
   ```bash
   git clone <URL-репозитория>
   cd iezil

	2.	Создайте файл .env в папке backend/ рядом с docker-compose.yml:

DB_USER=iezil_user
DB_PASS=strongpassword
DB_HOST=db
DB_NAME=iezil_db
JWT_SECRET=your_jwt_secret_here


	3.	Перейдите в папку backend/ и запустите контейнеры:

cd backend
docker-compose up --build

Это автоматически запустит MySQL и FastAPI-приложение.
После успешного старта API будет доступно по адресу
http://localhost:8000.

2. Открыть frontend
	1.	В отдельном окне терминала перейдите в папку frontend/:

cd ../frontend


	2.	Запустите простой статический сервер. Примеры:
	•	Через Python:

python3 -m http.server 3000


	•	Через VS Code Live Server:
Правый клик на папке → «Open with Live Server».

	3.	Откройте браузер и перейдите на
http://localhost:3000/pages/index.html

⸻

⚙️ Конфигурация
	•	Backend
	•	Параметры БД и секрет JWT читаются из backend/.env.
	•	При необходимости отредактируйте значения DB_* и JWT_SECRET.
	•	Frontend
	•	Адрес API определяется в scripts/config.js:

export const API_BASE = "http://localhost:8000/api";



⸻

📖 Использование
	•	Регистрация / вход
	•	Откройте /pages/register.html или /pages/login.html
	•	После входа получите доступ к личному кабинету, заказам и избранному.
	•	Каталог и поиск
	•	index.html и catalog.html подгружают товары через API.
	•	Фильтры и сортировка выполняются на клиенте.
	•	Корзина и оформление
	•	Добавляйте товары в корзину, применяйте промокод, оформляйте заказ.
	•	Заказы сохраняются на сервере и отображаются в профиле.
	•	Админ-панель
	•	Перейдите на /pages/admin.html после авторизации админа.
	•	Управляйте товарами, категориями, промокодами и заказами.

⸻

🛠️ Отладка
	•	Просмотр логов Docker:

cd backend
docker-compose logs -f


	•	Перезапуск сервисов:

docker-compose down
docker-compose up --build



⸻

🎉 Готово!

Вы запустили полный стек «Iezil» — frontend и backend.
Удачи в разработке и тестировании! 🚀

