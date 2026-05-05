import { auth } from "./firebase.js";
import { addProduct as addToDB } from "./db.js";

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// LOGIN
window.login = async function () {
  const email = document.getElementById("email").value.trim();
  const pass = document.getElementById("password").value;

  if (!email || !pass) {
    alert("Enter email and password");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, pass);
  } catch (err) {
    alert("Login failed: " + err.message);
  }
};

// LOGOUT
window.logout = async function () {
  await signOut(auth);
  location.reload();
};

// AUTH STATE
onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("adminPanel").style.display = "block";
    document.getElementById("loginBox").style.display = "none";
  } else {
    document.getElementById("adminPanel").style.display = "none";
    document.getElementById("loginBox").style.display = "block";
  }
});

// ADD PRODUCT (🔥 includes deal flag)
window.addProduct = async function () {
  if (!auth.currentUser) {
    alert("Not authorized");
    return;
  }

  const name = document.getElementById("name").value.trim();
  const priceInput = document.getElementById("price").value;
  const link = document.getElementById("link").value.trim();
  const image = document.getElementById("image").value.trim();
  const deal = document.getElementById("deal").value === "yes";

  if (!name || !priceInput || !link) {
    alert("Fill all required fields");
    return;
  }

  const price = Math.round(parseFloat(priceInput) * 100);

  try {
    await addToDB({
      name,
      price,
      link,
      image: image || "",
      deal
    });

    alert("Product added");

    // Clear form
    document.getElementById("name").value = "";
    document.getElementById("price").value = "";
    document.getElementById("link").value = "";
    document.getElementById("image").value = "";
    document.getElementById("deal").value = "no";

  } catch (err) {
    alert("Error: " + err.message);
  }
};
