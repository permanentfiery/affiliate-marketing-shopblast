import { auth } from "./firebase.js";
import { addProduct as addToDB } from "./db.js";

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// LOGIN
window.login = async function () {
  const emailEl = document.getElementById("email");
  const passEl = document.getElementById("password");

  if (!emailEl || !passEl) {
    alert("Input fields not found");
    return;
  }

  const email = emailEl.value.trim();
  const pass = passEl.value.trim();

  console.log("EMAIL:", email);
  console.log("PASS LENGTH:", pass.length);

  if (email === "" || pass === "") {
    alert("Enter email and password");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, pass);
    alert("Login successful");
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
