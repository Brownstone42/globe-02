<template>
    <div class="product-category">
        <div class="results-toolbar">
            <span class="result-meta">Showing {{ start }}–{{ end }} of {{ totalResults }} results</span>

            <div class="toolbar-controls">
                <div class="per-page-control">
                    <span>Show :</span>
                    <button
                        v-for="amount in pageSizes"
                        :key="amount"
                        type="button"
                        :class="{ active: perPage === amount }"
                        @click="setPerPage(amount)"
                    >
                        {{ amount }}
                    </button>
                </div>

                <select v-model="sortBy" aria-label="เรียงลำดับสินค้า">
                    <option value="default">Default sorting</option>
                    <option value="name-asc">Name A–Z</option>
                    <option value="name-desc">Name Z–A</option>
                    <option value="newest">Newest</option>
                </select>
            </div>
        </div>

        <div v-if="productStore.loading" class="product-status">กำลังโหลดสินค้า...</div>
        <div v-else-if="!pagedProducts.length" class="product-status">ไม่พบสินค้า</div>

        <div v-else class="product-grid">
            <article v-for="product in pagedProducts" :key="product.id" class="product-card">
                <RouterLink
                    class="product-image"
                    :to="{
                        name: 'product-detail',
                        params: { category: product.category, productId: product.id },
                    }"
                >
                    <img v-if="product.mainImageUrl" :src="product.mainImageUrl" :alt="product.name" />
                    <div v-else class="image-placeholder" aria-hidden="true"></div>
                </RouterLink>

                <div class="product-info">
                    <h2>{{ product.name }}</h2>
                    <p>{{ product.shortDescription || 'รายละเอียดสินค้า' }}</p>

                    <div class="product-link-row">
                        <RouterLink
                            :to="{
                                name: 'product-detail',
                                params: { category: product.category, productId: product.id },
                            }"
                        >
                            ดูรายละเอียดสินค้า
                        </RouterLink>
                        <RouterLink
                            class="product-arrow"
                            :to="{
                                name: 'product-detail',
                                params: { category: product.category, productId: product.id },
                            }"
                            :aria-label="`ดูรายละเอียด ${product.name}`"
                        >
                            <i class="fa-solid fa-arrow-right"></i>
                        </RouterLink>
                    </div>
                </div>
            </article>
        </div>

        <nav v-if="totalPages > 1" class="pagination" aria-label="Product pagination">
            <button type="button" :disabled="page === 1" @click="page--">‹</button>
            <button
                v-for="pageNumber in visiblePages"
                :key="pageNumber"
                type="button"
                :class="{ active: page === pageNumber }"
                @click="page = pageNumber"
            >
                {{ pageNumber }}
            </button>
            <button type="button" :disabled="page === totalPages" @click="page++">›</button>
        </nav>
    </div>
</template>

<script>
import { useProductStore } from '@/stores/productStore'

function timestampValue(value) {
    if (!value) return 0
    if (typeof value.toMillis === 'function') return value.toMillis()
    if (typeof value.seconds === 'number') return value.seconds * 1000
    return new Date(value).getTime() || 0
}

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
            perPage: 12,
            pageSizes: [12, 24, 36],
            sortBy: 'default',
        }
    },
    computed: {
        productStore() {
            return useProductStore()
        },
        baseProducts() {
            let products = [...this.productStore.productsByCategory(this.category)]
            const subcategory = this.$route.query.sub

            if (subcategory) {
                products = products.filter(
                    (product) =>
                        product.subcategory === subcategory ||
                        product.subcategoryId === subcategory ||
                        product.group === subcategory,
                )
            }

            if (this.sortBy === 'name-asc') {
                products.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
            } else if (this.sortBy === 'name-desc') {
                products.sort((a, b) => (b.name || '').localeCompare(a.name || ''))
            } else if (this.sortBy === 'newest') {
                products.sort(
                    (a, b) => timestampValue(b.createdAt) - timestampValue(a.createdAt),
                )
            }

            return products
        },
        totalResults() {
            return this.baseProducts.length
        },
        totalPages() {
            return Math.max(1, Math.ceil(this.totalResults / this.perPage))
        },
        start() {
            return this.totalResults ? (this.page - 1) * this.perPage + 1 : 0
        },
        end() {
            return Math.min(this.page * this.perPage, this.totalResults)
        },
        pagedProducts() {
            return this.baseProducts.slice(this.start - 1, this.end)
        },
        visiblePages() {
            const pages = []
            const first = Math.max(1, Math.min(this.page - 1, this.totalPages - 2))
            const last = Math.min(this.totalPages, first + 2)
            for (let number = first; number <= last; number++) pages.push(number)
            return pages
        },
    },
    mounted() {
        if (!this.productStore.products.length) {
            this.productStore.fetchProducts()
        }
    },
    watch: {
        category() {
            this.page = 1
        },
        '$route.query.sub'() {
            this.page = 1
        },
        sortBy() {
            this.page = 1
        },
        totalPages(value) {
            if (this.page > value) this.page = value
        },
    },
    methods: {
        setPerPage(amount) {
            this.perPage = amount
            this.page = 1
        },
    },
}
</script>

<style scoped>
.results-toolbar {
    align-items: center;
    color: #555b60;
    display: flex;
    font-size: 0.85rem;
    justify-content: space-between;
    margin-bottom: 28px;
    min-height: 34px;
}

.toolbar-controls,
.per-page-control {
    align-items: center;
    display: flex;
}

.toolbar-controls {
    gap: 28px;
}

.per-page-control {
    gap: 13px;
}

.per-page-control button {
    background: transparent;
    border: 0;
    color: #52585d;
    cursor: pointer;
    font-family: inherit;
    padding: 3px 1px;
}

.per-page-control button.active {
    border-bottom: 2px solid #a0805b;
    color: #a0805b;
}

.toolbar-controls select {
    background: transparent;
    border: 0;
    color: #555b60;
    font-family: inherit;
    outline: none;
    padding: 5px 0;
}

.product-grid {
    display: grid;
    gap: 18px;
    grid-template-columns: repeat(4, minmax(0, 1fr));
}

.product-card {
    background: #fff;
    border-radius: 12px 12px 30px 12px;
    display: flex;
    flex-direction: column;
    min-width: 0;
    overflow: hidden;
    padding: 0;
}

.product-image {
    align-items: center;
    background: #fff;
    display: flex;
    height: 190px;
    justify-content: center;
    overflow: hidden;
}

.product-image img {
    display: block;
    height: 100%;
    max-height: 100%;
    max-width: 100%;
    object-fit: contain;
    width: 100%;
}

.image-placeholder {
    background: linear-gradient(135deg, #f8fafc, #e5e7eb);
    height: 100%;
    width: 100%;
}

.product-info {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 9px 13px 13px;
}

.product-info h2 {
    color: #a0805b;
    display: -webkit-box;
    font-size: 0.95rem;
    font-weight: 700;
    line-height: 1.3;
    margin: 0;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
}

.product-info p {
    color: #8a9298;
    display: -webkit-box;
    font-size: 0.7rem;
    line-height: 1.35;
    margin: 3px 0 9px;
    min-height: 1.35em;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
}

.product-link-row {
    align-items: center;
    border-top: 1px solid #d9dddf;
    display: flex;
    justify-content: space-between;
    margin-top: auto;
    padding-top: 12px;
}

.product-link-row > a:first-child {
    color: #a0805b;
    font-size: 0.67rem;
    text-decoration: none;
}

.product-arrow {
    align-items: center;
    background: #a0805b;
    border-radius: 50%;
    color: #fff;
    display: inline-flex;
    flex: 0 0 27px;
    height: 27px;
    justify-content: center;
    text-decoration: none;
    width: 27px;
}

.product-arrow i {
    font-size: 0.7rem;
}

.pagination {
    align-items: center;
    display: flex;
    gap: 5px;
    justify-content: center;
    margin-top: 70px;
}

.pagination button {
    background: transparent;
    border: 0;
    color: #51575c;
    cursor: pointer;
    font-family: inherit;
    height: 30px;
    min-width: 30px;
}

.pagination button.active {
    background: #a0805b;
    color: #fff;
}

.pagination button:disabled {
    cursor: not-allowed;
    opacity: 0.35;
}

.product-status {
    color: #64748b;
    padding: 80px 0;
    text-align: center;
}

@media (max-width: 800px) {
    .results-toolbar {
        align-items: flex-start;
        flex-direction: column;
        gap: 13px;
    }

    .toolbar-controls {
        justify-content: space-between;
        width: 100%;
    }
}

@media (max-width: 650px) {
    .product-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .product-image {
        height: 150px;
    }

    .toolbar-controls {
        align-items: flex-start;
        flex-direction: column;
        gap: 12px;
    }
}

@media (max-width: 420px) {
    .product-grid {
        grid-template-columns: 1fr;
    }
}
</style>
