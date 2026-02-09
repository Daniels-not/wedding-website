// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA70ZC4t1YcoekeqcTp3BpgfluWDm_mcs4",
  authDomain: "weddingrk-8c8cc.firebaseapp.com",
  databaseURL: "https://weddingrk-8c8cc-default-rtdb.firebaseio.com",
  projectId: "weddingrk-8c8cc",
  storageBucket: "weddingrk-8c8cc.firebasestorage.app",
  messagingSenderId: "554654076458",
  appId: "1:554654076458:web:3f8c4dac939406f2debd53",
  measurementId: "G-127E7MN5SB"
};

// Initialize Firebase app only if none exists
const app = initializeApp(firebaseConfig);

// Firestore instance
const db = getFirestore(app);

export default db;

