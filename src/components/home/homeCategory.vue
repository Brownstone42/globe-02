<template>
    <div class="category mt-6 mb-6">
        <span>สินค้าของเรา</span>

        <button class="arrow left" :disabled="!canLeft" @click="go(-1)">‹</button>

        <div ref="scroller" class="columns scroller mt-4" @scroll.passive="updateCanScroll">
            <div
                class="column"
                v-for="(item, i) in categoryStore.visibleCategories"
                :key="item.id || i"
                ref="cards"
            >
                <img :src="item.imageUrl || '/images/example/product01.png'" alt="" />
                <div class="column-content">
                    <span class="content-topic1 ml-2">
                        {{ item.name || 'Category Name' }}
                    </span>
                    <span class="content-topic2 ml-2">
                        {{ item.description || '' }}
                    </span>
                </div>
                <div class="column-content2 mt-5" @click="goToCategory(item)">
                    <span class="ml-2 content-topic3">ดูสินค้าทั้งหมด</span>
                    <img class="mr-2 go-button" src="/images/example/button.png" alt="" />
                </div>
            </div>
        </div>

        <button class="arrow right" :disabled="!canRight" @click="go(1)">›</button>
    </div>
</template>

<script>
import { mapStores } from 'pinia'
import { useCategoryStore } from '@/stores/categoryStore'

export default {
    name: 'homeCategory',

    data() {
        return {
            cardStep: 0,
            canLeft: false,
            canRight: false,
            gapPx: 16,
        }
    },

    computed: {
        ...mapStores(useCategoryStore),
    },

    mounted() {
        // ✅ โหลด categories ที่นี่ แล้วค่อย measure หลังโหลดเสร็จ
        this.categoryStore.loadCategories().then(() => {
            this.$nextTick(() => {
                this.measure()
                this.updateCanScroll()
            })
        })

        window.addEventListener('resize', this.onResize, { passive: true })
    },

    beforeUnmount() {
        window.removeEventListener('resize', this.onResize)
    },

    methods: {
        goToCategory(item) {
            if (!item.slug) return
            this.$router.push(`/product/${item.slug}`)
        },

        onResize() {
            this.measure()
            this.updateCanScroll()
        },

        measure() {
            const cards = this.$refs.cards
            if (!cards || cards.length === 0) return
            const w = cards[0].getBoundingClientRect().width
            this.cardStep = Math.round(w + this.gapPx)
        },

        go(dir) {
            const scroller = this.$refs.scroller
            if (!scroller) return

            scroller.scrollBy({ left: dir * this.cardStep, behavior: 'smooth' })

            // force update after animation
            setTimeout(() => this.updateCanScroll(), 300)
        },

        updateCanScroll() {
            const s = this.$refs.scroller
            if (!s) return

            const max = s.scrollWidth - s.clientWidth
            const left = s.scrollLeft

            const threshold = 3 // ป้องกัน floating error

            this.canLeft = left > threshold
            this.canRight = left < max - threshold
        },
    },
}
</script>

<style scoped>
.content-topic1 {
    font-size: 14pt;
    color: #205266;
    font-weight: bold;
}
.content-topic2 {
    font-size: 11pt;
    color: #a4a4a4;
}
.content-topic3 {
    color: #205266;
}
.column-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(128, 128, 128, 0.45);
}
.column-content2 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
}
.column-content2 span {
    font-size: 11pt;
    color: #205266;
}
.column-content2 img {
    width: 35px;
}

.category {
    position: relative;
    margin: auto;
    width: min(1100px, 80vw);
}

.columns.scroller {
    display: flex;
    flex-wrap: nowrap !important;
    overflow-x: auto;
    overflow-y: hidden;
    gap: 1rem;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    user-select: none;
    cursor: grab;
}
.columns.scroller::-webkit-scrollbar {
    display: none;
}

.column {
    flex: 0 0 100%;
    scroll-snap-align: start;
    min-height: 140px;
    background: white;
    border-radius: 12px;
    padding: 16px;
    text-align: center;
}
.column img {
    max-width: 100%;
    object-fit: contain;
}

@media (min-width: 768px) {
    .column {
        flex: 0 0 calc(25% - 0.75rem);
    }
    .columns.scroller {
        padding: 0;
        scroll-padding: 0;
    }
}

@media (max-width: 767.98px) {
    .columns.scroller {
        padding: 0 10vw;
        scroll-padding: 0 10vw;
    }
    .column {
        flex: 0 0 85%;
        scroll-snap-align: center;
    }
}

.arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: white;
    border: none;
    border-radius: 999px;
    width: 40px;
    height: 40px;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.18);
    font-size: 1.5rem;
    line-height: 1;
    color: #333;
    z-index: 5;
}
.arrow.left {
    left: -32px;
}
.arrow.right {
    right: -32px;
}
.arrow:disabled {
    opacity: 0.35;
    cursor: not-allowed;
}

@media (max-width: 768px) {
    .arrow {
        width: 32px;
        height: 32px;
        font-size: 1.6rem;
    }
    .arrow.left {
        left: -8%;
    }
    .arrow.right {
        right: -8%;
    }
}

@media (max-width: 1040px) {
    .content-topic1 {
        font-size: 12px;
    }
    .content-topic2 {
        font-size: 10px;
    }
    .content-topic3 {
        font-size: 12px !important;
    }
    .go-button {
        width: 20% !important;
    }
}
</style>
