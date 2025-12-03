import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

import Home from '@/views/Home.vue'
import ProductLayout from '@/views/product/ProductLayout.vue'
import ProductCategory from '@/views/product/ProductCategory.vue'
import ProductDetail from '@/views/product/ProductDetail.vue'

import AdminLogin from '@/views/admin/AdminLogin.vue'
import AdminHome from '@/views/admin/AdminHome.vue'

const routes = [
    {
        path: '/admin/login',
        name: 'admin-login',
        component: AdminLogin,
    },
    {
        path: '/admin',
        name: 'admin-home',
        component: AdminHome,
        meta: { requiresAdmin: true },
    },
    {
        path: '/',
        name: 'home',
        component: Home,
    },
    {
        path: '/product/:category/:productId',
        name: 'product-detail',
        component: ProductDetail,
        props: true,
    },
    {
        path: '/product',
        component: ProductLayout,
        children: [
            {
                path: '',
                name: 'product-all',
                component: ProductCategory,
                props: { category: 'all' },
            },
            {
                path: ':category',
                name: 'product-category',
                component: ProductCategory,
                props: true,
            },
        ],
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior() {
        return { top: 0 }
    },
})

router.beforeEach(async (to) => {
    const auth = useAuthStore()

    // เรียก initAuth ครั้งแรกตอนเริ่มแอป
    if (!auth._init) {
        auth.initAuth()
        auth._init = true
    }

    if (to.meta.requiresAdmin) {
        if (!auth.isLoggedIn) {
            return '/admin/login'
        }

        if (!auth.isAdmin) {
            return '/admin/login?error=admin-only'
        }
    }
})

export default router
