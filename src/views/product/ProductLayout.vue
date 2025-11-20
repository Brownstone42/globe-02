<template>
    <section class="product-page">
        <!-- Hero / Banner -->
        <div class="hero">
            <!-- ภาพมือ + ข้อความ -->
            <div class="hero-image"></div>
            <div class="hero-text">
                <h1>ถุงมือใช้แล้วทิ้ง ลาเท็กซ์ ไร้แป้ง</h1>
                <p>สินค้าพร้อมส่ง ไม่ต้องรอ จำนวนจำกัด</p>
            </div>
        </div>

        <div class="container is-max-desktop product-body">
            <div class="columns">
                <!-- Sidebar Category -->
                <div class="column is-3 sidebar">
                    <h2 class="sidebar-title">สินค้าของเรา</h2>

                    <ul class="category-list">
                        <li v-for="cat in categories" :key="cat.slug">
                            <RouterLink
                                :to="{ name: 'product-category', params: { category: cat.slug } }"
                                :class="[
                                    'category-link',
                                    { 'is-active': cat.slug === $route.params.category },
                                ]"
                            >
                                {{ cat.label }}
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
export default {
    name: 'ProductLayout',
    data() {
        return {
            categories: [
                { slug: 'glove', label: 'ถุงมือ' },
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

/* hero, sidebar, etc. ปรับให้ resemble ดีไซน์ของเว็บจริง */
</style>
