import { auth } from "./firebase.js";

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

let editingId = null;

document.addEventListener("DOMContentLoaded", () => {

  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const saveBtn = document.getElementById("saveBtn");

  const emailEl = document.getElementById("email");
  const passEl = document.getElementById("password");

  const nameEl = document.getElementById("name");
  const priceEl = document.getElementById("price");
  const linkEl = document.getElementById("link");
  const imageEl = document.getElementById("image");
  const descEl = document.getElementById("description");

  const categoryEl = document.getElementById("category");
  const dealEl = document.getElementById("deal");

  const loginBox = document.getElementById("loginBox");
  const adminPanel = document.getElementById("adminPanel");

  const productList = document.getElementById("productList");

  // LOGIN
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

  // LOGOUT
  logoutBtn.addEventListener("click", async () => {

    await signOut(auth);

    location.reload();

  });

  // AUTH
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

  // SAVE PRODUCT
  saveBtn.addEventListener("click", async () => {

    const product = {
      name: nameEl.value.trim(),
      price: Math.round(parseFloat(priceEl.value) * 100),
      link: linkEl.value.trim(),
      image: imageEl.value.trim(),
      description: descEl.value.trim(),
      category: categoryEl.value,
      deal: dealEl.value === "yes"
    };

    if (editingId) {

      await updateProduct(editingId, product);

      alert("Product updated");

      editingId = null;

    } else {

      await addProduct(product);

      alert("Product added");

    }

    clearForm();

    loadProducts();

  });

  // LOAD PRODUCTS
  async function loadProducts() {

    const products = await getProducts();

    productList.innerHTML = products.map(p => {

      return `
        <div class="product-item">

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
                  style="background:red;color:white;">
            Delete
          </button>

        </div>
      `;

    }).join("");

    // EDIT
    document.querySelectorAll(".editBtn").forEach(btn => {

      btn.addEventListener("click", async () => {

        const id = btn.dataset.id;

        const products = await getProducts();

        const p = products.find(x => x.id === id);

        if (!p) return;

        editingId = id;

        nameEl.value = p.name || "";
        priceEl.value = (p.price / 100).toFixed(2);
        linkEl.value = p.link || "";
        imageEl.value = p.image || "";
        descEl.value = p.description || "";

        categoryEl.value =
          p.category || "Electronics & Gadgets";

        dealEl.value =
          p.deal ? "yes" : "no";

      });

    });

    // DELETE
    document.querySelectorAll(".deleteBtn").forEach(btn => {

      btn.addEventListener("click", async () => {

        const id = btn.dataset.id;

        if (!confirm("Delete product?")) return;

        await deleteProduct(id);

        loadProducts();

      });

    });

  }

  // CLEAR FORM
  function clearForm() {

    nameEl.value = "";
    priceEl.value = "";
    linkEl.value = "";
    imageEl.value = "";
    descEl.value = "";

    categoryEl.value =
      "Electronics & Gadgets";

    dealEl.value = "no";

  }

});
