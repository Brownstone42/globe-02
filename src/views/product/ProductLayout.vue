<template>
    <section class="product-page">
        <div class="container is-max-desktop product-body">
            <div class="columns mt-6">
                <!-- Sidebar Category -->
                <div class="column is-3 sidebar">
                    <h2 class="sidebar-title">สินค้าของเรา</h2>

                    <!-- สินค้าทั้งหมด -->
                    <div class="mb-2">
                        <RouterLink
                            :to="{ name: 'product-all' }"
                            :class="[
                                'category-link',
                                { 'is-active': $route.name === 'product-all' },
                            ]"
                        >
                            สินค้าทั้งหมด
                        </RouterLink>
                    </div>

                    <!-- หมวดหมู่จาก Firebase (ผ่าน Pinia) -->
                    <ul class="category-list mt-4">
                        <li v-for="cat in sortedCategories" :key="cat.slug">
                            <RouterLink
                                :to="{
                                    name: 'product-category',
                                    params: { category: cat.slug },
                                }"
                                :class="[
                                    'category-link',
                                    { 'is-active': cat.slug === $route.params.category },
                                ]"
                            >
                                {{ cat.name }}
                            </RouterLink>
                        </li>
                    </ul>
                </div>

                <!-- Main content: list หรือ detail -->
                <div class="column is-9">
                    <RouterView />
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { mapStores } from 'pinia'
import { useCategoryStore } from '@/stores/categoryStore'

export default {
    name: 'ProductLayout',

    computed: {
        // จะได้ this.categoryStore
        ...mapStores(useCategoryStore),

        // ใช้ category จาก Pinia แทน data แบบเดิม
        sortedCategories() {
            // ถ้าใน store มี getter ที่ชื่อ sortedCategories ก็ใช้เลย
            // ถ้าไม่มี จะเปลี่ยนเป็น this.categoryStore.categories แทน
            return this.categoryStore.sortedCategories
        },
    },

    created() {
        if (!this.categoryStore.categories?.length && !this.categoryStore.loading) {
            this.categoryStore.loadCategories()
        }
    },
}
</script>

<style scoped>
.product-page {
    background: #f7f7f7;
}
.sidebar-title {
    font-size: 20pt;
    color: #3ca9ac;
}
a {
    color: #3d3b3b;
}
li {
    position: relative;
    margin-bottom: 8px;
    padding-left: 15px;
}
.category-list > li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 7px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: radial-gradient(circle, #3ca9ac 0%, #3ca9ac 60%, #3ca9ac 100%);
}
.subcategory-list > li > a {
    color: #3ca9ac;
}
@media (max-width: 768px) {
    .sidebar {
        padding-left: 50px;
    }
}
</style>
