<template>
    <section
        ref="revealSection"
        class="category-section"
        :class="{ 'is-visible': isVisible }"
        aria-labelledby="category-heading"
    >
        <h2 id="category-heading" ref="revealTrigger">เลือกสินค้าจากหมวดหมู่</h2>

        <div v-if="categoryStore.loading" class="category-status">กำลังโหลดหมวดหมู่...</div>

        <div v-else class="category-grid">
            <article
                v-for="(item, index) in categoryStore.visibleCategories"
                :key="item.id"
                v-category-reveal
                class="category-card"
                :style="{
                    '--category-desktop-delay': `${(index % 4) * 85}ms`,
                    '--category-mobile-delay': `${(index % 2) * 110}ms`,
                }"
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

const categoryRevealDirective = {
    mounted(element) {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            element.classList.add('is-revealed')
            return
        }

        let frameId = null
        const checkPosition = () => {
            frameId = null
            const rect = element.getBoundingClientRect()
            if (rect.top <= window.innerHeight * 0.88 && rect.bottom >= 0) {
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
        element._categoryRevealCleanup = () => {
            window.removeEventListener('scroll', requestCheck)
            window.removeEventListener('resize', requestCheck)
            if (frameId !== null) window.cancelAnimationFrame(frameId)
        }
        window.requestAnimationFrame(() => window.requestAnimationFrame(requestCheck))
    },
    unmounted(element) {
        element._categoryRevealCleanup?.()
    },
}

export default {
    name: 'homeCategory',
    directives: {
        categoryReveal: categoryRevealDirective,
    },
    data() {
        return {
            isVisible: false,
            revealObserver: null,
        }
    },
    computed: {
        ...mapStores(useCategoryStore),
    },
    mounted() {
        if (!this.categoryStore.categories.length) {
            this.categoryStore.loadCategories()
        }
        this.setupReveal()
    },
    beforeUnmount() {
        this.revealObserver?.disconnect()
    },
    methods: {
        setupReveal() {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                this.isVisible = true
                return
            }

            this.revealObserver = new IntersectionObserver(
                ([entry]) => {
                    if (!entry.isIntersecting) return
                    this.isVisible = true
                    this.revealObserver.disconnect()
                },
                {
                    threshold: 0.01,
                    rootMargin: '0px 0px -8% 0px',
                },
            )
            // ใช้หัวข้อเป็นจุดเริ่ม animation แทน section ทั้งก้อน เพราะบน Mobile
            // section สูงมากจน intersection ratio อาจไม่ถึงค่าที่กำหนด
            this.revealObserver.observe(this.$refs.revealTrigger)
        },
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
    transition-delay: 20ms;
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
    --category-reveal-delay: var(--category-desktop-delay, 0ms);
    opacity: 0;
    transform: translateY(34px) scale(0.97);
    transition:
        opacity 0.72s cubic-bezier(0.22, 1, 0.36, 1) var(--category-reveal-delay),
        transform 0.72s cubic-bezier(0.22, 1, 0.36, 1) var(--category-reveal-delay),
        box-shadow 0.2s ease;
}

.category-section h2,
.all-products-link {
    opacity: 0;
    transform: translateY(30px);
    transition-duration: 0.7s;
    transition-property: opacity, transform;
    transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
}

.category-section.is-visible h2,
.category-section.is-visible .all-products-link {
    opacity: 1;
    transform: translateY(0);
}

.category-card.is-revealed {
    opacity: 1;
    transform: translateY(0) scale(1);
}

.category-image {
    background: #fff;
    height: 210px;
    overflow: hidden;
    padding: 20px 10px 10px;
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
    background: #f5f6f7;
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
    color: #a0805b;
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
    background: #a0805b;
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
    background: #896b49;
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
    transition-delay: 420ms;
}

@media (prefers-reduced-motion: reduce) {
    .category-section h2,
    .all-products-link {
        opacity: 1;
        transform: none;
        transition: none;
    }


    .category-card {
        opacity: 1;
        transform: none;
        transition: none;
    }
}

.all-products-link:hover {
    color: #a0805b;
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

    .category-card {
        --category-reveal-delay: var(--category-mobile-delay, 0ms);
    }

    .category-info {
        min-height: 68px;
        padding: 9px 10px;
    }

    .category-image {
        height: 136px;
        padding: 12px 6px 6px;
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
