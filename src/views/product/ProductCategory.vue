<template>
    <div class="product-category">
        <div ref="resultsToolbar" class="results-toolbar">
            <span class="result-meta"
                >Showing {{ start }}–{{ end }} of {{ totalResults }} results</span
            >

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
            <article
                v-for="(product, index) in pagedProducts"
                :key="product.id"
                v-product-reveal
                class="product-card"
                :style="{
                    '--product-desktop-delay': `${(index % 4) * 85}ms`,
                    '--product-mobile-delay': `${(index % 2) * 110}ms`,
                }"
            >
                <RouterLink
                    class="product-image"
                    :to="{
                        name: 'product-detail',
                        params: {
                            category: productCategorySlug(product),
                            productId: productRouteKey(product),
                        },
                    }"
                >
                    <img
                        v-if="product.mainImageUrl"
                        :src="product.mainImageUrl"
                        :alt="product.name"
                    />
                    <div v-else class="image-placeholder" aria-hidden="true"></div>
                </RouterLink>

                <div class="product-info">
                    <h2>{{ product.name }}</h2>
                    <p>{{ product.shortDescription || 'รายละเอียดสินค้า' }}</p>

                    <div class="product-link-row">
                        <RouterLink
                            class="product-detail-btn"
                            :to="{
                                name: 'product-detail',
                                params: {
                                    category: productCategorySlug(product),
                                    productId: productRouteKey(product),
                                },
                            }"
                        >
                            ดูรายละเอียดสินค้า
                        </RouterLink>
                        <RouterLink
                            class="quote-btn"
                            :to="{ name: 'quotation', query: { productId: product.id } }"
                        >
                            ขอใบเสนอราคา
                        </RouterLink>
                    </div>
                </div>
            </article>
        </div>

        <nav
            v-if="totalPages > 1"
            class="pagination pagination--bottom"
            aria-label="Product pagination ด้านล่าง"
        >
            <button
                type="button"
                :disabled="page === 1 || isChangingPage"
                @click="goToPage(page - 1)"
            >
                ‹
            </button>
            <button
                v-for="pageNumber in visiblePages"
                :key="pageNumber"
                type="button"
                :class="{ active: page === pageNumber }"
                :disabled="isChangingPage"
                @click="goToPage(pageNumber)"
            >
                {{ pageNumber }}
            </button>
            <button
                type="button"
                :disabled="page === totalPages || isChangingPage"
                @click="goToPage(page + 1)"
            >
                ›
            </button>
        </nav>
    </div>
</template>

<script>
import { useProductStore } from '@/stores/productStore'
import { productRouteKey } from '@/utils/productSlug'

const productRevealDirective = {
    mounted(element) {
        let frameId = null
        const checkPosition = () => {
            frameId = null
            const rect = element.getBoundingClientRect()
            const revealLine = window.innerHeight * 0.88
            if (rect.top <= revealLine && rect.bottom >= 0) {
                element.classList.add('is-revealed')
                window.removeEventListener('scroll', requestCheck)
                window.removeEventListener('resize', requestCheck)
            }
        }
        const requestCheck = () => {
            if (frameId !== null) return
            frameId = window.requestAnimationFrame(checkPosition)
        }

        window.addEventListener('scroll', requestCheck, { passive: true })
        window.addEventListener('resize', requestCheck, { passive: true })
        element._productRevealCleanup = () => {
            window.removeEventListener('scroll', requestCheck)
            window.removeEventListener('resize', requestCheck)
            if (frameId !== null) window.cancelAnimationFrame(frameId)
        }
        // รอให้ Grid และรูปภาพกำหนดตำแหน่งเสร็จก่อนตรวจแถวแรก
        window.requestAnimationFrame(() => window.requestAnimationFrame(requestCheck))
    },
    unmounted(element) {
        element._productRevealCleanup?.()
    },
}

function timestampValue(value) {
    if (!value) return 0
    if (typeof value.toMillis === 'function') return value.toMillis()
    if (typeof value.seconds === 'number') return value.seconds * 1000
    return new Date(value).getTime() || 0
}

export default {
    name: 'ProductCategory',
    directives: {
        productReveal: productRevealDirective,
    },
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
            isChangingPage: false,
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
                products.sort((a, b) => timestampValue(b.createdAt) - timestampValue(a.createdAt))
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
        productRouteKey,
        productCategorySlug(product) {
            if (this.category && this.category !== 'all') return this.category
            if (Array.isArray(product.categories) && product.categories.length)
                return product.categories[0]
            return product.category || 'all'
        },
        async goToPage(pageNumber) {
            if (
                this.isChangingPage ||
                pageNumber < 1 ||
                pageNumber > this.totalPages ||
                pageNumber === this.page
            )
                return

            this.isChangingPage = true
            await this.scrollToResults()
            this.page = pageNumber
            await this.$nextTick()
            this.isChangingPage = false
        },
        scrollToResults() {
            const toolbar = this.$refs.resultsToolbar
            if (!toolbar) return Promise.resolve()

            const target = toolbar.getBoundingClientRect().top + window.scrollY - 90
            const start = window.scrollY
            const distance = target - start
            const duration = 950
            const startedAt = performance.now()
            const easeInOut = (progress) =>
                progress < 0.5
                    ? 4 * progress * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2

            return new Promise((resolve) => {
                const animate = (now) => {
                    const progress = Math.min((now - startedAt) / duration, 1)
                    window.scrollTo(0, start + distance * easeInOut(progress))
                    if (progress < 1) {
                        window.requestAnimationFrame(animate)
                    } else {
                        resolve()
                    }
                }
                window.requestAnimationFrame(animate)
            })
        },
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
    --product-reveal-delay: var(--product-desktop-delay, 0ms);
    opacity: 0;
    transform: translateY(34px) scale(0.97);
    transition:
        opacity 0.72s cubic-bezier(0.22, 1, 0.36, 1) var(--product-reveal-delay, 0ms),
        transform 0.72s cubic-bezier(0.22, 1, 0.36, 1) var(--product-reveal-delay, 0ms),
        box-shadow 0.2s ease;
}

.product-card.is-revealed {
    opacity: 1;
    transform: translateY(0) scale(1);
}

.product-image {
    align-items: center;
    aspect-ratio: 1 / 1;
    background: #fff;
    box-sizing: border-box;
    display: flex;
    height: auto;
    justify-content: center;
    overflow: hidden;
    padding-top: 12px;
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
    border-top: 1px solid #d9dddf;
    display: flex;
    flex-direction: column;
    gap: 7px;
    margin-top: auto;
    padding-top: 12px;
}

.product-detail-btn,
.quote-btn {
    align-items: center;
    border-radius: 6px;
    display: flex;
    justify-content: center;
    min-height: 32px;
    padding: 6px 8px;
    text-align: center;
    text-decoration: none;
    transition:
        background 0.18s ease,
        border-color 0.18s ease,
        color 0.18s ease;
    width: 100%;
}

.product-detail-btn {
    border: 1px solid #a0805b;
    color: #a0805b;
    font-size: 0.72rem;
}

.product-detail-btn:hover {
    background: #f5f6f7;
    color: #896b49;
}

.quote-btn {
    background: #a38c67;
    border: 0;
    color: #fff;
    cursor: pointer;
    font-family: inherit;
    font-size: 0.72rem;
}

.quote-btn:hover {
    background: #896b49;
    color: #fff;
}

.pagination {
    align-items: center;
    display: flex;
    gap: 5px;
    justify-content: center;
}

.pagination--bottom {
    margin: 54px 0 0;
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
    background: #a38c67;
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
    .product-card {
        --product-reveal-delay: var(--product-mobile-delay, 0ms);
    }
    .results-toolbar {
        background: #fff;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(35, 39, 45, 0.07);
        gap: 10px;
        margin-bottom: 20px;
        padding: 12px 14px;
    }

    .result-meta {
        border-bottom: 1px solid #eceeef;
        padding-bottom: 9px;
        width: 100%;
    }

    .product-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .product-image {
        height: auto;
    }

    .toolbar-controls {
        align-items: center;
        flex-direction: row;
        gap: 10px;
        justify-content: space-between;
    }

    .per-page-control {
        flex-shrink: 0;
        gap: 9px;
        white-space: nowrap;
    }

    .toolbar-controls select {
        background: #f5f6f7;
        border: 1px solid #dfe2e4;
        border-radius: 6px;
        max-width: 145px;
        min-width: 0;
        padding: 7px 8px;
        width: 100%;
    }
}

@media (max-width: 420px) {
    .results-toolbar {
        padding-left: 11px;
        padding-right: 11px;
    }

    .per-page-control {
        gap: 7px;
    }

    .toolbar-controls select {
        max-width: 132px;
    }
}
</style>
