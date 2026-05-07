import { auth, storage } from "./firebase.js";

import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct
} from "./db.js";

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

let editingId = null;
let existingImages = [];

document.addEventListener("DOMContentLoaded", () => {

  const loginBtn =
    document.getElementById("loginBtn");

  const logoutBtn =
    document.getElementById("logoutBtn");

  const saveBtn =
    document.getElementById("saveBtn");

  const addImageBtn =
    document.getElementById("addImageBtn");

  const addUrlBtn =
    document.getElementById("addUrlBtn");

  const imageInputs =
    document.getElementById("imageInputs");

  const urlInputs =
    document.getElementById("urlInputs");

  const previewGrid =
    document.getElementById("previewGrid");

  const loginBox =
    document.getElementById("loginBox");

  const adminPanel =
    document.getElementById("adminPanel");

  const productList =
    document.getElementById("productList");

  // 🔐 LOGIN
  loginBtn.addEventListener("click", async () => {

    try {

      await signInWithEmailAndPassword(
        auth,
        document.getElementById("email").value,
        document.getElementById("password").value
      );

    } catch (err) {

      alert(err.message);

    }

  });

  // 🚪 LOGOUT
  logoutBtn.addEventListener("click", async () => {

    await signOut(auth);

    location.reload();

  });

  // 👤 AUTH
  onAuthStateChanged(auth, user => {

    if (user) {

      loginBox.style.display = "none";

      adminPanel.style.display = "block";

      loadProducts();

    } else {

      loginBox.style.display = "block";

      adminPanel.style.display = "none";

    }

  });

  // ➕ ADD LOCAL IMAGE ROW
  addImageBtn.addEventListener("click", () => {

    const row =
      document.createElement("div");

    row.className = "image-row";

    row.innerHTML = `

      <input type="file"
             class="imageInput"
             accept="image/*">

      <button type="button"
              class="removeImageBtn">
        Remove
      </button>

    `;

    imageInputs.appendChild(row);

    attachPreview(
      row.querySelector(".imageInput")
    );

    attachRemoveButtons();

  });

  // ➕ ADD URL IMAGE ROW
  addUrlBtn.addEventListener("click", () => {

    const row =
      document.createElement("div");

    row.className = "url-row";

    row.innerHTML = `

      <input type="text"
             class="urlImageInput"
             placeholder="Paste image URL">

      <button type="button"
              class="removeUrlBtn">
        Remove
      </button>

    `;

    urlInputs.appendChild(row);

    attachRemoveButtons();

  });

  // ❌ REMOVE BUTTONS
  function attachRemoveButtons() {

    document.querySelectorAll(".removeImageBtn")
      .forEach(btn => {

        btn.onclick = () => {

          const row =
            btn.closest(".image-row");

          if (
            document.querySelectorAll(".image-row")
              .length > 1
          ) {

            row.remove();

          }

        };

    });

    document.querySelectorAll(".removeUrlBtn")
      .forEach(btn => {

        btn.onclick = () => {

          const row =
            btn.closest(".url-row");

          if (
            document.querySelectorAll(".url-row")
              .length > 1
          ) {

            row.remove();

          }

        };

    });

  }

  attachRemoveButtons();

  // 🖼 PREVIEW
  function attachPreview(input) {

    input.addEventListener("change", () => {

      previewGrid.innerHTML = "";

      document.querySelectorAll(".imageInput")
        .forEach(inp => {

          const file = inp.files[0];

          if (!file) return;

          const img =
            document.createElement("img");

          img.src =
            URL.createObjectURL(file);

          previewGrid.appendChild(img);

      });

    });

  }

  document.querySelectorAll(".imageInput")
    .forEach(attachPreview);

  // ☁️ UPLOAD IMAGES
  async function uploadImages() {

    const urls = [...existingImages];

    // 🌐 URL IMAGES
    document.querySelectorAll(".urlImageInput")
      .forEach(input => {

        const value =
          input.value.trim();

        if (value) {
          urls.push(value);
        }

    });

    // 📁 LOCAL FILES
    const inputs =
      document.querySelectorAll(".imageInput");

    for (const input of inputs) {

      const file = input.files[0];

      if (!file) continue;

      const fileRef = ref(
        storage,
        `products/${Date.now()}-${file.name}`
      );

      await uploadBytes(fileRef, file);

      const url =
        await getDownloadURL(fileRef);

      urls.push(url);

    }

    return urls;

  }

  // 💾 SAVE PRODUCT
  saveBtn.addEventListener("click", async () => {

    saveBtn.textContent = "Uploading...";

    try {

      const imageUrls =
        await uploadImages();

      const product = {

        name:
          document.getElementById("name")
            .value.trim(),

        price:
          Math.round(
            parseFloat(
              document.getElementById("price")
                .value
            ) * 100
          ),

        link:
          document.getElementById("link")
            .value.trim(),

        description:
          document.getElementById("description")
            .value.trim(),

        category:
          document.getElementById("category")
            .value,

        deal:
          document.getElementById("deal")
            .value === "yes",

        images:
          imageUrls

      };

      // ✏️ UPDATE
      if (editingId) {

        await updateProduct(
          editingId,
          product
        );

        alert("Product updated");

        editingId = null;

      }

      // ➕ ADD
      else {

        await addProduct(product);

        alert("Product added");

      }

      clearForm();

      loadProducts();

    } catch (err) {

      console.error(err);

      alert(err.message);

    }

    saveBtn.textContent = "Save Product";

  });

  // 📦 LOAD PRODUCTS
  async function loadProducts() {

    const products =
      await getProducts();

    productList.innerHTML =
      products.map(p => {

        const img =
          p.images?.[0] ||
          "https://via.placeholder.com/80";

        return `
          <div class="product-item">

            <img
              src="${img}"

              style="
                width:80px;
                height:80px;
                object-fit:cover;
                border:2px solid black;
              ">

            <h3>${p.name}</h3>

            <p>
              ₹${(p.price / 100).toFixed(2)}
            </p>

            <p>
              ${p.category}
            </p>

            <button class="editBtn"
                    data-id="${p.id}">
              Edit
            </button>

            <button class="deleteBtn"
                    data-id="${p.id}"

                    style="
                      background:red;
                      color:white;
                    ">
              Delete
            </button>

          </div>
        `;

    }).join("");

    // ✏️ EDIT
    document.querySelectorAll(".editBtn")
      .forEach(btn => {

        btn.addEventListener("click",
          async () => {

          const id =
            btn.dataset.id;

          const products =
            await getProducts();

          const p =
            products.find(x => x.id === id);

          if (!p) return;

          editingId = id;

          existingImages =
            p.images || [];

          document.getElementById("name")
            .value = p.name || "";

          document.getElementById("price")
            .value =
              (p.price / 100).toFixed(2);

          document.getElementById("link")
            .value = p.link || "";

          document.getElementById("description")
            .value =
              p.description || "";

          document.getElementById("category")
            .value =
              p.category ||
              "Electronics & Gadgets";

          document.getElementById("deal")
            .value =
              p.deal ? "yes" : "no";

          previewGrid.innerHTML = "";

          existingImages.forEach(imgUrl => {

            const img =
              document.createElement("img");

            img.src = imgUrl;

            previewGrid.appendChild(img);

          });

        });

    });

    // ❌ DELETE
    document.querySelectorAll(".deleteBtn")
      .forEach(btn => {

        btn.addEventListener("click",
          async () => {

          const id =
            btn.dataset.id;

          if (!confirm("Delete product?"))
            return;

          await deleteProduct(id);

          loadProducts();

        });

    });

  }

  // 🧹 CLEAR FORM
  function clearForm() {

    existingImages = [];

    previewGrid.innerHTML = "";

    imageInputs.innerHTML = `

      <div class="image-row">

        <input type="file"
               class="imageInput"
               accept="image/*">

        <button type="button"
                class="removeImageBtn">
          Remove
        </button>

      </div>

    `;

    urlInputs.innerHTML = `

      <div class="url-row">

        <input type="text"
               class="urlImageInput"
               placeholder="Paste image URL">

        <button type="button"
                class="removeUrlBtn">
          Remove
        </button>

      </div>

    `;

    document.querySelectorAll(".imageInput")
      .forEach(attachPreview);

    attachRemoveButtons();

  }

});
