import { getProducts } from "./db.js";

let products = [];
let activeCategory = "All";

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

      <div style="
        display:flex;
        gap:20px;
        flex-wrap:wrap;
      ">

        ${deals.map(p => {

          const name = p.name || "No Name";

          let price = "0.00";

          if (typeof p.price === "number") {
            price = (p.price / 100).toFixed(2);
          }

          return `
            <div class="deal-card"
                 data-id="${p.id}">

              <img src="https://via.placeholder.com/100"
                   style="width:100px;height:100px;">

              <h4>${name}</h4>

              <p>
                <b>${p.category || "General"}</b>
              </p>

              <p>
                <b>₹${price}</b>
              </p>

              <a href="${p.link || '#'}"
                 target="_blank"
                 class="buy">
                 GRAB
              </a>

            </div>
          `;
        }).join("")}

      </div>
    </div>
  `;

  // 🪟 DEAL CARD CLICK
  document.querySelectorAll(".deal-card").forEach(card => {

    card.addEventListener("click", () => {

      const id = card.dataset.id;

      const product = products.find(p => p.id === id);

      if (product) {
        openModal(product);
      }

    });

  });

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
      <div class="card"
           data-id="${p.id}">

        <img src="https://via.placeholder.com/300">

        <h3>${p.name || "No Name"}</h3>

        <p>
          <b>${p.category || "General"}</b>
        </p>

        <p>₹${price}</p>

        <a href="${p.link || '#'}"
           target="_blank"
           class="buy">
           BUY
        </a>

      </div>
    `;
  }).join("");

  // 🪟 PRODUCT CARD CLICK
  document.querySelectorAll(".card").forEach(card => {

    card.addEventListener("click", () => {

      const id = card.dataset.id;

      const product = products.find(p => p.id === id);

      if (product) {
        openModal(product);
      }

    });

  });

}

// 🪟 OPEN MODAL
function openModal(product) {

  document.getElementById("productModal")
    .classList.remove("hidden");

  document.getElementById("modalImg").src =
    "https://via.placeholder.com/300";

  document.getElementById("modalName").textContent =
    product.name || "No Name";

  let price = "0.00";

  if (typeof product.price === "number") {
    price = (product.price / 100).toFixed(2);
  }

  document.getElementById("modalPrice").textContent =
    `₹${price}`;

  document.getElementById("modalDesc").textContent =
    product.description || "No description available.";

  document.getElementById("modalLink").href =
    product.link || "#";

}

// ❌ CLOSE MODAL
document.getElementById("closeModal")
  .addEventListener("click", () => {

    document.getElementById("productModal")
      .classList.add("hidden");

});

// CLOSE ON BACKDROP CLICK
window.addEventListener("click", (e) => {

  if (e.target.id === "productModal") {

    document.getElementById("productModal")
      .classList.add("hidden");

  }

});

// 🔍 SEARCH
document.getElementById("searchInput")
  .addEventListener("input", e => {

    const q = e.target.value.toLowerCase();

    let filtered = products.filter(p =>
      (p.name || "")
        .toLowerCase()
        .includes(q)
    );

    if (activeCategory !== "All") {

      filtered = filtered.filter(p =>
        p.category === activeCategory
      );

    }

    render(filtered);

});

// 🧭 CATEGORY FILTER
document.querySelectorAll(".tab").forEach(tab => {

  tab.addEventListener("click", () => {

    document.querySelectorAll(".tab")
      .forEach(t => t.classList.remove("active"));

    tab.classList.add("active");

    activeCategory = tab.dataset.category;

    let filtered = [...products];

    if (activeCategory !== "All") {

      filtered = filtered.filter(p =>
        p.category === activeCategory
      );

    }

    render(filtered);

  });

});

loadProducts();
