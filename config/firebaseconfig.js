// configFirebase.js
import { initializeApp } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";


// Configuration Firebase de votre application web
// Pour Firebase JS SDK v7.20.0 et ultérieur, measurementId est facultatif
const firebaseConfig = {
  apiKey: "AIzaSyDOt8GsdQkKOiQF-bUQ48Egf7yvZKbfoXk",
  authDomain: "dogout-d8546.firebaseapp.com",
  projectId: "dogout-d8546",
  storageBucket: "dogout-d8546.appspot.com",
  messagingSenderId: "520829264448",
  appId: "1:520829264448:web:92de3488abe58e417ff5a5",
  measurementId: "G-SQTR6E2DFY",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app, { persistence: getReactNativePersistence(ReactNativeAsyncStorage) });
const firestore = getFirestore(app);

export { app, auth, firestore };
