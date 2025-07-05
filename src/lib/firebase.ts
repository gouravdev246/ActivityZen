
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBqC0sd9K06Jp6cB-Xc2XOevcYIO2mCicI",
  authDomain: "activityzen-800b0.firebaseapp.com",
  projectId: "activityzen-800b0",
  storageBucket: "activityzen-800b0.firebasestorage.app",
  messagingSenderId: "36336996993",
  appId: "1:36336996993:web:1675279f0a158b301ef380",
  measurementId: "G-E57RXPJ90W"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
