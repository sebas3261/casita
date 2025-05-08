// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCnSlo3uHDEdDMGwK62d7Tc2eRVj290ahA",
  authDomain: "casita-51c50.firebaseapp.com",
  projectId: "casita-51c50",
  storageBucket: "casita-51c50.firebasestorage.app",
  messagingSenderId: "132142193334",
  appId: "1:132142193334:web:2e5f746f26b89506822417",
  measurementId: "G-QX4QR6DQEL"
};


const app = initializeApp(firebaseConfig);
export const storage = getStorage(app); 
export const db = getFirestore(app);
export const auth = getAuth(app);