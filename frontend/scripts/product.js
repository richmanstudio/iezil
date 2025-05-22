// scripts/product.js

import { API_BASE } from './config.js'; // e.g. "http://localhost:8000/api"

const mainImage     = document.getElementById("main-image");
const thumbnails    = document.querySelectorAll(".thumb");
const likeBtn       = document.querySelector(".like-btn");
const sizeSelect    = document.getElementById("size-select");
const addToCartBtn  = document.querySelector(".btn-primary");
const titleEl       = document.querySelector(".product-info h1");
const priceEl       = document.querySelector(".product-price");
const descEl        = document.querySelector(".product-desc");

// Получить ID товара из URL, например product.html?id=1
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

// Для хранения данных текущего продукта
let product = null;

// Загрузить данные товара из API
async function loadProduct() {
  try {
    const res = await fetch(`${API_BASE}/products/${productId}`);
    if (!res.ok) throw new Error("Не удалось загрузить товар");
    product = await res.json();
    renderProduct();
  } catch (e) {
    alert(e.message);
  }
}

// Отрисовать информацию о товаре
function renderProduct() {
  if (!product) return;
  mainImage.src = product.image_url;
  titleEl.textContent = product.name;
  priceEl.textContent = `${product.price.toLocaleString("ru-RU")} ₽`;
  descEl.textContent = product.description || "";

  // Задать варианты размеров
  sizeSelect.innerHTML = `<option value="">Выбрать размер</option>`;
  (product.sizes || []).forEach(sz => {
    const opt = document.createElement("option");
    opt.value = sz;
    opt.textContent = sz.toUpperCase();
    sizeSelect.appendChild(opt);
  });

  // Инициализировать миниатюры (по умолчанию показываем основное изображение)
  thumbnails.forEach((thumb, idx) => {
    if (idx === 0) {
      thumb.src = product.image_url;
      thumb.classList.add("active");
    } else {
      thumb.style.display = "none";
    }
  });
}

// Галерея: переключение по миниатюрам
function initGallery() {
  thumbnails.forEach(thumb => {
    thumb.addEventListener("click", () => {
      thumbnails.forEach(t => t.classList.remove("active"));
      thumb.classList.add("active");
      mainImage.src = thumb.src;
    });
  });
}

// Лайк / избранное через localStorage
function initLike() {
  const favKey = "favorites";
  let favorites = JSON.parse(localStorage.getItem(favKey)) || [];
  if (favorites.includes(productId)) {
    likeBtn.classList.add("liked");
  }
  likeBtn.addEventListener("click", () => {
    favorites = JSON.parse(localStorage.getItem(favKey)) || [];
    if (favorites.includes(productId)) {
      favorites = favorites.filter(id => id !== productId);
      likeBtn.classList.remove("liked");
    } else {
      favorites.push(productId);
      likeBtn.classList.add("liked");
    }
    localStorage.setItem(favKey, JSON.stringify(favorites));
  });
}

// Добавить в корзину
function initAddToCart() {
  addToCartBtn.addEventListener("click", () => {
    const selectedSize = sizeSelect.value;
    if (!selectedSize) {
      alert("Пожалуйста, выберите размер.");
      return;
    }
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(
      item => item.id === product.id && item.size === selectedSize
    );
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id:          product.id,
        name:        product.name,
        price:       product.price,
        image_url:   product.image_url,
        size:        selectedSize,
        quantity:    1
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`Добавлено в корзину: ${product.name} (${selectedSize.toUpperCase()})`);
  });
}

// Инициализация страницы
document.addEventListener("DOMContentLoaded", async () => {
  if (!productId) {
    alert("Товар не найден");
    return;
  }
  await loadProduct();
  initGallery();
  initLike();
  initAddToCart();
});