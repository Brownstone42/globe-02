<template>
    <section class="section has-text-centered">
        <h1 class="title">Admin Login</h1>

        <div v-if="error" class="notification is-danger is-light">
            {{ error }}
        </div>

        <button class="button is-primary" @click="loginGoogle">Login with Google</button>

        <br /><br />
        <RouterLink to="/">กลับหน้าแรก</RouterLink>
    </section>
</template>

<script>
import { useAuthStore } from '@/stores/authStore'

export default {
    computed: {
        error() {
            if (this.$route.query.error === 'admin-only') {
                return 'This page is for admins only.'
            }
            return null
        },
    },
    methods: {
        async loginGoogle() {
            const auth = useAuthStore()
            try {
                await auth.loginWithGoogle()

                if (auth.isAdmin) {
                    this.$router.push('/admin')
                } else {
                    alert('You are not an admin.')
                    this.$router.push('/admin/login?error=admin-only')
                }
            } catch (e) {
                alert('Login failed: ' + e.message)
            }
        },
    },
}
</script>
