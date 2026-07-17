<template>
    <div class="blog-detail-page">
        <div v-if="loading" class="info-text">กำลังโหลด...</div>
        <div v-else-if="!article" class="info-text">ไม่พบบทความนี้</div>

        <template v-else>
            <!-- Hero: cover image with title/meta overlaid -->
            <header class="blog-hero">
                <div class="blog-hero-inner">
                    <img
                        v-if="heroUrl"
                        class="blog-hero-img"
                        :src="heroUrl"
                        :alt="article.title"
                    />
                    <div class="blog-hero-overlay">
                        <h1 class="blog-hero-title">{{ article.title }}</h1>
                    </div>
                </div>
            </header>

            <div class="content-wrap">
                <!-- Back -->
                <button class="back-btn" @click="$router.push('/blogs')">← กลับไปบทความทั้งหมด</button>

                <!-- Body content -->
                <div class="article-body" v-if="article.content">
                    <div
                        v-if="contentIsHtml"
                        class="ql-editor rich-content"
                        v-html="article.content"
                    ></div>
                    <div v-else class="plain-content">{{ article.content }}</div>
                </div>

                <!-- Featured image -->
                <div class="featured-image" v-if="article.featuredImageUrl">
                    <img :src="article.featuredImageUrl" :alt="article.title" />
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
        // Posts written before the rich text editor hold plain text, which must keep
        // its line breaks; anything from the editor is HTML.
        contentIsHtml() {
            return /<[a-z][\s\S]*>/i.test((this.article && this.article.content) || '')
        },
        // Posts created before the header image existed fall back to their cover.
        heroUrl() {
            if (!this.article) return null
            return this.article.headerImageUrl || this.article.coverImageUrl || null
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

/* Hero */
.blog-hero {
    /* Same as appMainHeader, so the bands beside the image extend the site header. */
    background: #23272d;
    padding: 0 24px;
}

.blog-hero-inner {
    position: relative;
    max-width: 1100px;
    margin: 0 auto;
    /* Matches the 32:9 header crop produced in admin, so the image is never re-cropped. */
    aspect-ratio: 32 / 9;
    background: #23272d;
    overflow: hidden;
}

.blog-hero-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.blog-hero-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 32px 6%;
    /* Keeps the title readable over any image. */
    background: linear-gradient(
        180deg,
        rgba(15, 23, 42, 0.15) 0%,
        rgba(15, 23, 42, 0.55) 55%,
        rgba(15, 23, 42, 0.75) 100%
    );
}

.blog-hero-title {
    color: #fff;
    font-size: clamp(1.4rem, 3.2vw, 2.6rem);
    font-weight: 800;
    line-height: 1.35;
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.45);
    margin: 0;
    max-width: 90%;
}

@media (max-width: 768px) {
    .blog-hero {
        padding: 0;
    }
}

.article-body {
    font-size: 1rem;
    color: #374151;
    line-height: 1.8;
    margin-bottom: 40px;
}

/* Legacy plain-text posts: keep the line breaks the author typed. */
.plain-content {
    white-space: pre-wrap;
}

/* quill.core.css sizes .ql-editor for a scrolling editor pane; on the page it is
   just article markup, so undo the box it assumes. */
.article-body :deep(.ql-editor) {
    height: auto;
    overflow-y: visible;
    padding: 0;
    line-height: inherit;
}

.article-body :deep(.ql-editor p) {
    margin-bottom: 1em;
}

.article-body :deep(.ql-editor a) {
    color: #3cabae;
    text-decoration: underline;
}

.article-body :deep(.ql-editor img) {
    max-width: 100%;
    height: auto;
}

.featured-image {
    width: 100%;
    margin-bottom: 40px;
    border-radius: 12px;
    overflow: hidden;
}

.featured-image img {
    width: 100%;
    height: auto;
    display: block;
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
