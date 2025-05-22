// scripts/register.js

import { API_BASE } from './config.js'; // e.g. "http://localhost:8000/api"

const registerForm   = document.getElementById("register-form");
const nameInput      = document.getElementById("register-name");
const emailInput     = document.getElementById("register-email");
const passwordInput  = document.getElementById("register-password");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name     = nameInput.value.trim();
  const email    = emailInput.value.trim();
  const password = passwordInput.value;

  if (!name || !email || !password) {
    alert("Пожалуйста, заполните все поля.");
    return;
  }

  try {
    // Сначала регистрируем пользователя
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Ошибка регистрации");
    }
    const user = await res.json();

    // Сохраняем имя локально (для заполнения профиля)
    localStorage.setItem("profile", JSON.stringify({ name, email: user.email }));

    alert("Регистрация успешна! Теперь войдите в свой аккаунт.");
    window.location.href = "login.html";
  } catch (err) {
    alert("Не удалось зарегистрироваться: " + err.message);
  }
});