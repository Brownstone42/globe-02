<template>
    <section
        ref="revealSection"
        class="news-section"
        :class="{ 'is-visible': isVisible }"
        aria-labelledby="news-heading"
    >
        <div class="news-header">
            <h2 id="news-heading">ข่าวสารจาก ไอเดียล โกลบ</h2>
            <RouterLink class="read-all-btn" to="/blogs">อ่านทั้งหมด</RouterLink>
        </div>

        <div v-if="newsStore.loading" class="news-status">กำลังโหลดข่าวสาร...</div>
        <div v-else-if="!items.length" class="news-status">ยังไม่มีข่าวสารในขณะนี้</div>

        <div v-else class="news-carousel">
            <button
                class="carousel-arrow carousel-arrow--prev"
                type="button"
                aria-label="ข่าวก่อนหน้า"
                :disabled="!canScrollPrev"
                @click="moveCarousel(-1)"
            >
                <i class="fa-solid fa-chevron-left"></i>
            </button>

            <div ref="newsViewport" class="news-viewport" @scroll.passive="updateCarouselState">
                <div class="news-grid">
                    <article
                        v-for="(item, index) in items"
                        :key="item.id"
                        class="news-card"
                        :style="{ '--reveal-delay': `${120 + Math.min(index, 2) * 110}ms` }"
                    >
                <RouterLink class="news-image" :to="`/blogs/${item.id}`">
                    <img
                        :src="
                            item.coverImageUrl ||
                            item.featuredImageUrl ||
                            fallbackNewsImage
                        "
                        :alt="item.title"
                    />
                </RouterLink>

                <div class="news-body">
                    <time v-if="formatDate(item.createdAt)" :datetime="isoDate(item.createdAt)">
                        {{ formatDate(item.createdAt) }}
                    </time>
                    <h3>{{ item.title }}</h3>
                    <p>{{ articleExcerpt(item) }}</p>

                    <RouterLink class="read-more" :to="`/blogs/${item.id}`">
                        อ่านเพิ่มเติม
                        <i class="fa-solid fa-arrow-right"></i>
                    </RouterLink>
                    </div>
                </article>
                </div>
            </div>

            <button
                class="carousel-arrow carousel-arrow--next"
                type="button"
                aria-label="ข่าวถัดไป"
                :disabled="!canScrollNext"
                @click="moveCarousel(1)"
            >
                <i class="fa-solid fa-chevron-right"></i>
            </button>
        </div>
    </section>
</template>

<script>
import { useNewsStore } from '@/stores/newsStore'
import fallbackNewsImage from '@/assets/images/news/fallback.png'

function toDate(value) {
    if (!value) return null
    if (typeof value.toDate === 'function') return value.toDate()
    if (typeof value.seconds === 'number') return new Date(value.seconds * 1000)
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? null : date
}

export default {
    name: 'homeNews',
    data() {
        return {
            fallbackNewsImage,
            isVisible: false,
            revealObserver: null,
            canScrollPrev: false,
            canScrollNext: false,
        }
    },
    computed: {
        newsStore() {
            return useNewsStore()
        },
        items() {
            return [...this.newsStore.publishedNews]
                .sort((a, b) => (toDate(b.createdAt)?.getTime() || 0) - (toDate(a.createdAt)?.getTime() || 0))
        },
    },
    created() {
        if (!this.newsStore.news.length) {
            this.newsStore.fetchNews()
        }
    },
    mounted() {
        this.setupReveal()
        window.addEventListener('resize', this.updateCarouselState)
        this.$nextTick(this.updateCarouselState)
    },
    beforeUnmount() {
        this.revealObserver?.disconnect()
        window.removeEventListener('resize', this.updateCarouselState)
    },
    watch: {
        items() {
            this.$nextTick(this.updateCarouselState)
        },
    },
    methods: {
        moveCarousel(direction) {
            const viewport = this.$refs.newsViewport
            const card = viewport?.querySelector('.news-card')
            if (!viewport || !card) return
            const gap = Number.parseFloat(getComputedStyle(viewport.querySelector('.news-grid')).gap) || 0
            viewport.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: 'smooth' })
        },
        updateCarouselState() {
            const viewport = this.$refs.newsViewport
            if (!viewport) {
                this.canScrollPrev = false
                this.canScrollNext = false
                return
            }

            const endPosition = viewport.scrollWidth - viewport.clientWidth
            this.canScrollPrev = viewport.scrollLeft > 2
            this.canScrollNext = endPosition > 2 && viewport.scrollLeft < endPosition - 2
        },
        setupReveal() {
            this.revealObserver = new IntersectionObserver(
                ([entry]) => {
                    if (!entry.isIntersecting) return
                    this.isVisible = true
                    this.revealObserver.disconnect()
                },
                { threshold: 0.12 },
            )
            this.revealObserver.observe(this.$refs.revealSection)
        },
        formatDate(value) {
            const date = toDate(value)
            if (!date) return ''
            return new Intl.DateTimeFormat('th-TH', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            }).format(date)
        },
        isoDate(value) {
            return toDate(value)?.toISOString() || ''
        },
        articleExcerpt(item) {
            const source = item.metaDescription || item.content || ''
            const container = document.createElement('div')
            container.innerHTML = source
            return (container.textContent || '').replace(/\s+/g, ' ').trim()
        },
    },
}
</script>

<style scoped>
.news-section {
    background: #fff;
    padding: 68px 0 84px;
}

.news-header,
.news-carousel,
.news-status {
    margin-left: auto;
    margin-right: auto;
    width: min(1160px, 90vw);
}

.news-header {
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-bottom: 28px;
    transition-delay: 20ms;
}

.news-header h2 {
    color: #a0805b;
    font-size: clamp(1.45rem, 2.2vw, 2rem);
    font-weight: 700;
    margin: 0;
}

.read-all-btn {
    border: 1px solid #a0805b;
    border-radius: 7px;
    color: #a0805b;
    font-size: 0.9rem;
    min-width: 132px;
    padding: 9px 20px;
    text-align: center;
    text-decoration: none;
    transition: background 0.18s ease, color 0.18s ease;
}

.read-all-btn:hover {
    background: #a0805b;
    color: #fff;
}

.news-carousel {
    position: relative;
}

.news-viewport {
    box-sizing: border-box;
    overflow-x: auto;
    padding: 6px 0 20px;
    scroll-behavior: smooth;
    scrollbar-width: none;
}

.news-viewport::-webkit-scrollbar {
    display: none;
}

.news-grid {
    display: flex;
    gap: 30px;
}

.news-card {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 3px 14px rgba(15, 23, 42, 0.14);
    display: flex;
    flex-direction: column;
    min-width: 0;
    overflow: hidden;
    flex: 0 0 calc((100% - 60px) / 3);
    transition-delay: var(--reveal-delay, 120ms);
}

.carousel-arrow {
    align-items: center;
    background: #23272d;
    border: 0;
    border-radius: 50%;
    color: #fff;
    cursor: pointer;
    display: flex;
    height: 42px;
    justify-content: center;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    transition: background 0.2s ease, transform 0.2s ease;
    width: 42px;
    z-index: 2;
}

.carousel-arrow:hover {
    background: #a0805b;
    transform: translateY(-50%) scale(1.06);
}

.carousel-arrow:disabled {
    background: #d4d7da;
    color: #fff;
    cursor: default;
    opacity: 0.65;
    pointer-events: none;
    transform: translateY(-50%);
}

.carousel-arrow--prev { left: -21px; }
.carousel-arrow--next { right: -21px; }

.news-header,
.news-card {
    opacity: 0;
    transform: translateY(30px);
    transition-duration: 0.7s;
    transition-property: opacity, transform;
    transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
}

.news-section.is-visible .news-header,
.news-section.is-visible .news-card {
    opacity: 1;
    transform: translateY(0);
}

.news-image {
    aspect-ratio: 16 / 9;
    display: block;
    overflow: hidden;
}

.news-image img {
    display: block;
    height: 100%;
    object-fit: cover;
    transition: transform 0.25s ease;
    width: 100%;
}

.news-image:hover img {
    transform: scale(1.025);
}

.news-body {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 17px 18px 18px;
}

.news-body time {
    color: #7b8790;
    font-size: 0.7rem;
    margin-bottom: 8px;
    text-transform: uppercase;
}

.news-body h3 {
    color: #a0805b;
    display: -webkit-box;
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.45;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
}

.news-body p {
    color: #6b7280;
    display: -webkit-box;
    font-size: 0.82rem;
    line-height: 1.55;
    margin: 8px 0 14px;
    min-height: calc(1.55em * 2);
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

.read-more {
    align-items: center;
    color: #a0805b;
    display: inline-flex;
    font-size: 0.8rem;
    gap: 8px;
    margin-top: auto;
    text-decoration: none;
    width: fit-content;
}

.read-more:hover {
    color: #896b49;
}

.read-more i {
    font-size: 0.7rem;
    transition: transform 0.18s ease;
}

.read-more:hover i {
    transform: translateX(3px);
}

.news-status {
    color: #64748b;
    padding: 48px 0;
    text-align: center;
}

@media (max-width: 900px) {
    .news-card {
        flex-basis: calc((100% - 30px) / 2);
    }
}

@media (max-width: 600px) {
    .news-section {
        padding: 54px 0 68px;
    }

    .news-header {
        align-items: flex-start;
        gap: 16px;
    }

    .news-header h2 {
        font-size: 1.3rem;
    }

    .read-all-btn {
        flex-shrink: 0;
        min-width: 104px;
        padding: 7px 13px;
    }

    .news-card {
        flex-basis: 100%;
    }

    .carousel-arrow { height: 36px; width: 36px; }
    .carousel-arrow--prev { left: -14px; }
    .carousel-arrow--next { right: -14px; }
}
</style>
