// scripts/admin_promocodes.js

import { API_BASE } from './config.js'; // e.g. "http://localhost:8000/api"

const promoForm  = document.getElementById("promo-form");
const codeInput  = document.getElementById("promo-code");
const discInput  = document.getElementById("promo-discount");
const promoList  = document.getElementById("promo-list");

let promocodes = [];

// Загрузка списка промокодов
async function loadPromocodes() {
  try {
    const token = localStorage.getItem("access_token");
    const res = await fetch(`${API_BASE}/promocodes/`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Не удалось загрузить промокоды");
    }
    promocodes = await res.json();
    renderPromocodes();
  } catch (e) {
    alert(e.message);
  }
}

// Рендер списка
function renderPromocodes() {
  promoList.innerHTML = "";
  if (promocodes.length === 0) {
    promoList.innerHTML = `<li>Промокодов нет.</li>`;
    return;
  }
  promocodes.forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${p.code}</strong> — ${p.discount}% 
      <button data-id="${p.id}" class="remove-btn">Удалить</button>
    `;
    promoList.appendChild(li);
  });
  attachRemoveEvents();
}

// Создание нового промокода
promoForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const code     = codeInput.value.trim().toUpperCase();
  const discount = parseInt(discInput.value, 10);

  if (!code || isNaN(discount) || discount < 1 || discount > 99) {
    alert("Введите корректный код и скидку (1–99%).");
    return;
  }

  try {
    const token = localStorage.getItem("access_token");
    const res = await fetch(`${API_BASE}/promocodes/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ code, discount })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Ошибка создания промокода");
    }
    codeInput.value = "";
    discInput.value = "";
    await loadPromocodes();
  } catch (e) {
    alert(e.message);
  }
});

// Удаление промокода
function attachRemoveEvents() {
  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      if (!confirm("Удалить этот промокод?")) return;
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(`${API_BASE}/promocodes/${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.detail || "Ошибка удаления промокода");
        }
        await loadPromocodes();
      } catch (e) {
        alert(e.message);
      }
    });
  });
}

// Инициализация
document.addEventListener("DOMContentLoaded", loadPromocodes);