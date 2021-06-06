import firebase from "firebase/app";
import "firebase/firestore";

var firebaseConfig = {
  apiKey: "AIzaSyDWA98L46ugTJKcWSPzWYQfYWHPmBrkTqc",
  authDomain: "my-stuff-25315.firebaseapp.com",
  projectId: "my-stuff-25315",
  storageBucket: "my-stuff-25315.appspot.com",
  messagingSenderId: "446516003307",
  appId: "1:446516003307:web:3c6f7730712363696459ae"
};
// Initialize Firebase
export const firebaseApp = firebase.initializeApp(firebaseConfig);
