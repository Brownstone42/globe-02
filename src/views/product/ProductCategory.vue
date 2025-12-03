<template>
    <div class="product-category">
        <!-- Header + sorting / pagination -->
        <div class="category-header">
            <div class="meta">
                <span>Showing {{ start }}–{{ end }} of {{ products.length }} results</span>
                <!-- ที่เหลือ เช่น Show 10 / 20 / 40, Sorting ไว้ใส่ทีหลังได้ -->
            </div>
        </div>

        <!-- Product grid -->
        <div class="columns is-multiline mt-4">
            <div v-for="product in pagedProducts" :key="product.id" class="column is-4">
                <div class="product-card">
                    <RouterLink
                        :to="{
                            name: 'product-detail',
                            params: { category: product.category, productId: product.id },
                        }"
                    >
                        <figure class="image is-square">
                            <img :src="product.image" :alt="product.name" />
                        </figure>
                        <div class="product-info">
                            <h3>{{ product.name }}</h3>
                            <p class="subtitle is-7">{{ product.shortDescription }}</p>
                            <span class="link-more">ดูรายละเอียดสินค้า</span>
                        </div>
                    </RouterLink>
                </div>
            </div>
        </div>

        <!-- Pagination (mock) -->
        <nav class="pagination is-centered" role="navigation">
            <a class="pagination-previous" :disabled="page === 1" @click="page--"> ‹ </a>
            <a class="pagination-next" :disabled="end >= products.length" @click="page++"> › </a>
        </nav>
    </div>
</template>

<script>
import { useProductStore } from '@/stores/productStore'

export default {
    name: 'ProductCategory',
    props: {
        category: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            page: 1,
            perPage: 9,
        }
    },
    computed: {
        // เอา store มาใช้ใน options API แบบง่าย ๆ
        productStore() {
            return useProductStore()
        },

        // ใช้ categoryMap กลาง
        categoryMap() {
            return this.productStore.categoryMap
        },

        // เมนูย่อย เช่น /product/glove?sub=disposable
        currentSub() {
            return this.$route.query.sub || null
        },

        // สินค้าพื้นฐานก่อนแบ่งหน้า
        baseProducts() {
            // ใช้ getter จาก store
            return this.productStore.productsByCategory(this.category)
        },

        // สินค้าที่ถูกกรองด้วยเมนูย่อย (ตอนนี้ใช้กับถุงมือ)
        products() {
            // ถ้าเป็นหน้า "สินค้าทั้งหมด" ไม่ต้องสนใจ sub
            if (this.category === 'all') {
                return this.baseProducts
            }

            // ถ้าไม่มี sub (ไม่ได้คลิกเมนูย่อย) → ใช้ baseProducts ตามหมวด
            if (!this.currentSub) {
                return this.baseProducts
            }

            // มี sub เช่น disposable / special → กรองเพิ่มจาก field group
            return this.baseProducts.filter((p) => p.group === this.currentSub)
        },

        // จำนวนสินค้าหลังกรองเสร็จ
        totalResults() {
            return this.products.length
        },

        // ชื่อหัวข้อหมวดที่จะแสดงบนหน้า
        currentCategoryLabel() {
            return this.categoryMap[this.category] || 'สินค้า'
        },

        // index เริ่มต้น/สุดท้ายสำหรับ "Showing x–y of z results"
        start() {
            if (this.totalResults === 0) return 0
            return (this.page - 1) * this.perPage + 1
        },
        end() {
            if (this.totalResults === 0) return 0
            return Math.min(this.page * this.perPage, this.totalResults)
        },

        // array สินค้าที่ใช้ render จริง
        pagedProducts() {
            if (this.totalResults === 0) return []
            return this.products.slice(this.start - 1, this.end)
        },
    },
    watch: {
        category() {
            this.page = 1
        },
        '$route.query.sub'() {
            this.page = 1
        },
    },
}
</script>

<style scoped>
.pagination {
    margin-top: 2rem;
    margin-bottom: 6rem;
}
.product-card {
    background-color: white;
    padding: 10px;
    border-radius: 10px;
    border-bottom-right-radius: 40px;
}
</style>
