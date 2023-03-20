// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyApf_lRO51pWneVPTOWMOvX6k5s1o2wulw",
  authDomain: "react-properties-438da.firebaseapp.com",
  projectId: "react-properties-438da",
  storageBucket: "react-properties-438da.appspot.com",
  messagingSenderId: "684434755971",
  appId: "1:684434755971:web:2d9baf2180140e65e226b6",
  measurementId: "G-9WW8DQMWSX"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore()