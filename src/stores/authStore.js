import { defineStore } from 'pinia'
import { auth } from '@/firebase'
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth'

// Resolves once Firebase has restored (or ruled out) a persisted session.
let authReady = null

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        adminEmails: ['anawatbooch@gmail.com', 'nupavee.t@gmail.com'],
    }),

    getters: {
        isLoggedIn: (state) => !!state.user,
        isAdmin: (state) => {
            if (!state.user) return false
            return state.adminEmails.includes(state.user.email)
        },
    },

    actions: {
        initAuth() {
            if (!authReady) {
                authReady = new Promise((resolve) => {
                    onAuthStateChanged(auth, (user) => {
                        this.user = user || null
                        resolve()
                    })
                })
            }
            return authReady
        },

        async loginWithGoogle() {
            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth, provider)
            this.user = result.user
        },

        async logout() {
            await signOut(auth)
        },
    },
})
