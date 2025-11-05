<template>
    <div class="category mt-6 mb-6">
        <span>ข่าวสาร</span>

        <button class="arrow left" @click="go(-1)">‹</button>

        <div ref="scroller" class="columns scroller mt-4" @scroll.passive="onScroll">
            <div class="column" v-for="(item, i) in looped" :key="i" ref="cards">
                <img src="/images/example/news01.png" alt="" />
                <div class="column-content">
                    <span class="content-topic1 ml-2">Disposable Gloves</span>
                    <span class="content-topic2 ml-2">ถุงมือใช้แล้วทิ้ง</span>
                </div>
                <div class="column-content2 mt-5">
                    <span class="ml-2">ดูสินค้าทั้งหมด</span>
                    <img class="mr-2" src="/images/example/button.png" alt="" />
                </div>
            </div>
        </div>

        <button class="arrow right" @click="go(1)">›</button>
    </div>
</template>

<script>
export default {
    name: 'homeNews',
    data() {
        return {
            items: ['Column 1', 'Column 2', 'Column 3', 'Column 4', 'Column 5', 'Column 6'],
            cardWidth: 0,
            gap: 0,
            isMeasuring: true,
        }
    },
    computed: {
        n() {
            return this.items.length
        },
        looped() {
            return [...this.items, ...this.items, ...this.items]
        },
        startIndex() {
            return this.n
        },
    },
    mounted() {
        this.$nextTick(() => {
            this.measure()
            this.jumpTo(this.startIndex)
            window.addEventListener('resize', this.onResize, { passive: true })
        })
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.onResize)
    },
    methods: {
        onResize() {
            const idx = this.currentLogicalIndex()
            this.measure()
            this.jumpTo(this.startIndex + idx)
        },
        measure() {
            const cards = this.$refs.cards
            const scroller = this.$refs.scroller
            if (!cards || cards.length < 2) return

            const r0 = cards[0].getBoundingClientRect()
            const r1 = cards[1].getBoundingClientRect()
            this.cardWidth = r0.width
            this.gap = Math.max(0, r1.left - r0.right)
            scroller.style.scrollSnapType = 'x mandatory'
            this.isMeasuring = false
        },
        stepPx() {
            return this.cardWidth + this.gap
        },
        go(delta) {
            const scroller = this.$refs.scroller
            scroller.scrollBy({ left: delta * this.stepPx(), behavior: 'smooth' })
            window.clearTimeout(this._t)
            this._t = window.setTimeout(this.recenterIfNeeded, 350)
        },
        jumpTo(absIndex) {
            const scroller = this.$refs.scroller
            const snap = scroller.style.scrollSnapType
            scroller.style.scrollSnapType = 'none'
            scroller.scrollLeft = absIndex * this.stepPx()
            requestAnimationFrame(() => {
                scroller.style.scrollSnapType = snap || 'x mandatory'
            })
        },
        onScroll() {
            this.recenterIfNeeded()
        },
        recenterIfNeeded() {
            if (this.isMeasuring) return
            const scroller = this.$refs.scroller
            const pos = scroller.scrollLeft
            const step = this.stepPx()
            const firstIndex = 0
            const lastIndex = this.looped.length - 1

            let i = Math.round(pos / step)

            if (i < this.startIndex) {
                const offset = (((i - this.startIndex) % this.n) + this.n) % this.n
                this.jumpTo(this.startIndex + offset)
                return
            }
            if (i > this.startIndex + this.n - 1) {
                const offset = (i - this.startIndex) % this.n
                this.jumpTo(this.startIndex + offset)
                return
            }
            if (i <= firstIndex) this.jumpTo(this.startIndex)
            if (i >= lastIndex) this.jumpTo(this.startIndex + this.n - 1)
        },
        currentLogicalIndex() {
            const iAbs = Math.round(this.$refs.scroller.scrollLeft / this.stepPx())
            let idx = (iAbs - this.startIndex) % this.n
            if (idx < 0) idx += this.n
            return idx
        },
    },
}
</script>

<style scoped>
.content-topic1 {
    font-size: 14pt;
    color: #115511;
    font-weight: bold;
}
.content-topic2 {
    font-size: 11pt;
    color: rgba(128, 128, 128, 0.76);
}
.column-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(128, 128, 128, 0.452);
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
@media (min-width: 768px) {
    .column {
        flex: 0 0 calc(33.3% - 0.75rem);
    }
}
.arrow {
    position: absolute;
    top: 40%;
    transform: translateY(-50%);
    background: white;
    border: none;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.18);
    border-radius: 999px;
    width: 40px;
    height: 40px;
    cursor: pointer;
    font-size: 1.5rem;
    line-height: 1;
    color: #333;
    z-index: 5;
}
.arrow.left {
    left: -32px;
}
.arrow.right {
    right: -26px;
}
@media (max-width: 768px) {
    .arrow {
        width: 48px;
        height: 48px;
        font-size: 1.8rem;
    }
}
</style>
