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

  const el =
    document.getElementById("dealSection");

  if (!el) return;

  const deals =
    products.filter(p => p.deal === true);

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

          const name =
            p.name || "No Name";

          let price = "0.00";

          if (typeof p.price === "number") {

            price =
              (p.price / 100).toFixed(2);

          }

          const image =

            p.images?.[0] ||
            p.image ||

            "https://via.placeholder.com/100";

          return `
            <div class="deal-card"
                 data-id="${p.id}">

              <img
                src="${image}"

                style="
                  width:100%;
                  height:100px;

                  object-fit:cover;

                  display:block;

                  background:#f2f2f2;

                  overflow:hidden;
                ">

              <h4>${name}</h4>

              <p>
                <b>
                  ${p.category || "General"}
                </b>
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

  document.querySelectorAll(".deal-card")
    .forEach(card => {

      card.addEventListener("click", () => {

        const id =
          card.dataset.id;

        const product =
          products.find(p => p.id === id);

        if (product) {

          openModal(product);

        }

      });

  });

}

// 🛍 PRODUCT GRID
function render(list) {

  const grid =
    document.getElementById("productGrid");

  if (list.length === 0) {

    grid.innerHTML = `
      <h2>No products found.</h2>
    `;

    return;

  }

  grid.innerHTML = list.map(p => {

    let price = "0.00";

    if (typeof p.price === "number") {

      price =
        (p.price / 100).toFixed(2);

    }

    const image =

      p.images?.[0] ||
      p.image ||

      "https://via.placeholder.com/300";

    return `
      <div class="card"
           data-id="${p.id}">

        <img
          src="${image}"

          style="
            width:100%;
            height:220px;

            object-fit:cover;

            display:block;

            background:#f2f2f2;

            overflow:hidden;
          ">

        <h3>${p.name || "No Name"}</h3>

        <p>
          <b>
            ${p.category || "General"}
          </b>
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

  document.querySelectorAll(".card")
    .forEach(card => {

      card.addEventListener("click", () => {

        const id =
          card.dataset.id;

        const product =
          products.find(p => p.id === id);

        if (product) {

          openModal(product);

        }

      });

  });

}

// 🪟 PRODUCT MODAL
function openModal(product) {

  document.getElementById("productModal")
    .classList.remove("hidden");

  document.getElementById("modalImg").src =

    product.images?.[0] ||
    product.image ||

    "https://via.placeholder.com/300";

  document.getElementById("modalName")
    .textContent =

      product.name || "No Name";

  let price = "0.00";

  if (typeof product.price === "number") {

    price =
      (product.price / 100).toFixed(2);

  }

  document.getElementById("modalPrice")
    .textContent = `₹${price}`;

  document.getElementById("modalDesc")
    .textContent =

      product.description ||
      "No description available.";

  document.getElementById("modalLink")
    .href =

      product.link || "#";

  const gallery =
    document.getElementById("modalGallery");

  if (gallery) {

    const galleryImages =

      (product.images || [product.image])
        .filter(Boolean);

    gallery.innerHTML =

      galleryImages.map(img => `

        <img
          src="${img}"
          class="gallery-thumb">

      `).join("");

    document.querySelectorAll(".gallery-thumb")
      .forEach(img => {

        img.addEventListener("click", () => {

          document.getElementById("modalImg")
            .src = img.src;

        });

    });

  }

}

// ❌ CLOSE MODAL
document.getElementById("closeModal")
  .addEventListener("click", () => {

    document.getElementById("productModal")
      .classList.add("hidden");

});

// CLOSE ON OUTSIDE CLICK
window.addEventListener("click", (e) => {

  if (e.target.id === "productModal") {

    document.getElementById("productModal")
      .classList.add("hidden");

  }

});

// 🔍 SEARCH SYSTEM
const searchInput =
  document.getElementById("searchInput");

const searchBtn =
  document.getElementById("searchBtn");

function performSearch() {

  const q =
    searchInput.value.toLowerCase();

  let filtered =

    products.filter(p =>

      (p.name || "")
        .toLowerCase()
        .includes(q)

    );

  if (activeCategory !== "All") {

    filtered =
      filtered.filter(p =>

        p.category === activeCategory

      );

  }

  render(filtered);

  document.getElementById("productGrid")
    .scrollIntoView({

      behavior: "smooth"

    });

}

// 🔘 SEARCH BUTTON
searchBtn.addEventListener(
  "click",
  performSearch
);

// ⌨️ ENTER KEY
searchInput.addEventListener(
  "keydown",
  e => {

    if (e.key === "Enter") {

      performSearch();

    }

  }
);

// 🔎 LIVE SEARCH
searchInput.addEventListener(
  "input",
  performSearch
);

// 🧭 CATEGORY FILTER
document.querySelectorAll(".tab")
  .forEach(tab => {

    tab.addEventListener("click", () => {

      document.querySelectorAll(".tab")
        .forEach(t =>
          t.classList.remove("active")
        );

      tab.classList.add("active");

      activeCategory =
        tab.dataset.category;

      let filtered = [...products];

      if (activeCategory !== "All") {

        filtered =
          filtered.filter(p =>

            p.category === activeCategory

          );

      }

      render(filtered);

    });

});

loadProducts();
