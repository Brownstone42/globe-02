<template>
    <section class="news-section" aria-labelledby="news-heading">
        <div class="news-header">
            <h2 id="news-heading">ข่าวสารจาก ไอเดียล โกลบ</h2>
            <RouterLink class="read-all-btn" to="/blogs">อ่านทั้งหมด</RouterLink>
        </div>

        <div v-if="newsStore.loading" class="news-status">กำลังโหลดข่าวสาร...</div>
        <div v-else-if="!items.length" class="news-status">ยังไม่มีข่าวสารในขณะนี้</div>

        <div v-else class="news-grid">
            <article v-for="item in items" :key="item.id" class="news-card">
                <RouterLink class="news-image" :to="`/blogs/${item.id}`">
                    <img
                        :src="
                            item.coverImageUrl ||
                            item.featuredImageUrl ||
                            '/images/example/news01.png'
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
    </section>
</template>

<script>
import { useNewsStore } from '@/stores/newsStore'

function toDate(value) {
    if (!value) return null
    if (typeof value.toDate === 'function') return value.toDate()
    if (typeof value.seconds === 'number') return new Date(value.seconds * 1000)
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? null : date
}

export default {
    name: 'homeNews',
    computed: {
        newsStore() {
            return useNewsStore()
        },
        items() {
            return [...this.newsStore.publishedNews]
                .sort((a, b) => (toDate(b.createdAt)?.getTime() || 0) - (toDate(a.createdAt)?.getTime() || 0))
                .slice(0, 3)
        },
    },
    created() {
        if (!this.newsStore.news.length) {
            this.newsStore.fetchNews()
        }
    },
    methods: {
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
.news-grid,
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
}

.news-header h2 {
    color: #205266;
    font-size: clamp(1.45rem, 2.2vw, 2rem);
    font-weight: 700;
    margin: 0;
}

.read-all-btn {
    border: 1px solid #2eaeb2;
    border-radius: 7px;
    color: #259da1;
    font-size: 0.9rem;
    min-width: 132px;
    padding: 9px 20px;
    text-align: center;
    text-decoration: none;
    transition: background 0.18s ease, color 0.18s ease;
}

.read-all-btn:hover {
    background: #2eaeb2;
    color: #fff;
}

.news-grid {
    display: grid;
    gap: 30px;
    grid-template-columns: repeat(3, minmax(0, 1fr));
}

.news-card {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 3px 14px rgba(15, 23, 42, 0.14);
    display: flex;
    flex-direction: column;
    min-width: 0;
    overflow: hidden;
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
    color: #26a7ab;
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
    color: #239da1;
    display: inline-flex;
    font-size: 0.8rem;
    gap: 8px;
    margin-top: auto;
    text-decoration: none;
    width: fit-content;
}

.read-more:hover {
    color: #176f73;
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
    .news-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
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

    .news-grid {
        grid-template-columns: 1fr;
    }
}
</style>
