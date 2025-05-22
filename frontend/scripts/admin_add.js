// scripts/admin_add.js

const form = document.getElementById("product-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nameField      = document.getElementById("product-name");
  const categoryField  = document.getElementById("product-category");
  const sizesField     = document.getElementById("product-sizes");
  const priceField     = document.getElementById("product-price");
  const descField      = document.getElementById("product-desc");
  const imageInput     = document.getElementById("product-image");

  const name     = nameField.value.trim();
  const category = categoryField.value;
  const sizes    = sizesField.value.split(",").map(s => s.trim());
  const price    = parseInt(priceField.value, 10);
  const desc     = descField.value.trim();
  const file     = imageInput.files[0];

  if (!name || !category || sizes.length === 0 || isNaN(price) || !desc || !file) {
    alert("Пожалуйста, заполните все поля и выберите изображение.");
    return;
  }

  const formData = new FormData();
  formData.append("name",        name);
  formData.append("category",    category);
  formData.append("sizes",       JSON.stringify(sizes));
  formData.append("price",       price);
  formData.append("description", desc);
  formData.append("image",       file);

  const token = localStorage.getItem("access_token");

  try {
    const response = await fetch("http://localhost:8000/api/products/", {
      method: "POST",
      headers: token
        ? { "Authorization": `Bearer ${token}` }
        : {},
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || response.statusText);
    }

    const product = await response.json();
    alert(`Товар "${product.name}" успешно добавлен (ID: ${product.id})`);
    form.reset();
  } catch (err) {
    alert("Ошибка при добавлении товара: " + err.message);
  }
});