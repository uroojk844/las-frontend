import { initializeApp } from "firebase/app";
import { getAuth  } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAyOHpESN1XLtLxCHCKC00JynSbyUOjhzY",
  authDomain: "littleangelschool-29f65.firebaseapp.com",
  projectId: "littleangelschool-29f65",
  storageBucket: "littleangelschool-29f65.firebasestorage.app",
  messagingSenderId: "502825447871",
  appId: "1:502825447871:web:ad97601165c1e8cebff10a"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);