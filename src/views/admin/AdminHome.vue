<template>
    <div class="admin-layout">
        <aside class="admin-sidebar">
            <h2 class="admin-title">Admin Panel</h2>

            <button
                class="admin-menu-item"
                :class="{ active: currentModule === 'category' }"
                @click="currentModule = 'category'"
            >
                Category Management
            </button>

            <button class="admin-menu-item" disabled>Product Management (coming soon)</button>

            <button class="admin-menu-item" disabled>News Management (coming soon)</button>

            <button class="admin-menu-item" disabled>Banner Management (coming soon)</button>
        </aside>

        <main class="admin-content">
            <category-management v-if="currentModule === 'category'"></category-management>

            <div v-else class="placeholder">Select a module from the left menu.</div>
        </main>
    </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore'
import CategoryManagement from '@/components/admin/categoryManagement.vue'

export default {
    name: 'AdminHome',
    components: {
        CategoryManagement,
    },
    data() {
        return {
            currentModule: 'category',
        }
    },
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

<style scoped>
.admin-layout {
    display: flex;
    min-height: calc(100vh - 80px); /* เผื่อมี header ด้านบน */
    background: #f5f5f5;
}

.admin-sidebar {
    width: 240px;
    padding: 16px;
    background: #111827;
    color: #f9fafb;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.admin-title {
    margin-bottom: 16px;
    font-size: 1.2rem;
    font-weight: 600;
}

.admin-menu-item {
    padding: 8px 12px;
    margin-bottom: 4px;
    border: none;
    border-radius: 6px;
    text-align: left;
    font-size: 0.9rem;
    cursor: pointer;
    background: transparent;
    color: #e5e7eb;
}

.admin-menu-item:hover:not(:disabled) {
    background: #1f2933;
}

.admin-menu-item.active {
    background: #2563eb;
    color: white;
}

.admin-menu-item:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.admin-content {
    flex: 1;
    padding: 20px;
}

.placeholder {
    color: #6b7280;
}
</style>
