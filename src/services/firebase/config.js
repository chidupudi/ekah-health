// src/services/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCpHfGdmKnRfsYkaYWh-cTyNVsygIaup0E",
  authDomain: "ekah-health.firebaseapp.com",
  projectId: "ekah-health",
  storageBucket: "ekah-health.firebasestorage.app",
  messagingSenderId: "522114504794",
  appId: "1:522114504794:web:25ac3fdd6f5cb26101a063",
  measurementId: "G-BXYQQJDWGV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;