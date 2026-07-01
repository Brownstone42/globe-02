<template>
    <div class="product-category">
        <!-- Header + pagination controls on one row -->
        <div class="category-header">
            <button class="page-btn" :disabled="page === 1" @click="page--">‹</button>
            <span class="meta">Showing {{ start }}–{{ end }} of {{ baseProducts.length }} results</span>
            <button class="page-btn" :disabled="end >= baseProducts.length" @click="page++">›</button>
        </div>

        <!-- Product grid -->
        <div class="columns is-multiline mt-4 mb-8">
            <div v-for="product in pagedProducts" :key="product.id" class="column is-4">
                <div class="product-card">
                    <RouterLink
                        :to="{
                            name: 'product-detail',
                            params: { category: product.category, productId: product.id },
                        }"
                    >
                        <figure class="image is-square">
                            <img :src="product.mainImageUrl" :alt="product.name" />
                        </figure>
                        <div class="product-info pt-1">
                            <div class="product-text">
                                <h3>{{ product.name }}</h3>
                                <p class="short-desc">{{ product.shortDescription }}</p>
                            </div>
                            <hr class="desc-divider" />
                            <div class="product-footer">
                                <span class="link-more">ดูรายละเอียดสินค้า</span>
                                <img class="card-arrow" src="/images/example/button.png" alt="" />
                            </div>
                        </div>
                    </RouterLink>
                </div>
            </div>
        </div>
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
    mounted() {
        // ถ้ายังไม่มี products เลย → โหลดจาก Firestore
        if (!this.productStore.products.length) {
            this.productStore.fetchProducts()
        }
    },
    computed: {
        // เอา store มาใช้ใน options API แบบง่าย ๆ
        productStore() {
            return useProductStore()
        },

        // สินค้าพื้นฐานก่อนแบ่งหน้า
        baseProducts() {
            // ใช้ getter จาก store
            return this.productStore.productsByCategory(this.category)
        },

        // จำนวนสินค้าหลังกรองเสร็จ
        totalResults() {
            return this.baseProducts.length
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
            return this.baseProducts.slice(this.start - 1, this.end)
        },
    },
    watch: {
        category() {
            this.page = 1
        },
        '$route.query.sub'() {
            this.page = 1
        },
        totalResults() {
            this.page = 1
        },
    },
}
</script>

<style scoped>
.category-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
}
.meta {
    font-size: 0.9rem;
    color: #6b7280;
}
.page-btn {
    background: white;
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    font-size: 1.4rem;
    line-height: 1;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    color: #333;
    display: flex;
    align-items: center;
    justify-content: center;
}
.page-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}
.product-card {
    background-color: white;
    padding: 10px;
    border-radius: 10px;
    border-bottom-right-radius: 40px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}
.product-card a {
    display: flex;
    flex-direction: column;
    flex: 1;
}
.product-info {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 0.25rem 0.25rem 0.5rem;
}
.product-text {
    min-height: 6.5rem;
}
.product-info h3 {
    font-size: 1.05rem;
    font-weight: 700;
    color: #1a5c3a;
    margin-bottom: 0.3rem;
}
.short-desc {
    font-size: 0.82rem;
    color: #6b7280;
    margin-bottom: 0.6rem;
    line-height: 1.4;
}
.desc-divider {
    border: none;
    border-top: 1px solid #e2e8f0;
    margin: 0 0 0.6rem;
}
.product-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.link-more {
    font-size: 0.82rem;
    color: #1ab9b4;
    font-weight: 500;
}
.card-arrow {
    width: 35px;
    height: 35px;
    flex-shrink: 0;
}
.mb-8 {
    margin-bottom: 5rem !important;
}
@media (max-width: 768px) {
    .product-card {
        width: 80%;
        margin: auto;
    }
    .category-header {
        text-align: center;
    }
}
</style>
