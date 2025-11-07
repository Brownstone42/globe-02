<template>
    <div class="category mt-6 mb-6">
        <span>สินค้าของเรา</span>

        <button class="arrow left" @click="go(-1)">‹</button>

        <div ref="scroller" class="columns scroller mt-4" @scroll.passive="onScroll">
            <div class="column" v-for="(item, i) in looped" :key="i" ref="cards">
                <img src="/images/example/product01.png" alt="" />
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
    name: 'homeCategory',
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

            // จับจังหวะเลื่อนเสร็จ (รองรับ browser ใหม่)
            this._onScrollEnd = () => this._normalizeAfterAuto()
            this.$refs.scroller?.addEventListener?.('scrollend', this._onScrollEnd, {
                passive: true,
            })
        })
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.onResize)
        this.$refs.scroller?.removeEventListener?.('scrollend', this._onScrollEnd)
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
            // เก็บ padding-left ไว้ใช้คำนวณ (รองรับ 10vw)
            const cs = getComputedStyle(scroller)
            this._paddingLeft = parseFloat(cs.paddingLeft) || 0

            scroller.style.scrollSnapType = 'x mandatory'
            this.isMeasuring = false
        },
        // ระยะระหว่าง "จุดกึ่งกลาง" ของการ์ดติดกัน
        stepPx() {
            return this.cardWidth + this.gap
        },
        // คำนวณตำแหน่ง scrollLeft เพื่อให้ "การ์ด i" อยู่กลางหน้าจอ
        indexToScrollLeft(iAbs) {
            const scroller = this.$refs.scroller
            const card = this.$refs.cards[iAbs]
            if (!card) return 0
            const centerOffset = (scroller.clientWidth - card.clientWidth) / 2
            // ต้องหัก padding-left ด้วย เพราะเราใส่ padding 0 10vw
            console.log(card.offsetLeft - this._paddingLeft - centerOffset)
            return card.offsetLeft - this._paddingLeft - centerOffset
        },
        go(delta) {
            const iNowAbs = this.currentAbsoluteIndex()
            const iNextAbs = iNowAbs + delta

            this._isAuto = true
            const scroller = this.$refs.scroller
            scroller.scrollTo({ left: this.indexToScrollLeft(iNextAbs), behavior: 'smooth' })

            // Fallback: ถ้าเบราเซอร์ไม่มี 'scrollend', ใช้ timeout แทน
            clearTimeout(this._autoEndTimer)
            this._autoEndTimer = setTimeout(this._normalizeAfterAuto, 420)
        },
        jumpTo(absIndex) {
            const scroller = this.$refs.scroller
            const snap = scroller.style.scrollSnapType
            scroller.style.scrollSnapType = 'none'
            scroller.scrollLeft = this.indexToScrollLeft(absIndex)
            requestAnimationFrame(() => {
                scroller.style.scrollSnapType = snap || 'x mandatory'
            })
        },
        onScroll() {
            if (this._isAuto) return // ป้องกัน recenter ชนกับ auto
            this.recenterIfNeeded() // สำหรับลากด้วยนิ้ว ยังใช้ logic เดิมได้
        },
        recenterIfNeeded() {
            if (this.isMeasuring || this._isAuto) return
            const iAbs = this.currentAbsoluteIndex()
            const n = this.n

            // เผื่อ buffer เล็กน้อยกันขอบ
            const leftEdge = this.startIndex - 2
            const rightEdge = this.startIndex + n + 2

            if (iAbs <= leftEdge) {
                // เลยซ้าย -> ขยับไปขวาด้วยระยะ n ใบ แบบ "มองไม่เห็น"
                this._instantShift(+n)
            } else if (iAbs >= rightEdge) {
                // เลยขวา -> ขยับไปซ้ายด้วยระยะ n ใบ แบบ "มองไม่เห็น"
                this._instantShift(-n)
            }
        },
        currentAbsoluteIndex() {
            const scroller = this.$refs.scroller
            const pos = scroller.scrollLeft
            const step = this.stepPx()
            const centerOffset = (scroller.clientWidth - this.cardWidth) / 2
            const base = pos + this._paddingLeft + centerOffset
            // แปลงเป็น index แบบต่อเนื่องแล้วปัดเป็นใบที่ใกล้สุด
            return Math.round(base / step)
        },
        currentLogicalIndex() {
            const iAbs = this.currentAbsoluteIndex()
            let idx = (iAbs - this.startIndex) % this.n
            if (idx < 0) idx += this.n
            return idx
        },
        _instantShift(offsetItems) {
            const scroller = this.$refs.scroller
            const snap = scroller.style.scrollSnapType
            scroller.style.scrollSnapType = 'none'
            scroller.scrollLeft += offsetItems * this.stepPx() // ระยะเท่ากับ n ใบพอดี
            // คืน snap กลับเฟรมถัดไป จะไม่มีการ "ดีด" ให้เห็น
            requestAnimationFrame(() => {
                scroller.style.scrollSnapType = snap || 'x mandatory'
            })
        },
        _normalizeAfterAuto() {
            // ปิดธง auto (ฟาก scrollend / timeout)
            this._isAuto = false

            const iAbs = this.currentAbsoluteIndex()
            const n = this.n
            const leftEdge = this.startIndex - 2
            const rightEdge = this.startIndex + n + 2

            if (iAbs > rightEdge || iAbs < leftEdge) {
                // map ไป logical แล้ววางใหม่ในบล็อกกลาง
                const logical = (((iAbs - this.startIndex) % n) + n) % n
                const targetAbs = this.startIndex + logical
                this._instantRelocateKeepVisual(iAbs, targetAbs)
            }
        },
        _instantRelocateKeepVisual(iFrom, iTo) {
            const scroller = this.$refs.scroller
            const snap = scroller.style.scrollSnapType

            // คำนวณตำแหน่งจริงก่อนและหลัง แล้วเลื่อนด้วย "ส่วนต่างจริง"
            const leftFrom = this.indexToScrollLeft(iFrom)
            const leftTo = this.indexToScrollLeft(iTo)
            const delta = leftTo - leftFrom

            scroller.style.scrollSnapType = 'none'
            scroller.scrollLeft += delta // ย้ายแบบทันที → ภาพนิ่งสนิท
            requestAnimationFrame(() => {
                scroller.style.scrollSnapType = snap || 'x mandatory'
            })
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
        flex: 0 0 calc(25% - 0.75rem);
    }
}
.arrow {
    position: absolute;
    top: 50%;
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
    right: -32px;
}
@media (max-width: 768px) {
    .arrow {
        width: 32px;
        height: 32px;
        font-size: 1.6rem;
    }
    .columns.scroller {
        padding: 0 10vw; /* ขอบซ้ายขวาให้เห็นการ์ดถัดไปนิดหน่อย */
        scroll-padding: 0 10vw;
    }
    .column {
        flex: 0 0 85%; /* เดิม 100% → เหลือ 85% เพื่อให้เห็นข้าง ๆ */
        scroll-snap-align: center; /* จัดให้อยู่กลางหน้าจอเวลา snap */
    }
    .arrow.left {
        left: 11%;
    }
    .arrow.right {
        right: 11%;
    }
}
</style>
