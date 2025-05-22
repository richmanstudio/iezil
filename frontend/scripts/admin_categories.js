// scripts/admin_categories.js

import { API_BASE } from './config.js'; // e.g. "http://localhost:8000/api"

const form = document.getElementById("category-form");
const input = document.getElementById("category-name");
const list  = document.getElementById("category-list");

let categories = [];

// Загрузка и отображение категорий
async function loadCategories() {
  try {
    const token = localStorage.getItem("access_token");
    const res = await fetch(`${API_BASE}/categories/`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error("Не удалось загрузить категории");
    categories = await res.json();
    renderCategories();
  } catch (e) {
    alert(e.message);
  }
}

function renderCategories() {
  list.innerHTML = "";
  if (categories.length === 0) {
    list.innerHTML = `<li>Категории отсутствуют.</li>`;
    return;
  }
  categories.forEach((cat, idx) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${cat.name}
      <button data-id="${cat.id}" class="remove-btn">Удалить</button>
    `;
    list.appendChild(li);
  });
  attachRemoveEvents();
}

// Добавление новой категории
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = input.value.trim().toLowerCase();
  if (!name) {
    alert("Введите название категории.");
    return;
  }

  try {
    const token = localStorage.getItem("access_token");
    const res = await fetch(`${API_BASE}/categories/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Ошибка создания категории");
    }
    input.value = "";
    await loadCategories();
  } catch (e) {
    alert(e.message);
  }
});

// Удаление категории
function attachRemoveEvents() {
  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      if (!confirm("Удалить эту категорию?")) return;
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(`${API_BASE}/categories/${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error("Ошибка удаления категории");
        await loadCategories();
      } catch (e) {
        alert(e.message);
      }
    });
  });
}

// Инициализация
document.addEventListener("DOMContentLoaded", loadCategories);