// scripts/index.js

// Моковые данные новинок (можно заменить на fetch при интеграции)
const newArrivals = [
    {
      id: 1,
      name: "Кроссовки Iezil Boost X",
      price: "9 990 ₽",
      image: "../assets/products/boost-x.jpg"
    },
    {
      id: 2,
      name: "Футболка Iezil Core",
      price: "3 490 ₽",
      image: "../assets/products/core-shirt.jpg"
    },
    {
      id: 3,
      name: "Толстовка Iezil Oversize",
      price: "6 990 ₽",
      image: "../assets/products/oversize-hoodie.jpg"
    }
  ];
  
  // Рендер секции «Новинки»
  function renderNewArrivals() {
    const container = document.querySelector('.new-arrivals .product-grid');
    if (!container) return;
  
    container.innerHTML = '';
    newArrivals.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card glass-card';
      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${product.price}</p>
        <button class="btn-primary">В корзину</button>
      `;
      container.appendChild(card);
    });
  }
  
  // Инициализация карусели «В тренде»
  function initCarouselScroll() {
    const carousel = document.querySelector('.trends-carousel .carousel');
    if (!carousel) return;
  
    const trends = [
      "Сникеры", "Спортивный стиль", "Oversize", "Новое поколение", "Минимализм"
    ];
    carousel.innerHTML = '';
    trends.forEach(trend => {
      const item = document.createElement('div');
      item.className = 'carousel-item';
      item.textContent = trend;
      carousel.appendChild(item);
    });
  }
  
  // Инициализация всего на странице
  document.addEventListener('DOMContentLoaded', () => {
    renderNewArrivals();
    initCarouselScroll();
  });