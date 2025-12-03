import { defineStore } from 'pinia'
import { auth } from '@/firebase'
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth'

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
            onAuthStateChanged(auth, (user) => {
                this.user = user || null
            })
        },

        async loginWithGoogle() {
            const provider = new GoogleAuthProvider()
            await signInWithPopup(auth, provider)
        },

        async logout() {
            await signOut(auth)
        },
    },
})
