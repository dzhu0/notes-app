import { initializeApp } from "firebase/app"
import { getFirestore, collection } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyDMtYqUkrSIKQzRFVUSFgs2Cfi0yaSL4GM",
    authDomain: "playground-e3130.firebaseapp.com",
    databaseURL: "https://playground-e3130-default-rtdb.firebaseio.com",
    projectId: "playground-e3130",
    storageBucket: "playground-e3130.appspot.com",
    messagingSenderId: "263132073559",
    appId: "1:263132073559:web:be8041d09d69577b23dd12"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
export const notesApp = collection(db, "notes-app")
