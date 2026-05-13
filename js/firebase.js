import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getFirestore }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {

  apiKey: "AIzaSyAd42ozHgfDlSXefuDlygIknR-fBnVIWEk",

  authDomain:
    "affiliate-marketing-8c85c.firebaseapp.com",

  projectId:
    "affiliate-marketing-8c85c",

  storageBucket:
    "affiliate-marketing-8c85c.firebasestorage.app",

  messagingSenderId:
    "11553927643",

  appId:
    "1:115533927643:web:6c07c02d78cf05ebe1a8fe"

};

const app =
  initializeApp(firebaseConfig);

const db =
  getFirestore(app);

export { db };
