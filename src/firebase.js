import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCHbeQnLHE90uBmF0FZ_2fQ8sQpZzlHYs4",
  authDomain: "logistics-tracking-app-3db7f.firebaseapp.com",
  projectId: "logistics-tracking-app-3db7f",
  storageBucket: "logistics-tracking-app-3db7f.firebasestorage.app",
  messagingSenderId: "1012177277367",
  appId: "1:1012177277367:web:c2f18df39d7e50eb121832",
  measurementId: "G-6JRY63QPFE",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
