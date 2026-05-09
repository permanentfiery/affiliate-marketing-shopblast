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

              <img src="${image}">

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

        <img src="${image}">

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

  document.body.style.overflow = "hidden";

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

  // 🖼 IMAGES
  const images =
    (product.images || [product.image])
      .filter(Boolean);

  const sliderTrack =
    document.getElementById("sliderTrack");

  const sliderControls =
    document.getElementById("sliderControls");

  sliderTrack.innerHTML = "";
  sliderControls.innerHTML = "";

  let currentSlide = 0;

  // 🎞 CREATE SLIDES
  images.forEach((img, index) => {

    const slide =
      document.createElement("div");

    slide.className = "slide";

    slide.innerHTML = `
      <img src="${img}">
    `;

    sliderTrack.appendChild(slide);

    const dot =
      document.createElement("button");

    dot.className =
      `slider-dot ${
        index === 0 ? "active" : ""
      }`;

    dot.dataset.index = index;

    sliderControls.appendChild(dot);

  });

  const dots =
    document.querySelectorAll(".slider-dot");

  function updateSlider(index) {

    if (index < 0) {
      index = images.length - 1;
    }

    if (index >= images.length) {
      index = 0;
    }

    currentSlide = index;

    sliderTrack.style.transform =
      `translateX(-${currentSlide * 100}%)`;

    dots.forEach(dot => {

      dot.classList.remove("active");

    });

    if (dots[currentSlide]) {

      dots[currentSlide]
        .classList.add("active");

    }

  }

  // 🔘 DOTS
  dots.forEach(dot => {

    dot.addEventListener("click", () => {

      updateSlider(
        Number(dot.dataset.index)
      );

    });

  });

  // ⬅️➡️ BUTTONS
  const oldPrev =
    document.getElementById("prevSlide");

  const oldNext =
    document.getElementById("nextSlide");

  const newPrev =
    oldPrev.cloneNode(true);

  const newNext =
    oldNext.cloneNode(true);

  oldPrev.parentNode.replaceChild(
    newPrev,
    oldPrev
  );

  oldNext.parentNode.replaceChild(
    newNext,
    oldNext
  );

  newPrev.addEventListener("click", () => {

    updateSlider(currentSlide - 1);

  });

  newNext.addEventListener("click", () => {

    updateSlider(currentSlide + 1);

  });

  // ⏱ AUTO SLIDE
  clearInterval(window.sliderInterval);

  if (images.length > 1) {

    window.sliderInterval =
      setInterval(() => {

        updateSlider(currentSlide + 1);

      }, 5000);

  }

  updateSlider(0);

}

// ❌ CLOSE MODAL
document.getElementById("closeModal")
  .addEventListener("click", () => {

    document.getElementById("productModal")
      .classList.add("hidden");

    document.body.style.overflow = "auto";

    clearInterval(window.sliderInterval);

});

// CLOSE ON OUTSIDE CLICK
window.addEventListener("click", (e) => {

  if (e.target.id === "productModal") {

    document.getElementById("productModal")
      .classList.add("hidden");

    document.body.style.overflow = "auto";

    clearInterval(window.sliderInterval);

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
