<template>
    <section class="section">
        <h1 class="title">Admin Panel</h1>
        <p class="subtitle">Welcome, {{ userEmail }}</p>

        <button class="button is-danger" @click="logout">Logout</button>

        <br /><br />
        <RouterLink to="/">กลับหน้าแรก</RouterLink>
    </section>
</template>

<script>
import { useAuthStore } from '@/stores/authStore'

export default {
    computed: {
        auth() {
            return useAuthStore()
        },
        userEmail() {
            return this.auth.user ? this.auth.user.email : ''
        },
    },
    methods: {
        logout() {
            this.auth.logout()
            this.$router.push('/admin/login')
        },
    },
}
</script>
