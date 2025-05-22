// scripts/admin.js

import { API_BASE } from './config.js'; // e.g. "http://localhost:8000/api"

const metricOrders    = document.getElementById("metric-orders");
const metricTotal     = document.getElementById("metric-total");
const metricFavorites = document.getElementById("metric-favorites");

async function loadMetrics() {
  try {
    const token = localStorage.getItem("access_token");
    // Загрузка всех заказов для подсчёта
    const resOrders = await fetch(`${API_BASE}/orders/all`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!resOrders.ok) throw new Error("Не удалось загрузить заказы");
    const orders = await resOrders.json();

    // Загрузка избранного (список ID в профиле админа не актуален, 
    // можно подсчитать товары, отмеченные пользователями: 
    // здесь упрощённо берем длину массива избранного из локалстореджа)
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    // Подсчёт метрик
    const totalOrders  = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const totalFavs    = favorites.length;

    metricOrders.textContent    = totalOrders;
    metricTotal.textContent     = `${totalRevenue.toLocaleString("ru-RU")} ₽`;
    metricFavorites.textContent = totalFavs;
  } catch (e) {
    alert(`Ошибка при загрузке метрик: ${e.message}`);
  }
}

// Проверка прав доступа
(async function checkAdmin() {
  const token = localStorage.getItem("access_token");
  if (!token) {
    alert("Требуется авторизация администратора.");
    window.location.href = "login.html";
    return;
  }
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) throw new Error();
    const user = await res.json();
    if (!user.is_active || !user.is_superuser) {
      throw new Error();
    }
    // Всё ок — загружаем метрики
    loadMetrics();
  } catch {
    alert("Доступ запрещён.");
    window.location.href = "login.html";
  }
})();