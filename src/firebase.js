// src/firebase.js
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: 'AIzaSyA-59Hd3cwKU-IArkorrybzk-bmpCNqAJc',
    authDomain: 'ideal-globe-website.firebaseapp.com',
    projectId: 'ideal-globe-website',
    storageBucket: 'ideal-globe-website.firebasestorage.app',
    messagingSenderId: '1003894705965',
    appId: '1:1003894705965:web:b08d4eadec663f9ff7cda4',
}

const app = initializeApp(firebaseConfig)

// เตรียม auth ให้ใช้งาน
export const auth = getAuth(app)

export default app
