import { auth } from "./firebase.js";
import { addProduct as addToDB } from "./db.js";

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {

  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const addBtn = document.getElementById("addBtn");

  const emailEl = document.getElementById("email");
  const passEl = document.getElementById("password");

  const nameEl = document.getElementById("name");
  const priceEl = document.getElementById("price");
  const linkEl = document.getElementById("link");
  const imageEl = document.getElementById("image");
  const dealEl = document.getElementById("deal");

  const loginBox = document.getElementById("loginBox");
  const adminPanel = document.getElementById("adminPanel");

  // LOGIN
  loginBtn.addEventListener("click", async () => {
    const email = emailEl.value.trim();
    const pass = passEl.value.trim();

    if (!email || !pass) {
      alert("Enter email and password");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, pass);
      alert("Login successful");
    } catch (err) {
      alert(err.message);
    }
  });

  // LOGOUT
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    location.reload();
  });

  // ADD PRODUCT (FIXED DEAL BOOLEAN)
  addBtn.addEventListener("click", async () => {
    if (!auth.currentUser) {
      alert("Not authorized");
      return;
    }

    const name = nameEl.value.trim();
    const priceInput = priceEl.value;
    const link = linkEl.value.trim();
    const image = imageEl.value.trim();

    // 🔥 FORCE BOOLEAN
    const deal = dealEl.value === "yes";

    if (!name || !priceInput || !link) {
      alert("Fill all required fields");
      return;
    }

    const price = Math.round(parseFloat(priceInput) * 100);

    await addToDB({
      name,
      price,
      link,
      image,
      deal
    });

    alert("Product added");

    nameEl.value = "";
    priceEl.value = "";
    linkEl.value = "";
    imageEl.value = "";
    dealEl.value = "no";
  });

  // AUTH STATE
  onAuthStateChanged(auth, (user) => {
    if (user) {
      adminPanel.style.display = "block";
      loginBox.style.display = "none";
    } else {
      adminPanel.style.display = "none";
      loginBox.style.display = "block";
    }
  });

});
