import { auth } from "./firebase.js";
import { addProduct as addToDB } from "./db.js";

import {
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

window.login = async function () {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  await signInWithEmailAndPassword(auth, email, pass);
};

onAuthStateChanged(auth, user => {
  if (user) {
    document.getElementById("adminPanel").style.display = "block";
    document.getElementById("loginBox").style.display = "none";
  }
});

window.addProduct = async function () {
  if (!auth.currentUser) {
    alert("Not authorized");
    return;
  }

  const name = document.getElementById("name").value;
  const price = Math.round(parseFloat(document.getElementById("price").value) * 100);
  const link = document.getElementById("link").value;
  const image = document.getElementById("image").value;

  await addToDB({
    name,
    price,
    link,
    image
  });

  alert("Product added successfully");
};
