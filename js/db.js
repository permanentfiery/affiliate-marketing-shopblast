import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const col = collection(db, "products");

// ✅ FIXED: Proper mapping
export async function getProducts() {
  const snap = await getDocs(col);

  return snap.docs.map(d => {
    const data = d.data();

    console.log("RAW DOC:", data); // DEBUG

    return {
      id: d.id,
      name: data.name,
      price: data.price,
      link: data.link,
      image: data.image,
      deal: data.deal
    };
  });
}

// ADD
export async function addProduct(p) {
  return await addDoc(col, p);
}

// DELETE
export async function deleteProduct(id) {
  return await deleteDoc(doc(db, "products", id));
}
