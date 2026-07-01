<template>
    <div class="blog-detail-page">
        <div v-if="loading" class="info-text">กำลังโหลด...</div>
        <div v-else-if="!article" class="info-text">ไม่พบบทความนี้</div>

        <template v-else>
            <div class="content-wrap">
                <!-- Back -->
                <button class="back-btn" @click="$router.push('/blogs')">← กลับไปบทความทั้งหมด</button>

                <!-- Cover image -->
                <div class="cover-image">
                    <img
                        :src="article.featuredImageUrl || '/images/example/news01.png'"
                        :alt="article.title"
                    />
                </div>

                <!-- Category + title -->
                <span v-if="article.category" class="article-category">{{ article.category }}</span>
                <h1 class="article-title">{{ article.title }}</h1>

                <!-- Body content -->
                <div class="article-body" v-if="article.content">
                    {{ article.content }}
                </div>

                <!-- FAQ -->
                <div class="faq-section" v-if="article.faq && article.faq.length">
                    <h2 class="section-title">คำถามที่พบบ่อย (FAQ)</h2>
                    <div
                        v-for="(item, index) in article.faq"
                        :key="index"
                        class="faq-item"
                    >
                        <div class="faq-q" @click="toggleFaq(index)">
                            <span>{{ item.question }}</span>
                            <span class="faq-icon">{{ openFaq === index ? '−' : '+' }}</span>
                        </div>
                        <div class="faq-a" v-if="openFaq === index">
                            {{ item.answer }}
                        </div>
                    </div>
                </div>

                <!-- Tags -->
                <div class="tags-section" v-if="article.tags && article.tags.length">
                    <span
                        v-for="tag in article.tags"
                        :key="tag"
                        class="tag"
                    >#{{ tag }}</span>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import { useNewsStore } from '@/stores/newsStore'

export default {
    name: 'BlogDetail',
    props: {
        id: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            openFaq: null,
        }
    },
    computed: {
        loading() {
            return useNewsStore().loading
        },
        article() {
            return useNewsStore().news.find((item) => item.id === this.id) || null
        },
    },
    created() {
        const store = useNewsStore()
        if (!store.news.length) {
            store.fetchNews()
        }
    },
    methods: {
        toggleFaq(index) {
            this.openFaq = this.openFaq === index ? null : index
        },
    },
}
</script>

<style scoped>
.blog-detail-page {
    min-height: calc(100vh - 70px);
    background: #f5f5f5;
}

.info-text {
    text-align: center;
    color: #6b7280;
    padding: 80px 0;
    font-size: 1rem;
}

/* Content */
.content-wrap {
    max-width: 800px;
    margin: 0 auto;
    padding: 40px 24px 80px;
}

.back-btn {
    background: none;
    border: none;
    color: #3cabae;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    padding: 0;
    margin-bottom: 24px;
    display: block;
}

.back-btn:hover {
    opacity: 0.75;
}

.cover-image {
    width: 100%;
    margin-bottom: 28px;
    border-radius: 12px;
    overflow: hidden;
}

.cover-image img {
    width: 100%;
    height: auto;
    display: block;
}

.article-category {
    font-size: 0.8rem;
    font-weight: 700;
    color: #3cabae;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    display: block;
    margin-bottom: 10px;
}

.article-title {
    font-size: 1.75rem;
    font-weight: 800;
    color: #205266;
    line-height: 1.3;
    margin-bottom: 28px;
}

@media (max-width: 768px) {
    .article-title {
        font-size: 1.3rem;
    }
}

.article-body {
    font-size: 1rem;
    color: #374151;
    line-height: 1.8;
    white-space: pre-wrap;
    margin-bottom: 40px;
}

/* FAQ */
.faq-section {
    margin-bottom: 40px;
}

.section-title {
    font-size: 1.15rem;
    font-weight: 700;
    color: #205266;
    margin-bottom: 16px;
}

.faq-item {
    border-bottom: 1px solid #e5e7eb;
}

.faq-q {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 0;
    cursor: pointer;
    font-weight: 600;
    color: #1f2937;
    font-size: 0.95rem;
    gap: 16px;
}

.faq-q:hover {
    color: #205266;
}

.faq-icon {
    font-size: 1.2rem;
    color: #3cabae;
    flex-shrink: 0;
}

.faq-a {
    padding: 0 0 14px;
    color: #4b5563;
    font-size: 0.9rem;
    line-height: 1.7;
}

/* Tags */
.tags-section {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.tag {
    background: #e0f2f1;
    color: #205266;
    font-size: 0.8rem;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 999px;
}
</style>
