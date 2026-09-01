// src/firebase.js
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { firebaseConfig } from './firebaseConfig'

// Start Firebase
const app = initializeApp(firebaseConfig)

// Firestore
const db = getFirestore(app)

// Auth
const auth = getAuth(app)

// ❗ EXPORT แบบ named exports
export { app, db, auth }
