import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyApWe1JCOfDThAyUPsCsKN0LzkgwYMSPTM",
  authDomain: "justapoject.firebaseapp.com",
  projectId: "justapoject",
  storageBucket: "justapoject.appspot.com",
  messagingSenderId: "659720692370",
  appId: "1:659720692370:web:c35aba5c8840ea222e7c4b",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
