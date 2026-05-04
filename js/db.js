import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const col = collection(db, "products");

export async function getProducts() {
  const snap = await getDocs(col);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addProduct(product) {
  await addDoc(col, product);
}

export async function deleteProduct(id) {
  await deleteDoc(doc(db, "products", id));
}
