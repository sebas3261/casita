// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBa7u6v1g4B3qOO42rUtxSd18LG1D606xU",
  authDomain: "casita-515d3.firebaseapp.com",
  projectId: "casita-515d3",
  storageBucket: "casita-515d3.firebasestorage.app",
  messagingSenderId: "990355958874",
  appId: "1:990355958874:web:aca09ef580ef64f7ec3c63",
  measurementId: "G-T81JY2K8WY",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const realtimeDB = getDatabase(app);
export const storage = getStorage(app);
