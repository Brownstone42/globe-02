import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import {
    clearStructuredData,
    defaultSeo,
    organizationStructuredData,
    setSeo,
    setStructuredData,
} from '@/utils/seo'

import Home from '@/views/Home.vue'
import ProductLayout from '@/views/product/ProductLayout.vue'
import ProductCategory from '@/views/product/ProductCategory.vue'
import ProductDetail from '@/views/product/ProductDetail.vue'

import AdminLogin from '@/views/admin/AdminLogin.vue'
import AdminHome from '@/views/admin/AdminHome.vue'
import BlogList from '@/views/news/BlogList.vue'
import BlogDetail from '@/views/news/BlogDetail.vue'
import About from '@/views/About.vue'
import Contact from '@/views/Contact.vue'
import Quotation from '@/views/Quotation.vue'
import NotFound from '@/views/NotFound.vue'

const routes = [
    {
        path: '/admin/login',
        name: 'admin-login',
        component: AdminLogin,
        meta: {
            seo: {
                title: 'เข้าสู่ระบบผู้ดูแล | Ideal Globe',
                description: 'เข้าสู่ระบบสำหรับผู้ดูแลเว็บไซต์ Ideal Globe',
                robots: 'noindex, nofollow, noarchive',
            },
        },
    },
    {
        path: '/admin',
        name: 'admin-home',
        component: AdminHome,
        meta: {
            requiresAdmin: true,
            seo: {
                title: 'ระบบผู้ดูแล | Ideal Globe',
                description: 'ระบบจัดการเว็บไซต์ Ideal Globe',
                robots: 'noindex, nofollow, noarchive',
            },
        },
    },
    {
        path: '/',
        name: 'home',
        component: Home,
        meta: { seo: defaultSeo },
    },
    {
        path: '/about',
        name: 'about',
        component: About,
        meta: {
            seo: {
                title: 'เกี่ยวกับเราและประสบการณ์กว่า 30 ปี | Ideal Globe',
                description:
                    'รู้จัก Ideal Globe ผู้จัดจำหน่ายอุปกรณ์ Cleanroom, ESD, Safety และอุปกรณ์โรงงาน พร้อมบริการให้คำปรึกษาแก่ภาคอุตสาหกรรม',
            },
        },
    },
    {
        path: '/contact',
        name: 'contact',
        component: Contact,
        meta: {
            seo: {
                title: 'ติดต่อ Ideal Globe และทีมฝ่ายขาย',
                description:
                    'ติดต่อ Ideal Globe เพื่อสอบถามสินค้า Cleanroom, ESD, Safety และอุปกรณ์โรงงาน พร้อมรับคำปรึกษาจากทีมฝ่ายขาย',
            },
        },
    },
    {
        path: '/quotation',
        name: 'quotation',
        component: Quotation,
        meta: {
            seo: {
                title: 'ขอใบเสนอราคาอุปกรณ์โรงงาน',
                description:
                    'ขอใบเสนอราคาสินค้า Cleanroom, ESD, Safety และอุปกรณ์สำหรับโรงงานจาก Ideal Globe',
            },
        },
    },
    {
        path: '/blogs',
        name: 'blog-list',
        component: BlogList,
        meta: {
            seo: {
                title: 'บทความ Cleanroom, ESD และอุปกรณ์โรงงาน',
                description:
                    'บทความ ความรู้ และคำแนะนำเกี่ยวกับ Cleanroom, ESD, Safety และการเลือกใช้อุปกรณ์สำหรับโรงงานอุตสาหกรรม',
            },
        },
    },
    {
        path: '/blogs/:id',
        name: 'blog-detail',
        component: BlogDetail,
        props: true,
        meta: {
            seo: {
                title: 'บทความและข่าวสาร | Ideal Globe',
                description:
                    'บทความและข่าวสารจาก Ideal Globe เกี่ยวกับ Cleanroom, ESD, Safety และอุปกรณ์โรงงาน',
            },
        },
    },
    {
        path: '/product/:category/:productId',
        name: 'product-detail',
        component: ProductDetail,
        props: true,
        meta: {
            seo: {
                title: 'รายละเอียดสินค้า | Ideal Globe',
                description:
                    'รายละเอียดสินค้า Cleanroom, ESD, Safety และอุปกรณ์โรงงานจาก Ideal Globe',
            },
        },
    },
    {
        path: '/product',
        component: ProductLayout,
        meta: {
            seo: {
                title: 'อุปกรณ์ Cleanroom, ESD และ Safety',
                description:
                    'เลือกชมอุปกรณ์ Cleanroom, ESD, Safety และอุปกรณ์สำหรับโรงงาน พร้อมบริการให้คำปรึกษาจาก Ideal Globe',
            },
        },
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
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: NotFound,
        meta: {
            seo: {
                title: 'ไม่พบหน้าที่ต้องการ | Ideal Globe',
                description: 'ไม่พบหน้าที่คุณกำลังค้นหาบนเว็บไซต์ Ideal Globe',
                robots: 'noindex, follow, noarchive',
            },
        },
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

    // รอให้ Firebase กู้ session จาก storage ให้เสร็จก่อน ไม่งั้นจะเด้งไป login ทุกครั้งที่ refresh
    await auth.initAuth()

    if (to.meta.requiresAdmin) {
        if (!auth.isLoggedIn) {
            return '/admin/login'
        }

        if (!auth.isAdmin) {
            return '/admin/login?error=admin-only'
        }
    }
})

router.afterEach((to) => {
    clearStructuredData()
    setSeo({ ...(to.meta.seo || defaultSeo), path: to.path })
    if (to.name === 'home') {
        setStructuredData('organization', organizationStructuredData)
    }
})

export default router
