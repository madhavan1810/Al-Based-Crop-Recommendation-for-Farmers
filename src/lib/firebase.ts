import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Hardcoding the config to definitively resolve initialization issues.
// This is safe for client-side Firebase configuration.
const firebaseConfig = {
  apiKey: "AIzaSyC9lXNDFrDwnOgzv7tAXRYhOhHknkegOzU",
  authDomain: "studio-684454327-e7713.firebaseapp.com",
  projectId: "studio-684454327-e7713",
  storageBucket: "studio-684454327-e7713.firebasestorage.app",
  messagingSenderId: "755577173726",
  appId: "1:755577173726:web:f34edf42b5d53ad4c1744f"
};

// This is the correct way to initialize Firebase in a Next.js app
// It ensures that we don't try to re-initialize the app on every render
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export { app, auth, db };
