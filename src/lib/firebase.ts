import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: "studio-684454327-e7713",
  appId: "1:755577173726:web:f34edf42b5d53ad4c1744f",
  storageBucket: "studio-684454327-e7713.firebasestorage.app",
  apiKey: "AIzaSyC9lXNDFrDwnOgzv7tAXRYhOhHknkegOzU",
  authDomain: "studio-684454327-e7713.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "755577173726"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
