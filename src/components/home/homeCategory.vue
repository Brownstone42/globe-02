<template>
    <section class="category-section" aria-labelledby="category-heading">
        <h2 id="category-heading">เลือกสินค้าจากหมวดหมู่</h2>

        <div v-if="categoryStore.loading" class="category-status">กำลังโหลดหมวดหมู่...</div>

        <div v-else class="category-grid">
            <article
                v-for="item in categoryStore.visibleCategories"
                :key="item.id"
                class="category-card"
            >
                <div class="category-image">
                    <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.name || ''" />
                    <div v-else class="image-placeholder" aria-hidden="true"></div>
                </div>

                <div class="category-info">
                    <div class="category-names">
                        <h3>{{ item.name || 'Category Name' }}</h3>
                        <p v-if="item.description">{{ item.description }}</p>
                    </div>

                    <RouterLink
                        v-if="item.slug"
                        class="category-arrow"
                        :to="{
                            name: 'product-category',
                            params: { category: item.slug },
                        }"
                        :aria-label="`ดูสินค้าในหมวดหมู่ ${item.name || ''}`"
                    >
                        <i class="fa-solid fa-arrow-right"></i>
                    </RouterLink>
                </div>
            </article>
        </div>

        <RouterLink class="all-products-link" :to="{ name: 'product-all' }">
            สินค้าทั้งหมด
        </RouterLink>
    </section>
</template>

<script>
import { mapStores } from 'pinia'
import { useCategoryStore } from '@/stores/categoryStore'

export default {
    name: 'homeCategory',
    computed: {
        ...mapStores(useCategoryStore),
    },
    mounted() {
        if (!this.categoryStore.categories.length) {
            this.categoryStore.loadCategories()
        }
    },
}
</script>

<style scoped>
.category-section {
    margin: 0 auto;
    padding: 70px 0 80px;
    width: min(1180px, 90vw);
}

.category-section h2 {
    color: #205266;
    font-size: clamp(1.45rem, 2.2vw, 2rem);
    font-weight: 700;
    margin: 0 0 32px;
    text-align: center;
}

.category-grid {
    display: grid;
    gap: 22px;
    grid-template-columns: repeat(4, minmax(0, 1fr));
}

.category-card {
    background: #fff;
    border-radius: 14px;
    box-shadow: 0 3px 12px rgba(15, 23, 42, 0.15);
    min-width: 0;
    overflow: hidden;
}

.category-image {
    background: #fff;
    height: 190px;
    overflow: hidden;
    padding: 10px;
    width: 100%;
}

.category-image img {
    display: block;
    height: 100%;
    max-height: 100%;
    max-width: 100%;
    object-fit: contain;
    width: 100%;
}

.image-placeholder {
    background: linear-gradient(135deg, #f8fafc, #e2e8f0);
    height: 100%;
    width: 100%;
}

.category-info {
    align-items: center;
    background: #eef8fc;
    display: flex;
    gap: 12px;
    justify-content: space-between;
    min-height: 76px;
    padding: 12px 14px;
}

.category-names {
    min-width: 0;
}

.category-names h3 {
    color: #25aeb2;
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.25;
    margin: 0;
    overflow-wrap: anywhere;
}

.category-names p {
    color: #64748b;
    font-size: 0.78rem;
    line-height: 1.3;
    margin: 3px 0 0;
}

.category-arrow {
    align-items: center;
    background: #32aeb2;
    border-radius: 50%;
    color: #fff;
    display: inline-flex;
    flex: 0 0 34px;
    height: 34px;
    justify-content: center;
    text-decoration: none;
    transition: background 0.18s ease, transform 0.18s ease;
    width: 34px;
}

.category-arrow:hover {
    background: #258e92;
    color: #fff;
    transform: translateX(2px);
}

.category-status {
    color: #64748b;
    padding: 48px 0;
    text-align: center;
}

.all-products-link {
    color: #205266;
    display: block;
    font-size: 0.95rem;
    margin: 42px auto 0;
    text-align: center;
    text-decoration: none;
    width: fit-content;
}

.all-products-link:hover {
    color: #25aeb2;
    text-decoration: underline;
}

@media (max-width: 960px) {
    .category-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 540px) {
    .category-section {
        padding: 54px 0 64px;
        width: min(88vw, 400px);
    }

    .category-grid {
        gap: 16px;
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .category-info {
        min-height: 68px;
        padding: 9px 10px;
    }

    .category-image {
        height: 122px;
        padding: 6px;
    }

    .category-names h3 {
        font-size: 0.78rem;
    }

    .category-names p {
        font-size: 0.62rem;
    }

    .category-arrow {
        flex-basis: 28px;
        height: 28px;
        width: 28px;
    }
}
</style>
