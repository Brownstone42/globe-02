import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/views/Home.vue'
import ProductLayout from '@/views/product/ProductLayout.vue'
import ProductCategory from '@/views/product/ProductCategory.vue'

const routes = [
    {
        path: '/',
        component: Home,
    },
    {
        path: '/product',
        component: ProductLayout,
        children: [
            {
                path: '',
                redirect: { name: 'product-category', params: { category: 'glove' } },
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

export default router
