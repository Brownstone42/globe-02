<template>
    <div class="blogs-page">
        <div class="page-hero">
            <h1>BLOGS</h1>
            <p>ข่าวสารและบทความจากไอเดียลโกลบ</p>
        </div>

        <div class="blog-container">
            <div v-if="loading" class="info-text">กำลังโหลด...</div>
            <div v-else-if="articles.length === 0" class="info-text">ยังไม่มีบทความในขณะนี้</div>
            <div v-else class="blog-grid">
                <div
                    v-for="article in articles"
                    :key="article.id"
                    class="blog-card"
                    @click="$router.push('/blogs/' + article.id)"
                >
                    <div class="card-thumb">
                        <img
                            :src="article.coverImageUrl || article.featuredImageUrl || '/images/example/news01.png'"
                            :alt="article.title"
                        />
                    </div>
                    <div class="card-body">
                        <span v-if="article.category" class="card-category">{{ article.category }}</span>
                        <h2 class="card-title">{{ article.title }}</h2>
                        <p v-if="article.metaDescription" class="card-desc">{{ article.metaDescription }}</p>
                        <span class="card-link">อ่านเพิ่มเติม →</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useNewsStore } from '@/stores/newsStore'

export default {
    name: 'BlogList',
    computed: {
        loading() {
            return useNewsStore().loading
        },
        articles() {
            return useNewsStore().publishedNews
        },
    },
    created() {
        const store = useNewsStore()
        if (!store.news.length) {
            store.fetchNews()
        }
    },
}
</script>

<style scoped>
.blogs-page {
    min-height: calc(100vh - 70px);
    background: #f5f5f5;
}

.page-hero {
    background: #23272d;
    padding: 48px 24px;
    text-align: center;
}

.page-hero h1 {
    color: #ead5b7;
    font-size: 2rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    margin-bottom: 8px;
}

.page-hero p {
    color: #9ca3af;
    font-size: 1rem;
}

.blog-container {
    max-width: 1100px;
    margin: 48px auto;
    padding: 0 24px;
}

.info-text {
    text-align: center;
    color: #6b7280;
    padding: 60px 0;
    font-size: 1rem;
}

.blog-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
}

@media (max-width: 900px) {
    .blog-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 560px) {
    .blog-grid {
        grid-template-columns: 1fr;
    }
}

.blog-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
}

.blog-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-thumb {
    position: relative;
    width: 100%;
    padding-top: 56.25%;
    overflow: hidden;
}

.card-thumb img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top;
}

.card-body {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.card-category {
    font-size: 0.75rem;
    font-weight: 600;
    color: #3cabae;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.card-title {
    font-size: 1rem;
    font-weight: 700;
    color: #205266;
    line-height: 1.4;
    margin: 0;
}

.card-desc {
    font-size: 0.85rem;
    color: #6b7280;
    line-height: 1.5;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.card-link {
    font-size: 0.85rem;
    font-weight: 600;
    color: #3cabae;
    margin-top: 4px;
}
</style>
