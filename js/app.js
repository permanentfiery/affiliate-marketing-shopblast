import { getProducts } from "./db.js";

let products = [];

async function loadProducts() {
  products = await getProducts();

  console.log("ALL PRODUCTS:", products);

  renderDeal(products);
  render(products);
}

// 🔥 DEAL SECTION (FINAL FIX)
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

      <div style="
        display:flex;
        gap:20px;
        flex-wrap:wrap;
      ">
        ${deals.map(p => {

          const name = p.name || "No Name";

          // ✅ CONSISTENT PRICE HANDLING (always paise → rupees)
          let price = "0.00";
          if (typeof p.price === "number") {
            price = (p.price / 100).toFixed(2);
          }

          return `
            <div style="
              border:2px solid black;
              padding:10px;
              background:white;
              width:180px;
              text-align:center;
            ">
              <img src="https://via.placeholder.com/100"
                   style="width:100px;height:100px;">

              <h4 style="margin:10px 0;">
                ${name}
              </h4>

              <p style="font-weight:bold;">
                ₹${price}
              </p>

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

// 🛍 NORMAL PRODUCT GRID
function render(list) {
  const grid = document.getElementById("productGrid");

  grid.innerHTML = list.map(p => {
    const img = "https://via.placeholder.com/300";

    let price = "0.00";
    if (typeof p.price === "number") {
      price = (p.price / 100).toFixed(2);
    }

    return `
      <div class="card">
        <img src="${img}">
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
