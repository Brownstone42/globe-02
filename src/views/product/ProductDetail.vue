<template>
    <section class="product-detail-page">
        <div class="container is-max-desktop">
            <!-- Breadcrumb -->
            <nav class="breadcrumb mt-4" aria-label="breadcrumbs">
                <ul>
                    <li>
                        <RouterLink to="/">หน้าแรก</RouterLink>
                    </li>
                    <li>
                        <RouterLink :to="{ name: 'product-all' }"> ผลิตภัณฑ์ </RouterLink>
                    </li>
                    <li>
                        <RouterLink
                            :to="{
                                name: 'product-category',
                                params: { category: product?.category || category },
                            }"
                        >
                            {{ categoryLabel }}
                        </RouterLink>
                    </li>
                    <li class="is-active">
                        <a aria-current="page">{{ product?.name || 'สินค้า' }}</a>
                    </li>
                </ul>
            </nav>

            <!-- กำลังโหลด -->
            <div v-if="productStore.loading" class="mt-6 mb-6">กำลังโหลดข้อมูลสินค้า...</div>

            <!-- ถ้าไม่พบสินค้า (และไม่ได้กำลังโหลด) -->
            <div v-else-if="!product" class="mt-6 mb-6">ไม่พบสินค้า</div>

            <!-- เจอสินค้า -->
            <div v-else class="mt-4">
                <!-- 1. รูป + carousel + detail -->
                <ProductMain
                    :product="product"
                    :category-label="categoryLabel"
                    :current-image="currentImage"
                    :selected-image-index="selectedImageIndex"
                    @update:selected-image-index="selectedImageIndex = $event"
                />

                <!-- 2. แท็บรายละเอียด -->
                <ProductTabs class="mt-6" v-model:activeTab="activeTab" />

                <!-- 3. สินค้าในหมวดเดียวกัน -->
                <RelatedProducts
                    v-if="relatedProducts.length"
                    class="mt-6 mb-6"
                    :items="relatedProducts"
                />
            </div>
        </div>
    </section>
</template>

<script>
import { useProductStore } from '@/stores/productStore'
import { useCategoryStore } from '@/stores/categoryStore'
import ProductMain from '@/components/product/ProductMain.vue'
import ProductTabs from '@/components/product/ProductTabs.vue'
import RelatedProducts from '@/components/product/RelatedProducts.vue'

export default {
    name: 'ProductDetail',
    components: {
        ProductMain,
        ProductTabs,
        RelatedProducts,
    },
    props: {
        category: {
            type: String,
            required: true,
        },
        productId: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            selectedImageIndex: 0,
            activeTab: 'feature', // default = คุณสมบัติ
        }
    },
    computed: {
        productStore() {
            return useProductStore()
        },
        categoryStore() {
            return useCategoryStore()
        },

        // ดึง product จาก store ตาม productId
        product() {
            return this.productStore.products.find((item) => item.id === this.productId) || null
        },

        // หา label ของ category จาก categoryStore (อิง slug)
        categoryLabel() {
            const slug = this.product ? this.product.category : this.category

            const categories = this.categoryStore.sortedCategories || []
            const found = categories.find((cat) => cat.slug === slug)

            return found ? found.name : 'สินค้า'
        },

        // รวม mainImage + gallery เข้ามาเป็น array เดียว ใช้กับ currentImage
        imageList() {
            if (!this.product) return []

            const list = []
            if (this.product.mainImageUrl) {
                list.push(this.product.mainImageUrl)
            }
            if (
                Array.isArray(this.product.galleryImageUrls) &&
                this.product.galleryImageUrls.length
            ) {
                list.push(...this.product.galleryImageUrls)
            }
            return list
        },

        currentImage() {
            if (!this.imageList.length) return ''
            return this.imageList[this.selectedImageIndex] || this.imageList[0]
        },

        // สินค้าในหมวดเดียวกัน (ไม่รวมตัวเอง)
        relatedProducts() {
            if (!this.product) return []
            const sameCategory = this.productStore.productsByCategory(this.product.category) || []

            return sameCategory.filter((item) => item.id !== this.product.id).slice(0, 4) // จะปรับจำนวนทีหลังก็ได้
        },
    },
    async mounted() {
        // โหลด products ถ้ายังไม่มีใน store
        if (!this.productStore.products.length) {
            await this.productStore.fetchProducts()
        }

        // โหลด categories ถ้ายังไม่มี
        if (!this.categoryStore.categories || !this.categoryStore.categories.length) {
            await this.categoryStore.loadCategories()
        }
    },
    watch: {
        productId() {
            // เวลาเปลี่ยน product (เช่น จาก relatedProducts) ให้ reset state
            this.selectedImageIndex = 0
            this.activeTab = 'feature'
        },
    },
}
</script>

<style scoped>
.product-detail-page {
    background: #f7f7f7;
    padding-bottom: 3rem;
}
</style>
