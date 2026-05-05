import { getProducts, deleteProduct as deleteFromDB } from "./db.js";
import { auth } from "./firebase.js";

let products = [];

async function loadProducts() {
  products = await getProducts();
  renderDeal(products);
  render(products);
}

// 🔥 DEAL OF THE DAY
function renderDeal(products) {
  const deal = products.find(p => p.deal);
  const el = document.getElementById("dealSection");

  if (!el) return;

  if (!deal) {
    el.innerHTML = "";
    return;
  }

  const img = deal.image || "https://via.placeholder.com/100";

  el.innerHTML = `
    <div class="deal">
      <h2>🔥 DEAL OF THE DAY</h2>
      <img src="${img}">
      <h3>${deal.name}</h3>
      <p>₹${(deal.price / 100).toFixed(2)}</p>
      <a href="${deal.link}" target="_blank" class="buy">
        GRAB DEAL →
      </a>
    </div>
  `;
}

// PRODUCTS
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

        ${
          auth.currentUser && window.location.pathname.includes("admin")
            ? `<button onclick="deleteProduct('${p.id}')" class="delete-btn">DELETE</button>`
            : ""
        }
      </div>
    `;
  }).join("");
}

// SEARCH
document.getElementById("searchInput").addEventListener("input", e => {
  const q = e.target.value.toLowerCase();
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(q)
  );
  render(filtered);
});

// DELETE
window.deleteProduct = async function(id) {
  if (!auth.currentUser) {
    alert("Not authorized");
    return;
  }

  const confirmDelete = confirm("Delete this product?");
  if (!confirmDelete) return;

  await deleteFromDB(id);
  loadProducts();
};

loadProducts();
