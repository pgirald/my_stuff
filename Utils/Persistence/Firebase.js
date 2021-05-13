import firebase from "firebase/app";
import "firebase/firestore";

var firebaseConfig = {
  apiKey: "AIzaSyDh2hJ8xcxMg26ELtQq4nktuWqzMy5KcIQ",
  authDomain: "my-new-stuff-6f787.firebaseapp.com",
  projectId: "my-new-stuff-6f787",
  storageBucket: "my-new-stuff-6f787.appspot.com",
  messagingSenderId: "1040143400531",
  appId: "1:1040143400531:web:aa709305453ae8ddd390a6"
};
// Initialize Firebase
export const firebaseApp = firebase.initializeApp(firebaseConfig);
