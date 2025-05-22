// scripts/catalog.js

import { API_BASE } from './config.js'; // адрес API, например "http://localhost:8000/api"

const catalogContainer = document.getElementById("catalog-products");
const filterCategory   = document.getElementById("filter-category");
const filterSize       = document.getElementById("filter-size");
const sortSelect       = document.getElementById("sort-select");

let products = [];

// Загрузка товаров из API
async function loadProducts() {
  try {
    const res = await fetch(`${API_BASE}/products?skip=0&limit=100`);
    if (!res.ok) throw new Error("Не удалось загрузить товары");
    products = await res.json();
    applyFilters();
  } catch (e) {
    alert(e.message);
  }
}

// Рендер карточек
function renderProducts(list) {
  catalogContainer.innerHTML = "";
  if (list.length === 0) {
    catalogContainer.innerHTML = "<p>Товары не найдены.</p>";
    return;
  }
  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card glass-card";
    card.innerHTML = `
      <img src="${p.image_url}" alt="${p.name}" />
      <h3>${p.name}</h3>
      <p>${p.price.toLocaleString("ru-RU")} ₽</p>
      <button class="btn-primary" data-id="${p.id}">В корзину</button>
    `;
    catalogContainer.appendChild(card);
  });
  attachAddToCart();
}

// Фильтрация и сортировка
function applyFilters() {
  let filtered = products.filter(p => {
    const catMatch = filterCategory.value === "all" || p.category === filterCategory.value;
    const sizeMatch = filterSize.value === "all" || (p.sizes || []).includes(filterSize.value);
    return catMatch && sizeMatch;
  });

  if (sortSelect.value === "price-asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortSelect.value === "price-desc") {
    filtered.sort((a, b) => b.price - a.price);
  }

  renderProducts(filtered);
}

// Добавление в корзину
function attachAddToCart() {
  document.querySelectorAll(".product-card button").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const prod = products.find(p => p.id == id);
      if (!prod) return;
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const existing = cart.find(i => i.id == prod.id && i.size === prod.sizes[0]);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({
          id: prod.id,
          name: prod.name,
          price: prod.price,
          image_url: prod.image_url,
          quantity: 1,
          size: prod.sizes[0] || ""
        });
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      alert(`Товар "${prod.name}" добавлен в корзину`);
    });
  });
}

// Инициализация
document.addEventListener("DOMContentLoaded", () => {
  loadProducts();

  filterCategory.addEventListener("change", applyFilters);
  filterSize.addEventListener("change", applyFilters);
  sortSelect.addEventListener("change", applyFilters);
});