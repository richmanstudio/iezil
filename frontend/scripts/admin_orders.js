// scripts/admin_orders.js

import { API_BASE } from './config.js'; // e.g. "http://localhost:8000/api"

const ordersBody = document.getElementById("orders-body");

let orders = [];

// Загрузка всех заказов (только для админа)
async function loadOrders() {
  try {
    const token = localStorage.getItem("access_token");
    const res = await fetch(`${API_BASE}/orders/all`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Не удалось загрузить заказы");
    }
    orders = await res.json();
    renderOrders();
  } catch (e) {
    alert(e.message);
  }
}

// Отрисовка таблицы заказов
function renderOrders() {
  ordersBody.innerHTML = "";
  if (orders.length === 0) {
    ordersBody.innerHTML = `<tr><td colspan="5">Заказов нет.</td></tr>`;
    return;
  }

  orders.forEach((order, index) => {
    const date = new Date(order.created_at).toLocaleDateString("ru-RU");
    const sum = order.total.toLocaleString("ru-RU");

    const itemsList = order.items
      .map(i => `${i.name} x${i.quantity}`)
      .join("<br>");

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${date}</td>
      <td>${itemsList}</td>
      <td>${sum} ₽</td>
      <td>
        <select data-id="${order.id}">
          <option value="new"       ${order.status === "new"       ? "selected" : ""}>Новый</option>
          <option value="processing"${order.status === "processing" ? "selected" : ""}>В обработке</option>
          <option value="shipped"   ${order.status === "shipped"   ? "selected" : ""}>Отправлен</option>
          <option value="delivered" ${order.status === "delivered" ? "selected" : ""}>Доставлен</option>
        </select>
      </td>
    `;
    ordersBody.appendChild(tr);
  });

  attachStatusEvents();
}

// Обработчики смены статуса
function attachStatusEvents() {
  document.querySelectorAll("select[data-id]").forEach(select => {
    select.addEventListener("change", async () => {
      const orderId = select.dataset.id;
      const newStatus = select.value;
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(
          `${API_BASE}/orders/${orderId}/status?status=${newStatus}`,
          {
            method: "PUT",
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }
        );
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.detail || "Не удалось обновить статус");
        }
        // обновим локально
        const updated = await res.json();
        const idx = orders.findIndex(o => o.id === updated.id);
        if (idx !== -1) orders[idx].status = updated.status;
        alert(`Статус заказа #${orderId} изменён на "${updated.status}"`);
      } catch (e) {
        alert(e.message);
      }
    });
  });
}

// Инициализация
document.addEventListener("DOMContentLoaded", loadOrders);