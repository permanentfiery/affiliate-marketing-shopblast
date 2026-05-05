import { getProducts } from "./db.js";

let products = [];

async function loadProducts() {
  products = await getProducts();
  render(products);
}

function render(list) {
  const grid = document.getElementById("productGrid");

  grid.innerHTML = list.map(p => {
    const img = p.image || "https://via.placeholder.com/300";

    return `
      <div class="card">
        <img src="${img}">
        <h3>${p.name}</h3>
        <p>₹${(p.price / 100).toFixed(2)}</p>
        <a href="${p.link}" target="_blank" class="buy">BUY</a>
      </div>
    `;
  }).join("");
}

document.getElementById("searchInput").addEventListener("input", e => {
  const q = e.target.value.toLowerCase();
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(q)
  );
  render(filtered);
});

loadProducts();
