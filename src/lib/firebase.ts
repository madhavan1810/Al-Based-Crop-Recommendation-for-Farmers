import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC9lXNDFrDwnOgzv7tAXRYhOhHknkegOzU",
  authDomain: "studio-684454327-e7713.firebaseapp.com",
  projectId: "studio-684454327-e7713",
  storageBucket: "studio-684454327-e7713.appspot.com",
  messagingSenderId: "755577173726",
  appId: "1:755577173726:web:f34edf42b5d53ad4c1744f",
};

// Initialize Firebase for SSR
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export { app, auth, db };
