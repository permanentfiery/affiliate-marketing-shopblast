import { getProducts, deleteProduct as deleteFromDB } from "./db.js";
import { auth } from "./firebase.js";

let products = [];

async function loadProducts() {
  products = await getProducts();

  console.log("ALL PRODUCTS:", products);

  renderDeal(products);
  render(products);
}

// 🔥 DEAL SECTION (NOW SHOWS MULTIPLE DEALS)
function renderDeal(products) {
  const el = document.getElementById("dealSection");
  if (!el) return;

  const deals = products.filter(p => p.deal === true);

  console.log("ALL DEALS:", deals);

  if (deals.length === 0) {
    el.innerHTML = "";
    return;
  }

  el.innerHTML = `
    <div class="deal">
      <h2>🔥 DEALS OF THE DAY</h2>
      <div style="display:flex; gap:20px; flex-wrap:wrap;">
        ${deals.map(p => {
          const img = p.image || "https://via.placeholder.com/100";
          return `
            <div style="border:2px solid black; padding:10px; background:white;">
              <img src="${img}" style="width:100px;height:100px;object-fit:cover;">
              <h4>${p.name}</h4>
              <p>₹${(p.price / 100).toFixed(2)}</p>
              <a href="${p.link}" target="_blank" class="buy">GRAB</a>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

// 🛍 PRODUCT GRID
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

// 🔍 SEARCH
document.getElementById("searchInput").addEventListener("input", e => {
  const q = e.target.value.toLowerCase();
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(q)
  );
  render(filtered);
});

loadProducts();
