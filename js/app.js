import { getProducts } from "./db.js";

let products = [];
let activeCategory = "All";
let searchQuery = "";

// 📦 LOAD PRODUCTS
async function loadProducts() {

  products = await getProducts();

  renderDeals(products);

  startDealTimers();

  renderProducts(products);

}

// ⏰ DEAL EXPIRY CHECK
function isDealExpired(product) {

  if (!product.dealEndsAt) return false;

  return Date.now() > product.dealEndsAt;

}

// 🔥 DEALS OF THE DAY
function renderDeals(productsList) {

  const dealSection =
    document.getElementById(
      "dealSection"
    );

  const deals = productsList.filter(p => {

    if (p.deal !== true) return false;

    return !isDealExpired(p);

  });

  if (deals.length === 0) {

    dealSection.innerHTML = "";

    return;

  }

  dealSection.innerHTML = `

    <div class="deal">

      <h2>
        🔥 DEALS OF THE DAY
      </h2>

      <div class="deals-grid">

        ${deals.map(p => {

          const discountedPrice =
            Number(p.price)
              .toFixed(2);

          const originalPrice =
            p.originalPrice || null;

          const formattedOriginal =
            originalPrice
            ? Number(originalPrice)
                .toFixed(2)
            : null;

          const discountPercent =
            originalPrice
            ? Math.round(
                (
                  (
                    originalPrice -
                    p.price
                  ) /
                  originalPrice
                ) * 100
              )
            : null;

          const imageSrc =

            (p.images &&
             p.images.length > 0)

            ? p.images[0]

            : (p.image || "");

          return `

            <div class="deal-card"
                 data-id="${p.id}">

              <div class="deal-image-wrap">

                <img src="${imageSrc}">

                ${
                  discountPercent
                  ? `
                    <div class="discount-badge">
                      ${discountPercent}% OFF
                    </div>
                  `
                  : ""
                }

                <div class="deal-timer"
                     data-end="${Number(p.dealEndsAt) || 0}">
                </div>

              </div>

              <h4>${p.name}</h4>

              <p>

                ${
                  formattedOriginal
                  ? `
                    <span style="
                      text-decoration:
                        line-through;

                      opacity:0.6;

                      font-size:13px;

                      margin-right:6px;
                    ">
                      ₹${formattedOriginal}
                    </span>
                  `
                  : ""
                }

                <b>
                  ₹${discountedPrice}
                </b>

              </p>

              <a class="buy"
                 href="${p.link}"
                 target="_blank">

                GRAB DEAL

              </a>

            </div>

          `;

        }).join("")}

      </div>

    </div>

  `;

  document.querySelectorAll(
    ".deal-card"
  ).forEach(card => {

    card.addEventListener(
      "click",
      () => {

        const product =
          products.find(
            p =>
              p.id ===
              card.dataset.id
          );

        openModal(product);

      }
    );

  });

}

// 🛍 PRODUCT GRID
function renderProducts(productsList) {

  const grid =
    document.getElementById(
      "productGrid"
    );

 const filteredProducts =
  productsList

  .filter(p => {

    if (p.deal !== true)
      return true;

    return isDealExpired(p);

  })

  .filter(p => {

    if (
      activeCategory !== "All" &&
      p.category !== activeCategory
    ) {

      return false;

    }

    if (!searchQuery)
      return true;

    const text = `
      ${p.name}
      ${p.description || ""}
      ${p.category || ""}
    `.toLowerCase();

    return text.includes(
      searchQuery.toLowerCase()
    );

  });

grid.innerHTML =
  filteredProducts

  .filter(p => {

    if (p.deal !== true)
      return true;

    return isDealExpired(p);

  })

  .map(p => {

    const discountedPrice =
      Number(p.price)
        .toFixed(2);

    const originalPrice =
      p.originalPrice || null;

    const formattedOriginal =
      originalPrice
      ? Number(originalPrice)
          .toFixed(2)
      : null;

    const imageSrc =

      (p.images &&
       p.images.length > 0)

      ? p.images[0]

      : (p.image || "");

    return `

      <div class="card"
           data-id="${p.id}">

        <img src="${imageSrc}">

        <h3>${p.name}</h3>

        <p>

          ${
            formattedOriginal
            ? `
              <span style="
                text-decoration:
                  line-through;

                opacity:0.6;

                font-size:14px;

                margin-right:8px;
              ">
                ₹${formattedOriginal}
              </span>
            `
            : ""
          }

          <b>
            ₹${discountedPrice}
          </b>

        </p>

        <a class="buy"
           href="${p.link}"
           target="_blank">

          BUY NOW

        </a>

      </div>

    `;

  }).join("");

  document.querySelectorAll(
    ".card"
  ).forEach(card => {

    card.addEventListener(
      "click",
      () => {

        const product =
          products.find(
            p =>
              p.id ===
              card.dataset.id
          );

        openModal(product);

      }
    );

  });

}

// 🪟 MODAL
function openModal(product) {

  document.getElementById(
    "productModal"
  ).classList.remove(
    "hidden"
  );

  document.getElementById(
    "modalName"
  ).textContent =
    product.name;

  const discountedPrice =
    Number(product.price)
      .toFixed(2);

  const originalPrice =
    product.originalPrice || null;

  const formattedOriginal =
    originalPrice
    ? Number(originalPrice)
        .toFixed(2)
    : null;

  document.getElementById(
    "modalPrice"
  ).innerHTML = `

    ${
      formattedOriginal
      ? `
        <span style="
          text-decoration:
            line-through;

          opacity:0.6;

          font-size:15px;

          margin-right:8px;
        ">
          ₹${formattedOriginal}
        </span>
      `
      : ""
    }

    <b>
      ₹${discountedPrice}
    </b>

  `;

  document.getElementById(
    "modalDesc"
  ).textContent =
    product.description || "";

  document.getElementById(
    "modalLink"
  ).href =
    product.link;

}

// ❌ CLOSE MODAL
document.getElementById(
  "closeModal"
).addEventListener(
  "click",
  () => {

    document.getElementById(
      "productModal"
    ).classList.add(
      "hidden"
    );

  }
);

// ⏰ TIMERS
function startDealTimers() {

  const timers =
    document.querySelectorAll(
      ".deal-timer"
    );

  timers.forEach(timer => {

    const end =
      Number(timer.dataset.end);

    if (!end || isNaN(end)) {

      timer.innerHTML =
        "⏰ 24h left";

      return;

    }

    function update() {

      const remaining =
        end - Date.now();

      if (remaining <= 0) {

        timer.innerHTML =
          "Deal Ended";

        return;

      }

      const hours =
        Math.floor(
          remaining /
          (1000 * 60 * 60)
        );

      const minutes =
        Math.floor(
          (
            remaining %
            (1000 * 60 * 60)
          ) /
          (1000 * 60)
        );

      const seconds =
        Math.floor(
          (
            remaining %
            (1000 * 60)
          ) / 1000
        );

      timer.innerHTML =
        `⏰ ${hours}h ${minutes}m ${seconds}s`;

    }

    update();

    setInterval(
      update,
      1000
    );

  });

}
// 🌙 DARK MODE
const themeToggle =
  document.getElementById(
    "themeToggle"
  );

if (themeToggle) {

  if (
    localStorage.getItem("theme")
    === "dark"
  ) {

    document.body.classList.add(
      "dark"
    );

    themeToggle.textContent =
      "☀️";

  }

  themeToggle.addEventListener(
    "click",
    () => {

      document.body.classList.toggle(
        "dark"
      );

      const dark =
        document.body.classList.contains(
          "dark"
        );

      themeToggle.textContent =
        dark ? "☀️" : "🌙";

      localStorage.setItem(
        "theme",
        dark ? "dark" : "light"
      );

    }
  );

}
// 🔍 SEARCH
const searchInput =
  document.getElementById(
    "searchInput"
  );

if (searchInput) {

  searchInput.addEventListener(
    "input",
    e => {

      searchQuery =
        e.target.value;

      renderProducts(products);

    }
  );

}
loadProducts();
