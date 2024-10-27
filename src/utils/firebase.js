// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBSnkN0am0jcq5gH-3WEqyJQjDoqYgzpwg",
    authDomain: "testing-push-notificatio-61ea4.firebaseapp.com",
    databaseURL: "https://testing-push-notificatio-61ea4-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "testing-push-notificatio-61ea4",
    storageBucket: "testing-push-notificatio-61ea4.appspot.com",
    messagingSenderId: "345432305587",
    appId: "1:345432305587:web:f60fc64f9aface4991a5c6",
    measurementId: "G-5HB9W2TQKV"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };