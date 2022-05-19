
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyBwvEkQoBkkEzDFmWfKjSb2rF8rYEC4H6s",
    authDomain: "petprojectchat.firebaseapp.com",
    projectId: "petprojectchat",
    storageBucket: "petprojectchat.appspot.com",
    messagingSenderId: "196907420857",
    appId: "1:196907420857:web:3c86604517e96e4d499f68",
    measurementId: "G-74Z1JHX8F2"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);

export default {db, auth, app}