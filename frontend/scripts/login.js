// scripts/login.js

import { API_BASE } from './config.js'; // пример: "http://localhost:8000/api"

const loginForm    = document.getElementById("login-form");
const emailInput   = document.getElementById("login-email");
const passwordInput= document.getElementById("login-password");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email    = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    alert("Пожалуйста, заполните все поля.");
    return;
  }

  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  try {
    const res = await fetch(`${API_BASE}/auth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: formData
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Неверный email или пароль");
    }

    const data = await res.json();
    // сохраняем токен для последующих запросов
    localStorage.setItem("access_token", data.access_token);
    alert("Успешный вход!");
    window.location.href = "profile.html";
  } catch (err) {
    alert("Ошибка входа: " + err.message);
  }
});