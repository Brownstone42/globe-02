<template>
    <section class="hero" role="banner" aria-label="Welcome to IdealGlobe">
        <div class="hero-bg" aria-hidden="true"></div>

        <div class="hero-media" aria-hidden="true">
            <Transition :name="slideTransition">
                <img
                    v-if="bannerStore.loaded"
                    :key="activeBanner.id"
                    class="hero-img"
                    :src="activeBanner.imageUrl"
                    alt=""
                    decoding="async"
                    fetchpriority="high"
                />
            </Transition>
        </div>

        <div class="hero-shade" aria-hidden="true"></div>

        <div class="hero-content">
            <div class="hero-copy">
                <div class="hero-heading">
                    <h1
                        :style="{
                            '--title-font-size': `${overlaySettings.title.fontSize}px`,
                            color: overlaySettings.title.color,
                        }"
                    >{{ overlaySettings.title.text }}</h1>
                    <p
                        v-if="overlaySettings.subtitle.text"
                        :style="{
                            '--subtitle-font-size': `${overlaySettings.subtitle.fontSize}px`,
                            color: overlaySettings.subtitle.color,
                        }"
                    >{{ overlaySettings.subtitle.text }}</p>
                </div>

                <div v-if="visibleButtons.length" class="hero-actions">
                    <component
                        :is="isInternalLink(button.link) ? 'RouterLink' : 'a'"
                        v-for="(button, index) in visibleButtons"
                        :key="index"
                        v-bind="buttonLinkProps(button)"
                        class="hero-btn"
                        :style="{
                            backgroundColor: button.backgroundColor,
                            color: button.textColor,
                        }"
                    >
                        <i v-if="button.icon" :class="button.icon" aria-hidden="true"></i>
                        <span>{{ button.text }}</span>
                    </component>
                </div>

                <p
                    v-if="overlaySettings.ending.text"
                    class="hero-trust"
                    :style="{
                        '--ending-font-size': `${overlaySettings.ending.fontSize}px`,
                        color: overlaySettings.ending.color,
                    }"
                >{{ overlaySettings.ending.text }}</p>
            </div>
        </div>

        <div v-if="visibleBanners.length > 1" class="hero-pagination" aria-label="เลือกภาพแบนเนอร์">
            <button
                v-for="(banner, index) in visibleBanners"
                :key="banner.id"
                class="hero-pagination-dot"
                :class="{ 'is-active': index === activeIndex }"
                type="button"
                :aria-label="`แสดงแบนเนอร์รูปที่ ${index + 1}`"
                :aria-current="index === activeIndex ? 'true' : undefined"
                @click="selectBanner(index)"
            ></button>
        </div>
    </section>
</template>

<script>
import { useBannerStore } from '@/stores/bannerStore'
import fallbackBanner from '@/assets/images/home/banner.png'

export default {
    name: 'AppBanner',
    data() {
        return {
            activeIndex: 0,
            timerId: null,
            slideDirection: 'next',
        }
    },
    computed: {
        bannerStore() {
            return useBannerStore()
        },
        visibleBanners() {
            const banners = [...this.bannerStore.banners]
                .filter((banner) => banner.visible !== false && banner.imageUrl)
                .sort((a, b) => a.order - b.order)
            return banners.length
                ? banners
                : [{ id: 'fallback-banner', imageUrl: fallbackBanner, order: 0, visible: true }]
        },
        activeBanner() {
            return this.visibleBanners[this.activeIndex] || this.visibleBanners[0]
        },
        slideTransition() {
            return this.slideDirection === 'previous' ? 'banner-slide-previous' : 'banner-slide-next'
        },
        intervalMilliseconds() {
            return 5000
        },
        overlaySettings() {
            return this.activeBanner.overlaySettings || this.bannerStore.overlaySettings
        },
        visibleButtons() {
            return (this.overlaySettings.buttons || []).filter(
                (button) => button.visible !== false && button.text,
            )
        },
    },
    async mounted() {
        await this.bannerStore.loadBanner()
        this.startTimer()
    },
    beforeUnmount() {
        this.stopTimer()
    },
    watch: {
        visibleBanners: {
            deep: true,
            handler() {
                if (this.activeIndex >= this.visibleBanners.length) this.activeIndex = 0
                this.startTimer()
            },
        },
    },
    methods: {
        isInternalLink(link) {
            return String(link || '').startsWith('/')
        },
        buttonLinkProps(button) {
            const link = String(button.link || '').trim() || '#'
            if (this.isInternalLink(link)) return { to: link }
            const opensNewTab = /^https?:\/\//i.test(link)
            return {
                href: link,
                target: opensNewTab ? '_blank' : undefined,
                rel: opensNewTab ? 'noopener noreferrer' : undefined,
            }
        },
        selectBanner(index) {
            if (index === this.activeIndex) {
                this.startTimer()
                return
            }
            this.slideDirection = index > this.activeIndex ? 'next' : 'previous'
            this.activeIndex = index
            this.startTimer()
        },
        showNextBanner() {
            if (this.visibleBanners.length < 2) return
            this.slideDirection = 'next'
            this.activeIndex = (this.activeIndex + 1) % this.visibleBanners.length
            this.startTimer()
        },
        startTimer() {
            this.stopTimer()
            if (this.visibleBanners.length < 2) return
            this.timerId = window.setTimeout(this.showNextBanner, this.intervalMilliseconds)
        },
        stopTimer() {
            if (this.timerId) window.clearTimeout(this.timerId)
            this.timerId = null
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
    inset: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
}

.banner-slide-next-enter-active,
.banner-slide-next-leave-active,
.banner-slide-previous-enter-active,
.banner-slide-previous-leave-active {
    transition: opacity 0.65s ease, transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
}

.banner-slide-next-enter-from,
.banner-slide-previous-leave-to {
    opacity: 0;
    transform: translateX(7%);
}

.banner-slide-next-leave-to,
.banner-slide-previous-enter-from {
    opacity: 0;
    transform: translateX(-7%);
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
    font-size: var(--title-font-size, 38px);
    font-weight: 700;
    line-height: 1.18;
    margin: 0 0 12px;
    white-space: pre-line;
}

.hero-heading p {
    color: #a0805b;
    font-size: var(--subtitle-font-size, 21px);
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

.hero-btn i { flex: 0 0 auto; font-size: 1.15em; }

.hero-btn:hover {
    box-shadow: 0 5px 13px rgba(15, 23, 42, 0.24);
    transform: translateY(-2px);
}

.hero-trust {
    color: #205b6c;
    font-size: var(--ending-font-size, 16px);
    font-weight: 700;
    margin: 14px 0 0;
}

.hero-pagination {
    align-items: center;
    bottom: 20px;
    display: flex;
    gap: 8px;
    justify-content: center;
    left: 50%;
    position: absolute;
    transform: translateX(-50%);
    z-index: 3;
}

.hero-pagination-dot {
    background: rgba(255, 255, 255, 0.72);
    border: 0;
    border-radius: 999px;
    box-shadow: 0 1px 5px rgba(15, 23, 42, 0.28);
    cursor: pointer;
    height: 9px;
    padding: 0;
    transition: background-color 0.35s ease, transform 0.35s ease, width 0.35s cubic-bezier(0.22, 1, 0.36, 1);
    width: 9px;
}

.hero-pagination-dot.is-active {
    background: #a38c67;
    transform: scaleY(1.08);
    width: 34px;
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
        font-size: min(var(--title-font-size, 38px), 5vw);
        line-height: 1.22;
    }

    .hero-heading p {
        font-size: min(var(--subtitle-font-size, 21px), 4.2vw);
        line-height: 1.4;
    }

    .hero-trust {
        font-size: min(var(--ending-font-size, 16px), 3.8vw);
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
