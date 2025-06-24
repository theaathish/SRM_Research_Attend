// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD-EGtOlBWDOIjLiqymHR2EbCfcns-PI94",
  authDomain: "attandance-srm.firebaseapp.com",
  projectId: "attandance-srm",
  storageBucket: "attandance-srm.appspot.com",
  messagingSenderId: "730018146358",
  appId: "1:730018146358:web:072a85bd0e4a8317471097"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
