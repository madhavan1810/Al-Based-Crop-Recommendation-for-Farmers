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

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

auth = getAuth(app);
db = getFirestore(app);


export { app, db, auth };
