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

            <!-- ถ้าไม่พบสินค้า -->
            <div v-if="!product" class="mt-6 mb-6">ไม่พบสินค้า</div>

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

        product() {
            return this.productStore.productById(this.productId)
        },

        categoryLabel() {
            if (this.product) {
                return this.productStore.categoryMap[this.product.category] || 'สินค้า'
            }
            return this.productStore.categoryMap[this.category] || 'สินค้า'
        },

        currentImage() {
            if (!this.product) return ''
            const imgs =
                this.product.images && this.product.images.length
                    ? this.product.images
                    : [this.product.image]
            return imgs[this.selectedImageIndex] || imgs[0]
        },

        relatedProducts() {
            return this.productStore.relatedProducts(this.product)
        },
    },
    watch: {
        productId() {
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
