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

            <button
                class="admin-menu-item"
                :class="{ active: currentModule === 'product' }"
                @click="currentModule = 'product'"
            >
                Product Management
            </button>

            <button
                class="admin-menu-item"
                :class="{ active: currentModule === 'news' }"
                @click="currentModule = 'news'"
            >
                News Management
            </button>

            <button
                class="admin-menu-item"
                :class="{ active: currentModule === 'banner' }"
                @click="currentModule = 'banner'"
            >
                Banner Management
            </button>

            <button
                class="admin-menu-item"
                :class="{ active: currentModule === 'sales' }"
                @click="currentModule = 'sales'"
            >
                Sales Management
            </button>
        </aside>

        <main class="admin-content">
            <category-management v-if="currentModule === 'category'"></category-management>
            <product-management v-else-if="currentModule === 'product'"></product-management>
            <news-management v-else-if="currentModule === 'news'"></news-management>
            <banner-management v-else-if="currentModule === 'banner'"></banner-management>
            <sales-management v-else-if="currentModule === 'sales'"></sales-management>

            <div v-else class="placeholder">Select a module from the left menu.</div>
        </main>
    </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore'
import { useProductStore } from '@/stores/productStore'
import CategoryManagement from '@/components/admin/categoryManagement.vue'
import ProductManagement from '@/components/admin/productManagement.vue'
import NewsManagement from '@/components/admin/newsManagement.vue'
import BannerManagement from '@/components/admin/bannerManagement.vue'
import SalesManagement from '@/components/admin/salesManagement.vue'

export default {
    name: 'AdminHome',
    components: {
        CategoryManagement,
        ProductManagement,
        NewsManagement,
        BannerManagement,
        SalesManagement,
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
    async mounted() {
        const products = useProductStore()
        await products.fetchProducts()
        await products.migrateProductSchema()
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
    height: calc(100vh - 100px); /* Adjust based on your header height */
    background: #f5f5f5;
    overflow: hidden;
}

.admin-sidebar {
    width: 260px;
    padding: 24px 16px;
    background: #111827;
    color: #f9fafb;
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex-shrink: 0;
}

.admin-title {
    margin-bottom: 24px;
    padding-left: 12px;
    font-size: 1.25rem;
    font-weight: 700;
    color: #3b82f6;
    letter-spacing: 0.025em;
}

.admin-menu-item {
    padding: 12px 16px;
    margin-bottom: 4px;
    border: none;
    border-radius: 8px;
    text-align: left;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    background: transparent;
    color: #9ca3af;
    transition: all 0.2s;
}

.admin-menu-item:hover:not(:disabled) {
    background: #1f2937;
    color: #f9fafb;
}

.admin-menu-item.active {
    background: #2563eb;
    color: white;
    box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
}

.admin-menu-item:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.admin-content {
    flex: 1;
    padding: 24px;
    display: flex;
    flex-direction: column;
    min-height: 0; /* Critical for children to be able to scroll internally */
    overflow: hidden;
}

.placeholder {
    color: #6b7280;
}
</style>
