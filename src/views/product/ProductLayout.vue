<template>
    <section class="product-page">
        <!-- Hero / Banner 
        <div class="hero">
            <div class="hero-image"></div>
            <div class="hero-text">
                <h1>ถุงมือใช้แล้วทิ้ง ลาเท็กซ์ ไร้แป้ง</h1>
                <p>สินค้าพร้อมส่ง ไม่ต้องรอ จำนวนจำกัด</p>
            </div>
        </div> -->

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

                    <ul class="category-list mt-4">
                        <li v-for="cat in categories" :key="cat.slug">
                            <!-- เมนูหลัก -->
                            <RouterLink
                                :to="{ name: 'product-category', params: { category: cat.slug } }"
                                :class="[
                                    'category-link',
                                    { 'is-active': cat.slug === $route.params.category },
                                ]"
                            >
                                {{ cat.label }}
                            </RouterLink>

                            <!-- เมนูย่อย (เฉพาะหมวดที่มี children เช่น ถุงมือ) -->
                            <ul
                                v-if="cat.children && cat.slug === $route.params.category"
                                class="subcategory-list"
                            >
                                <li v-for="sub in cat.children" :key="sub.key">
                                    <RouterLink
                                        :to="{
                                            name: 'product-category',
                                            params: { category: cat.slug },
                                            query: { sub: sub.key }, // ส่ง query ไปกรอง
                                        }"
                                        :class="[
                                            'subcategory-link',
                                            { 'is-active': sub.key === $route.query.sub },
                                        ]"
                                    >
                                        {{ sub.label }}
                                    </RouterLink>
                                </li>
                            </ul>
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
export default {
    name: 'ProductLayout',
    data() {
        return {
            categories: [
                {
                    slug: 'glove',
                    label: 'ถุงมือ',
                    children: [
                        { key: 'disposable', label: 'ถุงมือใช้แล้วทิ้ง' },
                        { key: 'special', label: 'ถุงมือเฉพาะทาง' },
                    ],
                },
                { slug: 'coverall', label: 'ชุดคลุมป้องกัน' },
                { slug: 'mask', label: 'หน้ากากอนามัย' },
                { slug: 'esd', label: 'ผลิตภัณฑ์ ESD' },
                // เพิ่มได้ตามจริง
            ],
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
</style>
