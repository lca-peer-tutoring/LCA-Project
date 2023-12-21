// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFunctions } from "firebase/functions";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCE_1cG2Tf15QbMTUaJ7KUqrhCzoctBsC8",
  authDomain: "lca-peer-tutoring.firebaseapp.com",
  projectId: "lca-peer-tutoring",
  storageBucket: "lca-peer-tutoring.appspot.com",
  messagingSenderId: "696823431698",
  appId: "1:696823431698:web:8bc882ce82fd4563dc8ecb",
  measurementId: "G-WRBHJBJWVJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

const querySnapshot = await getDocs(collection(db, "sessions"));
querySnapshot.forEach((doc) => {
  console.log(doc);
});
