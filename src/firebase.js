import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAeQXvewG_DjwJxSG3zRsQYc9iar4oO8KY",
  authDomain: "chatsystem-2ed0d.firebaseapp.com",
  projectId: "chatsystem-2ed0d",
  storageBucket: "chatsystem-2ed0d.appspot.com",
  messagingSenderId: "148836224244",
  appId: "1:148836224244:web:b36a57500f562b863162a1",
  measurementId: "G-LVQ7SS0ZJW",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()
