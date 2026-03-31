import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Aapki V LOS ki Database Key
const firebaseConfig = {
  apiKey: "AIzaSyB3kdYgCECEW8dJhLjBB7bKojPlqsAhnv0",
  authDomain: "v-los-d5c44.firebaseapp.com",
  projectId: "v-los-d5c44",
  storageBucket: "v-los-d5c44.firebasestorage.app",
  messagingSenderId: "1021203385365",
  appId: "1:1021203385365:web:5d3471fec38bacc59f521c",
  measurementId: "G-QEFJZMCXLZ"
};

// V LOS ko Firebase se connect karna
const app = initializeApp(firebaseConfig);

// Database (Memory) ko chaalu karna aur export karna
export const db = getFirestore(app);