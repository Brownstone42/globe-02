<template>
    <section class="product-page">
        <div class="product-shell">
            <aside class="product-sidebar">
                <h1>สินค้าของเรา</h1>

                <RouterLink
                    :to="{ name: 'product-all' }"
                    class="all-category"
                    :class="{ active: $route.name === 'product-all' }"
                >
                    สินค้าทั้งหมด
                </RouterLink>

                <ul class="category-list">
                    <li v-for="cat in visibleCategories" :key="cat.id">
                        <RouterLink
                            :to="{
                                name: 'product-category',
                                params: { category: cat.slug },
                            }"
                            :class="{ active: isCategoryActive(cat.slug) && !$route.query.sub }"
                        >
                            {{ cat.name }}
                        </RouterLink>

                        <ul v-if="cat.subcategories?.length" class="subcategory-list">
                            <li
                                v-for="sub in visibleSubcategories(cat)"
                                :key="sub.id || sub.name"
                            >
                                <RouterLink
                                    :to="{
                                        name: 'product-category',
                                        params: { category: cat.slug },
                                        query: { sub: sub.id },
                                    }"
                                    :class="{
                                        active:
                                            isCategoryActive(cat.slug) &&
                                            $route.query.sub === sub.id,
                                    }"
                                >
                                    {{ sub.name }}
                                </RouterLink>
                            </li>
                        </ul>
                    </li>
                </ul>
            </aside>

            <main class="product-results">
                <RouterView />
            </main>
        </div>
    </section>
</template>

<script>
import { mapStores } from 'pinia'
import { useCategoryStore } from '@/stores/categoryStore'

export default {
    name: 'ProductLayout',
    computed: {
        ...mapStores(useCategoryStore),
        visibleCategories() {
            return [...this.categoryStore.visibleCategories].sort(
                (a, b) => (a.order || 0) - (b.order || 0),
            )
        },
    },
    created() {
        if (!this.categoryStore.categories?.length && !this.categoryStore.loading) {
            this.categoryStore.loadCategories()
        }
    },
    methods: {
        visibleSubcategories(category) {
            return [...(category.subcategories || [])]
                .filter((sub) => sub.visibility !== false)
                .sort((a, b) => (a.order || 0) - (b.order || 0))
        },
        isCategoryActive(slug) {
            return this.$route.params.category === slug
        },
    },
}
</script>

<style scoped>
.product-page {
    background: #eef1ef;
    min-height: calc(100vh - 70px);
    padding: 54px 0 78px;
}

.product-shell {
    display: grid;
    gap: 40px;
    grid-template-columns: 210px minmax(0, 1fr);
    margin: 0 auto;
    width: min(1320px, 92vw);
}

.product-sidebar h1 {
    color: #32aeb2;
    font-size: 1.75rem;
    font-weight: 500;
    margin: 0 0 25px;
}

.all-category {
    color: #41464b;
    display: inline-block;
    font-size: 0.95rem;
    font-weight: 700;
    margin-bottom: 12px;
    text-decoration: none;
}

.category-list,
.subcategory-list {
    list-style: none;
    margin: 0;
    padding: 0;
}

.category-list > li {
    margin-bottom: 10px;
    padding-left: 13px;
    position: relative;
}

.category-list > li::before {
    background: #30b1b5;
    border-radius: 50%;
    content: '';
    height: 5px;
    left: 0;
    position: absolute;
    top: 9px;
    width: 5px;
}

.category-list a,
.subcategory-list a {
    color: #4f555a;
    font-size: 0.9rem;
    line-height: 1.35;
    text-decoration: none;
}

.category-list a:hover,
.category-list a.active,
.subcategory-list a:hover,
.subcategory-list a.active,
.all-category:hover,
.all-category.active {
    color: #22a7ab;
}

.subcategory-list {
    margin: 4px 0 0 13px;
}

.subcategory-list li {
    line-height: 1.25;
    margin-bottom: 3px;
}

.subcategory-list a {
    color: #2aadb1;
    font-size: 0.78rem;
}

.product-results {
    min-width: 0;
}

@media (max-width: 800px) {
    .product-page {
        padding-top: 34px;
    }

    .product-shell {
        gap: 28px;
        grid-template-columns: 1fr;
    }

    .product-sidebar {
        background: #fff;
        border-radius: 12px;
        padding: 20px;
    }

    .product-sidebar h1 {
        font-size: 1.45rem;
        margin-bottom: 14px;
    }

    .category-list {
        column-gap: 24px;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 480px) {
    .category-list {
        grid-template-columns: 1fr;
    }
}
</style>
