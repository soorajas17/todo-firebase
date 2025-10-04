// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCxnXgE6DSmIIh-5kqmtAfWJpOwOT8iyZI",
  authDomain: "to-do-86702.firebaseapp.com",
  projectId: "to-do-86702",
  storageBucket: "to-do-86702.firebasestorage.app",
  messagingSenderId: "530154579968",
  appId: "1:530154579968:web:e9e9a5b3e0472666b7d0e5",
  measurementId: "G-3F7D2ZXK80"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);