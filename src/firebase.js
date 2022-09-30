import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getStorage } from "firebase/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBQxfjSxdcIXtCqDxYuIlYDwiQVTqm1xhw",
    authDomain: "instagram-clone-react-f655f.firebaseapp.com",
    projectId: "instagram-clone-react-f655f",
    storageBucket: "instagram-clone-react-f655f.appspot.com",
    messagingSenderId: "284733047493",
    appId: "1:284733047493:web:a32779b3ab872bd5dea6ac",
    measurementId: "G-PBYS1HRPGK"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = getStorage(firebaseApp);

export { db, auth, storage };
// export { db, auth };