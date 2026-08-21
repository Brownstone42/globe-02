<template>
    <section class="hero" role="banner" aria-label="Welcome to IdealGlobe">
        <div class="hero-bg" aria-hidden="true"></div>

        <picture class="hero-media" aria-hidden="true">
            <img
                class="hero-img"
                :src="bannerUrl"
                alt=""
                decoding="async"
                fetchpriority="high"
            />
        </picture>

        <div class="hero-shade" aria-hidden="true"></div>

        <div class="hero-content">
            <div class="hero-copy">
                <div class="hero-heading">
                    <h1>โซลูชั่นครบครัน<br />เพื่อโรงงานอุตสาหกรรม</h1>
                    <p>
                        จำหน่ายอุปกรณ์ Cleanroom, ESD, Safety<br />
                        และอุปกรณ์โรงงาน คุณภาพมาตรฐานสากล
                    </p>
                </div>

                <div class="hero-actions">
                    <RouterLink class="hero-btn product-btn" to="/product">
                        ดูสินค้าทั้งหมด
                    </RouterLink>
                    <button class="hero-btn quote-btn" type="button" @click="scrollToContact">
                        ขอใบเสนอราคา
                    </button>
                    <a
                        class="hero-btn contact-btn"
                        href="https://line.me/R/ti/p/%40idealglobe"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img class="contact-line-icon" src="/images/line_icon.png" alt="" />
                        ติดต่อเรา
                    </a>
                </div>

                <p class="hero-trust">มากกว่า 30 ปี ที่ผู้ประกอบการวางใจ</p>
            </div>
        </div>
    </section>
</template>

<script>
import { useBannerStore } from '@/stores/bannerStore'

export default {
    name: 'AppBanner',
    computed: {
        bannerStore() {
            return useBannerStore()
        },
        bannerUrl() {
            return this.bannerStore.imageUrl || '/images/banner5.png'
        },
    },
    mounted() {
        this.bannerStore.loadBanner()
    },
    methods: {
        scrollToContact() {
            document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' })
        },
    },
}
</script>

<style scoped>
.hero {
    position: relative;
    height: 600px; /* ← กำหนดความสูงคงที่ */
    overflow: hidden;
    isolation: isolate;
}

/* cream gradient background */
.hero-bg {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #fff7ea 0%, #fff2d8 40%, #fff9f0 100%);
    z-index: 0;
}

/* image fills area */
.hero-media {
    position: absolute;
    inset: 0;
    z-index: 0;
}

.hero-shade {
    position: absolute;
    inset: 0;
    z-index: 1;
    background: linear-gradient(
        90deg,
        rgba(248, 252, 255, 0.96) 0%,
        rgba(248, 252, 255, 0.82) 31%,
        rgba(248, 252, 255, 0.18) 58%,
        rgba(248, 252, 255, 0) 75%
    );
    pointer-events: none;
}

.hero-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
}

.hero-content {
    position: relative;
    z-index: 2;
    height: 100%;
    width: min(1100px, 88vw);
    margin: 0 auto;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.hero-copy {
    display: flex;
    flex-direction: column;
    width: min(620px, 58vw);
}

.hero-heading h1 {
    color: #23272d;
    font-size: clamp(2.1rem, 3.2vw, 3.35rem);
    font-weight: 700;
    line-height: 1.18;
    margin: 0 0 12px;
}

.hero-heading p {
    color: #a0805b;
    font-size: clamp(1rem, 1.45vw, 1.3rem);
    line-height: 1.45;
    margin: 0;
}

.hero-actions {
    display: flex;
    gap: 12px;
    margin-top: 22px;
}

.hero-btn {
    align-items: center;
    border: 0;
    border-radius: 9px;
    box-shadow: 0 3px 8px rgba(15, 23, 42, 0.2);
    cursor: pointer;
    display: inline-flex;
    font-family: inherit;
    font-size: 1rem;
    font-weight: 600;
    gap: 10px;
    justify-content: center;
    min-height: 52px;
    padding: 10px 24px;
    text-decoration: none;
    transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.hero-btn:hover {
    box-shadow: 0 5px 13px rgba(15, 23, 42, 0.24);
    transform: translateY(-2px);
}

.product-btn {
    background: #23272d;
    color: #fff;
}

.quote-btn {
    background: #a0805b;
    color: #fff;
}

.contact-btn {
    background: #fff;
    color: #a0805b;
}

.contact-line-icon {
    display: block;
    height: 20px;
    object-fit: contain;
    width: 20px;
}

.product-btn:hover {
    background: #15171b;
    color: #fff;
}

.quote-btn:hover {
    background: #896b49;
    color: #fff;
}

.contact-btn:hover {
    background: #f7f3ed;
    color: #896b49;
}

.hero-trust {
    color: #205b6c;
    font-size: 0.9rem;
    font-weight: 700;
    margin: 14px 0 0;
}

/* Mobile adjustments */
@media (max-width: 640px) {
    .hero {
        height: 610px;
    }

    .hero-img {
        object-position: center;
    }

    .hero-shade {
        background: rgba(248, 252, 255, 0.58);
    }

    .hero-content {
        align-items: center;
        justify-content: flex-start;
        padding-top: 46px;
        text-align: center;
        width: min(92vw, 430px);
    }

    .hero-copy {
        width: 100%;
    }

    .hero-heading {
        order: 1;
    }

    .hero-heading h1 {
        font-size: clamp(1.85rem, 8vw, 2.35rem);
        line-height: 1.22;
    }

    .hero-heading p {
        font-size: 1rem;
        line-height: 1.4;
    }

    .hero-trust {
        order: 2;
        margin-top: 14px;
    }

    .hero-actions {
        align-items: stretch;
        flex-direction: column;
        margin: 20px auto 0;
        order: 3;
        width: min(240px, 78vw);
    }

    .hero-btn {
        font-size: 1.05rem;
        min-height: 52px;
        width: 100%;
    }
}
</style>
