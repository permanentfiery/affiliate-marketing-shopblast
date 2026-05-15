import { getProducts } from "./db.js";

let products = [];
let activeCategory = "All";

// 📦 LOAD PRODUCTS
async function loadProducts() {

  products = await getProducts();

  renderDeals(products);

  startDealTimers();

  renderProducts(products);

}

function isDealExpired(product) {

  if (!product.dealEndsAt) return false;

  return Date.now() > product.dealEndsAt;

}

// 🔥 DEALS OF THE DAY
function renderDeals(productsList) {

  const dealSection =
    document.getElementById("dealSection");

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

      <h2>🔥 DEALS OF THE DAY</h2>

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
                 <div class="deal-timer"
     data-end="${p.dealEndsAt}">
</div>

              ${
                discountPercent
                ? `
                  <div class="discount-badge">
                    ${discountPercent}% OFF
                  </div>
                `
                : ""
              }

              <img src="${imageSrc}">
              <div class="deal-timer" data-end="${p.dealEndsAt}">
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

  document.querySelectorAll(".deal-card")
    .forEach(card => {

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
    document.getElementById("productGrid");

  grid.innerHTML = productsList
.filter(p => {

  if (p.deal !== true) return true;

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

  document.querySelectorAll(".card")
    .forEach(card => {

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
  ).classList.remove("hidden");

  document.getElementById(
    "modalName"
  ).textContent = product.name;

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
  ).href = product.link;

  // 🎞 IMAGE SLIDER
  const track =
    document.getElementById(
      "sliderTrack"
    );

  const controls =
    document.getElementById(
      "sliderControls"
    );

  track.innerHTML = "";
  controls.innerHTML = "";

  const images =

    (product.images &&
     product.images.length > 0)

    ? product.images

    : (product.image
        ? [product.image]
        : []);

  let currentSlide = 0;

  images.forEach((img, index) => {

    track.innerHTML += `

      <div class="slide">

        <img src="${img}">

      </div>

    `;

    controls.innerHTML += `

      <button class="
        slider-dot
        ${index === 0 ? "active" : ""}
      " data-index="${index}">
      </button>

    `;

  });

  const dots =
    document.querySelectorAll(
      ".slider-dot"
    );

  function updateSlider(index) {

    if (index < 0) {

      currentSlide =
        images.length - 1;

    } else if (
      index >= images.length
    ) {

      currentSlide = 0;

    } else {

      currentSlide = index;

    }

    track.style.transform = `
      translateX(
        -${currentSlide * 100}%
      )
    `;

    dots.forEach(dot =>
      dot.classList.remove("active")
    );

    if (dots[currentSlide]) {

      dots[currentSlide]
        .classList.add("active");

    }

  }

  dots.forEach(dot => {

    dot.addEventListener(
      "click",
      () => {

        updateSlider(
          Number(
            dot.dataset.index
          )
        );

      }
    );

  });

  // ⬅️➡️ BUTTONS
  const prevBtn =
    document.getElementById(
      "prevSlide"
    );

  const nextBtn =
    document.getElementById(
      "nextSlide"
    );

  prevBtn.onclick = () => {

    updateSlider(
      currentSlide - 1
    );

  };

  nextBtn.onclick = () => {

    updateSlider(
      currentSlide + 1
    );

  };

  updateSlider(0);

}

// ❌ CLOSE MODAL
document.getElementById(
  "closeModal"
).addEventListener(
  "click",
  () => {

    document.getElementById(
      "productModal"
    ).classList.add("hidden");

  }
);

// 🔍 IMPROVED SEARCH
function performSearch() {

  const query =
    document.getElementById(
      "searchInput"
    ).value
      .toLowerCase()
      .trim();

  let filtered =
    products.filter(p => {

      const searchableText = `
        ${p.name || ""}
        ${p.category || ""}
        ${p.description || ""}
      `.toLowerCase();

      if (!query) {
        return true;
      }

      const words =
        query.split(" ")
             .filter(Boolean);

      return words.every(word =>
        searchableText.includes(word)
      );

    });

  // 🧭 CATEGORY FILTER
  if (
    activeCategory !== "All"
  ) {

    filtered =
      filtered.filter(
        p =>
          p.category ===
          activeCategory
      );

  }

  renderProducts(filtered);

}

document.getElementById(
  "searchBtn"
).addEventListener(
  "click",
  performSearch
);

document.getElementById(
  "searchInput"
).addEventListener(
  "input",
  performSearch
);

// 🧭 CATEGORY FILTER
document.querySelectorAll(".tab")
  .forEach(tab => {

    tab.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(".tab")
          .forEach(t =>
            t.classList.remove(
              "active"
            )
          );

        tab.classList.add(
          "active"
        );

        activeCategory =
          tab.dataset.category;

        performSearch();

      }
    );

  });

// 🌙 DARK MODE
const themeToggle =
  document.getElementById(
    "themeToggle"
  );

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

function startDealTimers() {

  const timers =
    document.querySelectorAll(".deal-timer");

  timers.forEach(timer => {

    const end =
      Number(timer.dataset.end);
    
    if (!end || isNaN(end)) {

  timer.innerHTML =
    "⏰ 24h";

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
          remaining / (1000 * 60 * 60)
        );

      const minutes =
        Math.floor(
          (remaining % (1000 * 60 * 60))
          / (1000 * 60)
        );

      const seconds =
        Math.floor(
          (remaining % (1000 * 60))
          / 1000
        );

      timer.innerHTML =
        `⏰ ${hours}h ${minutes}m ${seconds}s`;

    }

    update();

    setInterval(update, 1000);

  });

}

loadProducts();
