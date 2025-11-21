<template>
    <div class="category mt-6 mb-6">
        <span>สินค้าของเรา</span>

        <button class="arrow left" :disabled="!canLeft" @click="go(-1)">‹</button>

        <div ref="scroller" class="columns scroller mt-4" @scroll.passive="updateCanScroll">
            <div class="column" v-for="(item, i) in items" :key="i" ref="cards">
                <img src="/images/example/product01.png" alt="" />
                <div class="column-content">
                    <span class="content-topic1 ml-2">Disposable Gloves</span>
                    <span class="content-topic2 ml-2">ถุงมือใช้แล้วทิ้ง</span>
                </div>
                <div class="column-content2 mt-5">
                    <span class="ml-2 content-topic3">ดูสินค้าทั้งหมด</span>
                    <img class="mr-2" src="/images/example/button.png" alt="" />
                </div>
            </div>
        </div>

        <button class="arrow right" :disabled="!canRight" @click="go(1)">›</button>
    </div>
</template>

<script>
export default {
    name: 'homeCategorySimple',
    data() {
        return {
            items: ['Column 1', 'Column 2', 'Column 3', 'Column 4', 'Column 5', 'Column 6'], // ข้อมูลเดิมใส่มาได้เลย
            cardStep: 0,
            canLeft: false,
            canRight: false,
            gapPx: 16, // ควรตรงกับ CSS gap (1rem≈16px)
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.measure()
            this.updateCanScroll()
            window.addEventListener('resize', this.onResize, { passive: true })
        })
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.onResize)
    },
    methods: {
        onResize() {
            this.measure()
            this.updateCanScroll()
        },
        measure() {
            const cards = this.$refs.cards
            if (!cards || cards.length === 0) return
            // กำหนดระยะ “เลื่อนทีละใบ”
            // เอาความกว้างใบแรก + gap (กันกรณี snap-center บนมือถือ)
            const w = cards[0].getBoundingClientRect().width
            this.cardStep = Math.round(w + this.gapPx)
        },
        go(dir) {
            const scroller = this.$refs.scroller
            if (!scroller) return
            scroller.scrollBy({ left: dir * this.cardStep, behavior: 'smooth' })
            // อัพเดทสถานะปุ่มหลังเลื่อน (ดีเลย์สั้น ๆ ให้ตำแหน่งขยับก่อน)
            clearTimeout(this._t)
            this._t = setTimeout(this.updateCanScroll, 250)
        },
        updateCanScroll() {
            const s = this.$refs.scroller
            if (!s) return
            // เช็คสุดซ้าย/สุดขวาแบบตรงไปตรงมา
            const max = s.scrollWidth - s.clientWidth
            const left = s.scrollLeft
            this.canLeft = left > 0
            this.canRight = left < max - 1
        },
    },
}
</script>

<style scoped>
/* ——— text parts (เหมือนเดิม) ——— */
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
    color: #3ca9ac;
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
    color: #115511;
}
.column-content2 img {
    width: 35px;
}

/* ——— wrapper ——— */
.category {
    position: relative;
    margin: auto;
    width: min(1100px, 80vw);
}

/* ——— scroller ——— */
.columns.scroller {
    display: flex;
    flex-wrap: nowrap !important;
    overflow-x: auto;
    overflow-y: hidden;
    gap: 1rem; /* ตรงกับ gapPx ใน script */
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    user-select: none;
    cursor: grab;
}
.columns.scroller::-webkit-scrollbar {
    display: none;
}

/* ——— card ——— */
.column {
    flex: 0 0 100%;
    scroll-snap-align: start; /* มือถือ: เริ่มที่ขอบซ้าย */
    min-height: 140px;
    background: white;
    border-radius: 12px;
    padding: 16px;
    text-align: center;
}

/* ——— desktop: คง 4 ใบ/แถว (ยังเลื่อนถ้ามีมากกว่า 4) ——— */
@media (min-width: 768px) {
    .column {
        flex: 0 0 calc(25% - 0.75rem);
    }
    .columns.scroller {
        padding: 0;
        scroll-padding: 0;
    }
}

/* ——— mobile: ให้ “โผล่ข้างๆ” เห็นนิดนึง + snap center ——— */
@media (max-width: 767.98px) {
    .columns.scroller {
        padding: 0 10vw; /* ทำให้มี peek ซ้าย/ขวา */
        scroll-padding: 0 10vw; /* ให้ snap เผื่อ padding */
    }
    .column {
        flex: 0 0 85%; /* ให้ใบหลักกว้าง 85% ของ viewport */
        scroll-snap-align: center;
    }
}

/* ——— arrows ——— */
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
</style>
