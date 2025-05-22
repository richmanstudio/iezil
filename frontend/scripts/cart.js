// scripts/cart.js

import { API_BASE } from './config.js'; // e.g. "http://localhost:8000/api"

const cartItemsContainer = document.getElementById("cart-items");
const cartTotalEl        = document.getElementById("cart-total");
const promoInput         = document.getElementById("promo-code");
const checkoutBtn        = document.getElementById("checkout-btn");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let appliedDiscount = 0;

// Подсчёт и отрисовка корзины
async function renderCart() {
  cartItemsContainer.innerHTML = "";
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Корзина пуста.</p>";
    cartTotalEl.textContent = "0 ₽";
    return;
  }

  let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (appliedDiscount > 0) {
    total = total - total * (appliedDiscount / 100);
  }
  cartTotalEl.textContent = `${Math.round(total).toLocaleString("ru-RU")} ₽`;

  cart.forEach((item, idx) => {
    const itemEl = document.createElement("div");
    itemEl.className = "cart-item";
    itemEl.innerHTML = `
      <img src="${item.image_url || item.image}" alt="${item.name}" />
      <div class="cart-item-info">
        <h3>${item.name}</h3>
        <p>Размер: ${item.size}</p>
        <p>Цена: ${item.price.toLocaleString("ru-RU")} ₽</p>
        <label>
          Количество:
          <input type="number" min="1" value="${item.quantity}" data-idx="${idx}" class="quantity-input" />
        </label>
        <button class="remove-btn" data-idx="${idx}">Удалить</button>
      </div>
    `;
    cartItemsContainer.appendChild(itemEl);
  });

  attachEvents();
}

// Сохранение корзины в localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Навешиваем события на удаление и изменение кол-ва
function attachEvents() {
  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = +btn.dataset.idx;
      cart.splice(idx, 1);
      saveCart();
      renderCart();
    });
  });

  document.querySelectorAll(".quantity-input").forEach(input => {
    input.addEventListener("change", () => {
      const idx = +input.dataset.idx;
      const val = parseInt(input.value, 10);
      if (val >= 1) {
        cart[idx].quantity = val;
        saveCart();
        renderCart();
      }
    });
  });
}

// Применение промокода
promoInput.addEventListener("change", () => {
  const code = promoInput.value.trim().toUpperCase();
  const tok  = localStorage.getItem("access_token");
  fetch(`${API_BASE}/promocodes/`, {
    headers: {
      "Authorization": `Bearer ${tok}`
    }
  })
    .then(res => res.json())
    .then(list => {
      const promo = list.find(p => p.code === code);
      if (promo) {
        appliedDiscount = promo.discount;
        alert(`Скидка ${appliedDiscount}% применена!`);
      } else {
        appliedDiscount = 0;
        alert("Промокод недействителен");
      }
      renderCart();
    })
    .catch(() => {
      appliedDiscount = 0;
      alert("Ошибка проверки промокода");
      renderCart();
    });
});

// Оформление заказа
checkoutBtn.addEventListener("click", async () => {
  if (cart.length === 0) {
    alert("Корзина пуста.");
    return;
  }

  const token = localStorage.getItem("access_token");
  if (!token) {
    alert("Пожалуйста, войдите для оформления заказа.");
    window.location.href = "login.html";
    return;
  }

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
      throw new Error(err.detail || "Ошибка оформления заказа");
    }
    await res.json();
    alert("Заказ успешно оформлен!");
    localStorage.removeItem("cart");
    window.location.href = "profile.html";
  } catch (e) {
    alert(e.message);
  }
});

document.addEventListener("DOMContentLoaded", renderCart);