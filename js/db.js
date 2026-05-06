import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const col = collection(db, "products");

// 🔍 GET PRODUCTS
export async function getProducts() {

  const snap = await getDocs(col);

  return snap.docs.map(d => {

    const data = d.data();

    return {
      id: d.id,
      name: data.name || "",
      price: data.price || 0,
      link: data.link || "",
      image: data.image || "",
      description: data.description || "",
      category:
        data.category || "Electronics & Gadgets",
      deal: data.deal || false
    };

  });

}

// ➕ ADD PRODUCT
export async function addProduct(product) {

  return await addDoc(col, product);

}

// ✏️ UPDATE PRODUCT
export async function updateProduct(id, data) {

  const ref = doc(db, "products", id);

  await updateDoc(ref, data);

}

// ❌ DELETE PRODUCT
export async function deleteProduct(id) {

  const ref = doc(db, "products", id);

  await deleteDoc(ref);

}
