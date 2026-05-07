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

document.addEventListener("DOMContentLoaded", () => {

  // 🔐 AUTH ELEMENTS
  const loginBtn =
    document.getElementById("loginBtn");

  const logoutBtn =
    document.getElementById("logoutBtn");

  const saveBtn =
    document.getElementById("saveBtn");

  // 🔑 LOGIN INPUTS
  const emailEl =
    document.getElementById("email");

  const passEl =
    document.getElementById("password");

  // 🛍 PRODUCT INPUTS
  const nameEl =
    document.getElementById("name");

  const priceEl =
    document.getElementById("price");

  const linkEl =
    document.getElementById("link");

  const descEl =
    document.getElementById("description");

  const categoryEl =
    document.getElementById("category");

  const dealEl =
    document.getElementById("deal");

  // 🖼 IMAGE SYSTEM
  const addImageBtn =
    document.getElementById("addImageBtn");

  const imageInputs =
    document.getElementById("imageInputs");

  const previewGrid =
    document.getElementById("previewGrid");

  // 🧱 PANELS
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
        emailEl.value.trim(),
        passEl.value.trim()
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

  // 👤 AUTH STATE
  onAuthStateChanged(auth, (user) => {

    if (user) {

      loginBox.style.display = "none";

      adminPanel.style.display = "block";

      loadProducts();

    } else {

      loginBox.style.display = "block";

      adminPanel.style.display = "none";

    }

  });

  // ➕ ADD MORE IMAGE INPUTS
  addImageBtn.addEventListener("click", () => {

    const input =
      document.createElement("input");

    input.type = "file";

    input.accept = "image/*";

    input.className = "imageInput";

    imageInputs.appendChild(input);

    attachPreview(input);

  });

  // 🖼 PREVIEW FUNCTION
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

  // INITIAL PREVIEW SUPPORT
  document.querySelectorAll(".imageInput")
    .forEach(attachPreview);

  // ☁️ UPLOAD IMAGES
  async function uploadImages() {

    const inputs =
      document.querySelectorAll(".imageInput");

    const urls = [];

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

    try {

      saveBtn.textContent = "Uploading...";

      // ☁️ UPLOAD IMAGES
      const imageUrls =
        await uploadImages();

      const product = {

        name:
          nameEl.value.trim(),

        price:
          Math.round(
            parseFloat(priceEl.value) * 100
          ),

        link:
          linkEl.value.trim(),

        description:
          descEl.value.trim(),

        category:
          categoryEl.value,

        deal:
          dealEl.value === "yes",

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

          nameEl.value =
            p.name || "";

          priceEl.value =
            (p.price / 100).toFixed(2);

          linkEl.value =
            p.link || "";

          descEl.value =
            p.description || "";

          categoryEl.value =
            p.category ||
            "Electronics & Gadgets";

          dealEl.value =
            p.deal ? "yes" : "no";

          previewGrid.innerHTML = "";

          (p.images || []).forEach(imgUrl => {

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

    nameEl.value = "";

    priceEl.value = "";

    linkEl.value = "";

    descEl.value = "";

    categoryEl.value =
      "Electronics & Gadgets";

    dealEl.value = "no";

    previewGrid.innerHTML = "";

    imageInputs.innerHTML = `
      <input type="file"
             class="imageInput"
             accept="image/*">
    `;

    document.querySelectorAll(".imageInput")
      .forEach(attachPreview);

  }

});
