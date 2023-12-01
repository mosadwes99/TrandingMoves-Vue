// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCsq2JDWJ2eHTIHLvVyc_HPbeSxTPUXIXA",
  authDomain: "trandingmovies-b92af.firebaseapp.com",
  projectId: "trandingmovies-b92af",
  storageBucket: "trandingmovies-b92af.appspot.com",
  messagingSenderId: "885354106581",
  appId: "1:885354106581:web:fc71cc8b3a117339385c5c",
  measurementId: "G-7RNJ5XBTL1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export { auth, db };
