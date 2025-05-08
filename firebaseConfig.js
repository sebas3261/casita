import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCnSlo3uHDEdDMGwK62d7Tc2eRVj290ahA",
  authDomain: "casita-51c50.firebaseapp.com",
  projectId: "casita-51c50",
  storageBucket: "casita-51c50.firebasestorage.app",
  messagingSenderId: "132142193334",
  appId: "1:132142193334:web:2e5f746f26b89506822417",
  measurementId: "G-QX4QR6DQEL"
};

export const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

export const db = getFirestore(app);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});