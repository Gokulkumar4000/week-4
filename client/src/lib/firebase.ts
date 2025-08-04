import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCjP1qqjMFuT4HrmhlRsKusT5F4sbvnaHk",
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "week-4-6c326"}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "week-4-6c326",
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "week-4-6c326"}.firebasestorage.app`,
  messagingSenderId: "395343253159",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:395343253159:web:160b2d0e41c6e9dbe79582",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
