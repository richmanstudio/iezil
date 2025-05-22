// scripts/checkout.js

import { API_BASE } from './config.js'; // адрес API, например "http://localhost:8000/api"

const checkoutTotal = document.getElementById("checkout-total");
const checkoutForm  = document.getElementById("checkout-form");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let appliedDiscount = 0;

// Подсчитать и показать итоговую сумму
function calculateTotal() {
  let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // Учесть скидку, если промокод применён
  if (appliedDiscount > 0) {
    total = total - total * (appliedDiscount / 100);
  }
  checkoutTotal.textContent = `${Math.round(total).toLocaleString("ru-RU")} ₽`;
}

// Обработчик отправки формы оформления
checkoutForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!cart.length) {
    alert("Ваша корзина пуста.");
    return;
  }

  const token = localStorage.getItem("access_token");
  if (!token) {
    alert("Пожалуйста, войдите в аккаунт перед оформлением заказа.");
    window.location.href = "login.html";
    return;
  }

  // Собираем данные заказа
  const orderPayload = {
    items: cart.map(i => ({
      product_id: i.id,
      name:       i.name,
      price:      i.price,
      quantity:   i.quantity,
      size:       i.size
    })),
    total: Math.round(
      cart.reduce((sum, i) => sum + i.price * i.quantity, 0) *
      (1 - appliedDiscount / 100)
    )
  };

  try {
    const res = await fetch(`${API_BASE}/orders/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type":  "application/json"
      },
      body: JSON.stringify(orderPayload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Ошибка при оформлении заказа");
    }
    await res.json();
    alert("Заказ успешно оформлен!");
    localStorage.removeItem("cart");
    window.location.href = "profile.html";
  } catch (err) {
    alert(err.message);
  }
});

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  // Проверяем, может быть промокод уже указан
  const promoCode = new URLSearchParams(window.location.search).get("promo") || "";
  if (promoCode) {
    // При желании можно получить скидку через API
    // но здесь предполагаем, что appliedDiscount уже сохранён
  }
  calculateTotal();
});