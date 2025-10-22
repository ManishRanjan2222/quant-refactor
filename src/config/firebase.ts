import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAD2qHmX1nuTnuV3LzjWMo5QWWmrdARzlA",
  authDomain: "manishtradingapp.firebaseapp.com",
  projectId: "manishtradingapp",
  storageBucket: "manishtradingapp.firebasestorage.app",
  messagingSenderId: "469373682687",
  appId: "1:469373682687:web:1b8eaabcc2d582cd611dca",
  measurementId: "G-HVJSKH4GLS"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
