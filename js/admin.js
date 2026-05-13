import {
  addProduct,
  getProducts,
  deleteProduct,
  updateProduct
} from "./db.js";

const form =
  document.getElementById(
    "productForm"
  );

const productsContainer =
  document.getElementById(
    "adminProducts"
  );

const imageContainer =
  document.getElementById(
    "imageContainer"
  );

const addImageBtn =
  document.getElementById(
    "addImageBtn"
  );

// ➕ ADD IMAGE FIELD
addImageBtn.addEventListener(
  "click",
  () => {

    const row =
      document.createElement("div");

    row.className = "image-row";

    row.innerHTML = `

      <input type="url"
             class="image-input"
             placeholder="Image URL">

      <button type="button"
              class="remove-btn">
        Remove
      </button>

    `;

    imageContainer.appendChild(row);

  }
);

// ❌ REMOVE IMAGE FIELD
imageContainer.addEventListener(
  "click",
  e => {

    if (
      e.target.classList.contains(
        "remove-btn"
      )
    ) {

      e.target.parentElement.remove();

    }

});

// 📦 LOAD PRODUCTS
async function loadProducts() {

  const products =
    await getProducts();

  productsContainer.innerHTML =
    products.map(product => {

      const image =

        (product.images &&
         product.images.length > 0)

        ? product.images[0]

        : (product.image || "");

      return `

        <div class="admin-card">

          <img src="${image}">

          <h3>${product.name}</h3>

          <p>
            ₹${(
              product.price
            ).toFixed(2)}
          </p>

          <div class="admin-actions">

            <button
              class="edit-btn"
              data-id="${product.id}">
              Edit
            </button>

            <button
              class="delete-btn"
              data-id="${product.id}">
              Delete
            </button>

          </div>

        </div>

      `;

    }).join("");

  // ✏️ EDIT
  document.querySelectorAll(
    ".edit-btn"
  ).forEach(btn => {

    btn.addEventListener(
      "click",
      async () => {

        const products =
          await getProducts();

        const product =
          products.find(
            p => p.id === btn.dataset.id
          );

        if (!product) return;

        document.getElementById(
          "editId"
        ).value = product.id;

        document.getElementById(
          "name"
        ).value = product.name || "";

        document.getElementById(
          "price"
        ).value = product.price || "";

        document.getElementById(
          "originalPrice"
        ).value =
          product.originalPrice || "";

        document.getElementById(
          "category"
        ).value =
          product.category || "";

        document.getElementById(
          "description"
        ).value =
          product.description || "";

        document.getElementById(
          "link"
        ).value =
          product.link || "";

        document.getElementById(
          "deal"
        ).value =
          product.deal
          ? "true"
          : "false";

        imageContainer.innerHTML = "";

        const images =

          (product.images &&
           product.images.length > 0)

          ? product.images

          : (product.image
              ? [product.image]
              : []);

        images.forEach(img => {

          const row =
            document.createElement(
              "div"
            );

          row.className =
            "image-row";

          row.innerHTML = `

            <input type="url"
                   class="image-input"
                   value="${img}">

            <button type="button"
                    class="remove-btn">
              Remove
            </button>

          `;

          imageContainer.appendChild(
            row
          );

        });

        window.scrollTo({

          top: 0,

          behavior: "smooth"

        });

      }
    );

  });

  // ❌ DELETE
  document.querySelectorAll(
    ".delete-btn"
  ).forEach(btn => {

    btn.addEventListener(
      "click",
      async () => {

        await deleteProduct(
          btn.dataset.id
        );

        loadProducts();

      }
    );

  });

}

// 💾 SAVE
form.addEventListener(
  "submit",
  async e => {

    e.preventDefault();

    const imageInputs =
      document.querySelectorAll(
        ".image-input"
      );

    const images = [];

    imageInputs.forEach(input => {

      if (input.value.trim()) {

        images.push(
          input.value.trim()
        );

      }

    });

    const product = {

      name:
        document.getElementById(
          "name"
        ).value,

      price:
        Number(
          document.getElementById(
            "price"
          ).value
        ),

      originalPrice:
        Number(
          document.getElementById(
            "originalPrice"
          ).value
        ) || null,

      category:
        document.getElementById(
          "category"
        ).value,

      description:
        document.getElementById(
          "description"
        ).value,

      link:
        document.getElementById(
          "link"
        ).value,

      deal:
        document.getElementById(
          "deal"
        ).value === "true",

      images

    };

    const editId =
      document.getElementById(
        "editId"
      ).value;

    if (editId) {

      await updateProduct(
        editId,
        product
      );

    } else {

      await addProduct(product);

    }

    form.reset();

    document.getElementById(
      "editId"
    ).value = "";

    loadProducts();

  }
);

loadProducts();
