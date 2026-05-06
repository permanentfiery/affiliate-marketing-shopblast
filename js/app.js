import { getProducts } from "./db.js";

let products = [];

async function loadProducts() {
  products = await getProducts();

  renderDeal(products);
  render(products);
}

// 🔥 DEAL SECTION
function renderDeal(products) {
  const el = document.getElementById("dealSection");
  if (!el) return;

  const deals = products.filter(p => p.deal === true);

  if (deals.length === 0) {
    el.innerHTML = "";
    return;
  }

  el.innerHTML = `
    <div class="deal">
      <h2>🔥 DEALS OF THE DAY</h2>

      <div style="display:flex; gap:20px; flex-wrap:wrap;">
        ${deals.map(p => {

          const name = p.name || "No Name";

          let price = "0.00";
          if (typeof p.price === "number") {
            price = (p.price / 100).toFixed(2);
          }

          return `
            <div class="deal-card">
              <img src="https://via.placeholder.com/100"
                   style="width:100px;height:100px;">

              <h4>${name}</h4>

              <p><b>₹${price}</b></p>

              <a href="${p.link || '#'}" target="_blank" class="buy">
                GRAB
              </a>
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

    let price = "0.00";
    if (typeof p.price === "number") {
      price = (p.price / 100).toFixed(2);
    }

    return `
      <div class="card">
        <img src="https://via.placeholder.com/300">
        <h3>${p.name || "No Name"}</h3>
        <p>₹${price}</p>
        <a href="${p.link || '#'}" target="_blank" class="buy">BUY</a>
      </div>
    `;
  }).join("");
}

// 🔍 SEARCH
document.getElementById("searchInput").addEventListener("input", e => {
  const q = e.target.value.toLowerCase();

  const filtered = products.filter(p =>
    (p.name || "").toLowerCase().includes(q)
  );

  render(filtered);
});

loadProducts();
