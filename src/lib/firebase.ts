import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  projectId: "studio-684454327-e7713",
  appId: "1:755577173726:web:f34edf42b5d53ad4c1744f",
  storageBucket: "studio-684454327-e7713.firebasestorage.app",
  apiKey: "AIzaSyC9lXNDFrDwnOgzv7tAXRYhOhHknkegOzU",
  authDomain: "studio-684454327-e7713.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "755577173726"
};

// Singleton instances
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

function initializeFirebase() {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } else {
    app = getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  }
}

// Initialize on module load
initializeFirebase();

export { app, db, auth };
