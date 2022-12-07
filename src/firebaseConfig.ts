import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getDatabase } from 'firebase/database'

export const firebaseApp = initializeApp({
  apiKey: "AIzaSyBXxdMl9s0wU35QgzNQoxMKePyc-AeUnGg",
  authDomain: "spice-wars-test.firebaseapp.com",
  projectId: "spice-wars-test",
  storageBucket: "spice-wars-test.appspot.com",
  messagingSenderId: "380151851671",
  appId: "1:380151851671:web:1b3f60f740eb13487897d2",
  measurementId: "G-40MTPN597E"
})
export const database = getDatabase(firebaseApp)
export const firestore = getFirestore(firebaseApp)
