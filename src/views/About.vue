<template>
    <main class="about-page">
        <section class="about-hero" :style="{ backgroundImage: `url(${aboutBackground})` }">
            <div v-about-reveal class="hero-content about-reveal">
                <p><strong>มั่นใจในคุณภาพสินค้าและมาตรฐานการบริการ</strong></p>
                <p>ด้วยประสบการณ์ยาวนานกว่า</p>
                <img :src="experienceImage" alt="ประสบการณ์กว่า 30 ปี" />
            </div>
        </section>

        <section class="history-section" aria-labelledby="history-heading">
            <h1 id="history-heading" class="sr-only">ประวัติความเป็นมา Ideal Globe</h1>

            <div v-about-reveal class="desktop-history about-reveal">
                <svg class="timeline-path" viewBox="0 0 1200 680" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M35 55 H860 Q910 55 910 105 V285 Q910 335 860 335 H210 Q160 335 160 385 V575 Q160 625 210 625 H1110" />
                    <g>
                        <circle cx="35" cy="55" r="7" />
                        <circle cx="400" cy="55" r="7" />
                        <circle cx="910" cy="105" r="7" />
                        <circle cx="160" cy="375" r="7" />
                        <circle cx="400" cy="335" r="7" />
                        <circle cx="780" cy="335" r="7" />
                        <circle cx="400" cy="625" r="7" />
                        <circle cx="650" cy="625" r="7" />
                        <circle cx="940" cy="625" r="7" />
                    </g>
                </svg>

                <article class="history-card year-2001">
                    <h2>2001</h2>
                    <p>ก่อตั้งบริษัท ไอเดียลโกลบ จำกัด</p>
                    <img :src="officeImage" alt="สำนักงานใหญ่ Ideal Globe" />
                </article>
                <article class="history-card year-2003">
                    <h2>2003</h2>
                    <p>ขยายกลุ่มผลิตภัณฑ์<br />จัดจำหน่ายอุปกรณ์ Cleanroom, ESD<br />และอุปกรณ์สำหรับภาคอุตสาหกรรม</p>
                </article>
                <article class="history-card year-2007">
                    <h2>2007</h2>
                    <img :src="warehouseImage" alt="คลังสินค้า Ideal Globe" />
                    <p>เปิดคลังสินค้าแห่งแรก<br />รองรับสต็อกสินค้าและจัดส่งทั่วประเทศ</p>
                </article>
                <article class="history-card year-2018">
                    <h2>2018</h2>
                    <p>ขยายคลังสินค้า เพื่อเพิ่ม<br />ความพร้อมด้านสต็อกและ<br />การจัดส่งทั่วประเทศ</p>
                </article>
                <article class="history-card year-2017">
                    <h2>2017</h2>
                    <p>เปิดบริการ Industrial Consulting<br />การเลือกใช้อุปกรณ์ให้เหมาะสมกับกระบวนการผลิต<br />เพื่อเพิ่มประสิทธิภาพและลดต้นทุน</p>
                </article>
                <article class="history-card year-2011">
                    <h2>2011</h2>
                    <p>ขยายกลุ่มผลิตภัณฑ์สำหรับอุตสาหกรรม<br />อิเล็กทรอนิกส์ อาหาร เวชภัณฑ์<br />ห้องปฏิบัติการ และโรงงานทั่วไป</p>
                </article>
                <article class="history-card year-2022">
                    <h2>2022</h2>
                    <p>พัฒนาระบบคลังสินค้าและโลจิสติกส์</p>
                </article>
                <article class="history-card year-2023">
                    <h2>2023</h2>
                    <p>เปิดสำนักงานใหญ่แห่งใหม่<br />เพิ่มกำลังจัดเก็บสินค้า</p>
                </article>
                <article class="history-card year-future">
                    <h2>FUTURE</h2>
                    <p>มุ่งสู่ความยั่งยืน (Sustainability)<br />เริ่มพัฒนาระบบจัดทำเอกสาร chemSHERPA<br />เพื่อสนับสนุนการจัดการสารเคมี การรีไซเคิล<br />และข้อกำหนดด้านสิ่งแวดล้อมของอุตสาหกรรม</p>
                </article>
            </div>

            <div class="mobile-history">
                <article
                    v-for="item in mobileHistory"
                    :key="item.year"
                    v-mobile-year-reveal
                    class="mobile-history-row mobile-year-reveal"
                    :class="{ 'has-image': item.image }"
                >
                    <h2>{{ item.year }}</h2>
                    <span class="timeline-dot" aria-hidden="true"></span>
                    <div>
                        <p>{{ item.text }}</p>
                        <img v-if="item.image" :src="item.image" :alt="item.alt" />
                    </div>
                </article>
            </div>
        </section>

        <section v-about-reveal class="trust-section about-reveal">
            <img :src="footerLogo" alt="Ideal Globe" />
            <div class="trust-desktop-content">
                <h2>พันธมิตรที่คุณเชื่อมั่นได้</h2>
                <p>ด้วยประสบการณ์ยาวนาน ความพร้อมด้านสินค้า และการบริการที่ใส่ใจในทุกขั้นตอน</p>
                <p>ทำให้ไอเดียลโกลบ เป็นผู้ให้บริการที่องค์กรข้ามชาติและโรงงานชั้นนำไว้วางใจเลือกใช้ตลอดกว่า 30 ปี</p>
            </div>
            <div class="trust-mobile-content">
                <p>BETTER PROTECTION <strong>BETTER PRODUCTION</strong></p>
                <h2>ยกระดับการป้องกัน สู่มาตรฐานการผลิตที่เหนือกว่า</h2>
            </div>
        </section>
    </main>
</template>

<script>
import experienceImage from '@/assets/images/about/30.png'
import aboutBackground from '@/assets/images/about/background.png'
import officeImage from '@/assets/images/about/office.png'
import warehouseImage from '@/assets/images/about/warehouse.png'
import footerLogo from '@/assets/images/branding/footer-logo.png'

const aboutRevealDirective = {
    mounted(element) {
        const isDesktop = window.matchMedia('(min-width: 1201px)').matches
        if (!isDesktop) {
            element.classList.add('is-revealed')
            return
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return
                element.classList.add('is-revealed')
                observer.disconnect()
            },
            {
                threshold: 0.08,
                rootMargin: '0px 0px -10% 0px',
            },
        )

        observer.observe(element)
        element._aboutRevealObserver = observer
    },
    unmounted(element) {
        element._aboutRevealObserver?.disconnect()
    },
}

const mobileYearRevealDirective = {
    mounted(element) {
        const usesVerticalTimeline = window.matchMedia('(max-width: 1200px)').matches
        if (!usesVerticalTimeline) {
            element.classList.add('is-revealed')
            return
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return
                element.classList.add('is-revealed')
                observer.disconnect()
            },
            {
                threshold: 0.08,
                rootMargin: '0px 0px -8% 0px',
            },
        )

        observer.observe(element)
        element._mobileYearRevealObserver = observer
    },
    unmounted(element) {
        element._mobileYearRevealObserver?.disconnect()
    },
}

export default {
    name: 'AboutView',
    directives: {
        aboutReveal: aboutRevealDirective,
        mobileYearReveal: mobileYearRevealDirective,
    },
    data() {
        return {
            experienceImage,
            aboutBackground,
            officeImage,
            warehouseImage,
            footerLogo,
            mobileHistory: [
                {
                    year: '2001',
                    text: 'ก่อตั้งบริษัท ไอเดียลโกลบ จำกัด',
                    image: officeImage,
                    alt: 'สำนักงานใหญ่ Ideal Globe',
                },
                {
                    year: '2003',
                    text: 'ขยายกลุ่มผลิตภัณฑ์ จัดจำหน่ายอุปกรณ์ Cleanroom, อุปกรณ์ป้องกันไฟฟ้าสถิต Anti-Static และอุปกรณ์สำหรับภาคอุตสาหกรรม',
                },
                {
                    year: '2007',
                    text: 'เปิดคลังสินค้าแห่งแรก รองรับสต็อกสินค้าและจัดส่งทั่วประเทศ',
                    image: warehouseImage,
                    alt: 'คลังสินค้า Ideal Globe',
                },
                {
                    year: '2011',
                    text: 'ขยายกลุ่มผลิตภัณฑ์สำหรับอุตสาหกรรมอิเล็กทรอนิกส์ อาหาร เวชภัณฑ์ ห้องปฏิบัติการ และโรงงานทั่วไป',
                },
                {
                    year: '2017',
                    text: 'เปิดบริการ Industrial Consulting การเลือกใช้อุปกรณ์ให้เหมาะสมกับกระบวนการผลิต เพื่อเพิ่มประสิทธิภาพและลดต้นทุน',
                },
                {
                    year: '2018',
                    text: 'ขยายคลังสินค้า เพื่อเพิ่มความพร้อมด้านสต็อกและการจัดส่งทั่วประเทศ',
                },
                {
                    year: '2022',
                    text: 'พัฒนาระบบคลังสินค้าและโลจิสติกส์',
                },
                {
                    year: '2023',
                    text: 'เปิดสำนักงานใหญ่แห่งใหม่ เพิ่มกำลังจัดเก็บสินค้า',
                },
                {
                    year: 'FUTURE',
                    text: 'มุ่งสู่ความยั่งยืน (Sustainability) เริ่มพัฒนาระบบจัดทำเอกสาร chemSHERPA เพื่อสนับสนุนการจัดการสารเคมี การรีไซเคิล และข้อกำหนดด้านสิ่งแวดล้อมของอุตสาหกรรม',
                },
            ],
        }
    },
}
</script>

<style scoped>
.about-page { background: #23272d; color: #f7f3eb; overflow: hidden; }
.about-hero { background-color: #15191e; background-position: center; background-repeat: no-repeat; background-size: cover; min-height: 480px; position: relative; }
.hero-content { left: 50%; position: absolute; text-align: center; top: 68%; transform: translate(-50%, -50%); width: min(720px, 90vw); }
.hero-content p { font-size: clamp(1.45rem, 2.25vw, 2.05rem); line-height: 1.25; margin: 0; }
.hero-content strong { color: #dcc293; font-weight: 500; }
.hero-content img { display: block; margin: 34px auto 0; width: min(350px, 48vw); }
.history-section { background: #23272d; padding: 8px 0 92px; }
.desktop-history { height: 760px; margin: 0 auto; max-width: 1320px; position: relative; width: 84vw; }
.timeline-path { height: 680px; inset: 12px 0 auto; position: absolute; width: 100%; }
.timeline-path path { fill: none; stroke: #e1c184; stroke-linecap: round; stroke-width: 5; }
.timeline-path circle { fill: #e1c184; }
.history-card { position: absolute; z-index: 1; }
.history-card h2 { color: #f6f1e8; font-size: 2rem; font-weight: 700; line-height: 1; margin: 0 0 10px; }
.history-card p { font-size: 1rem; font-weight: 600; line-height: 1.5; margin: 0; }
.history-card img { display: block; object-fit: cover; }
.year-2001 { left: 0; top: 78px; }.year-2001 img { margin-top: 10px; width: 235px; }
.year-2003 { left: 30.3%; top: 78px; }
.year-2007 { right: 0; top: 58px; width: 245px; }.year-2007 img { height: 132px; margin: 10px 0 14px; width: 230px; }
.year-2018 { left: -5%; text-align: right; top: 365px; width: 220px; }
.year-2017 { left: 23%; top: 365px; }
.year-2011 { left: 62%; top: 365px; }
.year-2022 { left: 23%; top: 655px; }.year-2023 { left: 51.1%; top: 655px; }.year-future { left: 75%; top: 650px; }
.mobile-history { display: none; }
.trust-section { background: #ae8c62; display: block; margin: 0; max-width: none; padding: 58px 28px; text-align: center; }
.trust-section img,
.trust-desktop-content { display: none; }
.trust-mobile-content { display: block; margin: 0 auto; max-width: 880px; }
.trust-mobile-content p { color: #fff; font-size: 1.15rem; line-height: 1.35; margin: 0; }
.trust-mobile-content h2 { color: #fff; font-size: 1.5rem; font-weight: 700; line-height: 1.4; margin: 6px 0 0; }
.sr-only { height: 1px; margin: -1px; overflow: hidden; padding: 0; position: absolute; width: 1px; clip: rect(0, 0, 0, 0); }

@media (min-width: 1201px) {
    .hero-content.about-reveal {
        opacity: 0;
        transform: translate(-50%, calc(-50% + 38px));
        transition:
            opacity 0.85s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.85s cubic-bezier(0.22, 1, 0.36, 1);
    }

    .hero-content.about-reveal.is-revealed {
        opacity: 1;
        transform: translate(-50%, -50%);
    }

    .desktop-history.about-reveal,
    .trust-section.about-reveal {
        opacity: 0;
        transform: translateY(44px);
        transition:
            opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
    }

    .desktop-history.about-reveal.is-revealed,
    .trust-section.about-reveal.is-revealed {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 1200px) {
    .history-section { padding: 18px 0 30px; }
    .desktop-history { display: none; }
    .mobile-history {
        --dot-size: 14px;
        --timeline-gap: 18px;
        --year-column: 80px;
        display: block;
        margin: 0 auto;
        padding: 0 28px 30px;
        width: min(88vw, 720px);
    }
    .mobile-history-row {
        display: grid;
        gap: var(--timeline-gap);
        grid-template-columns: var(--year-column) var(--dot-size) minmax(0, 1fr);
        min-height: 142px;
        position: relative;
    }
    .mobile-history-row.has-image { min-height: 220px; }
    .mobile-history-row::after {
        background: #d8b574;
        content: '';
        height: 100%;
        left: calc(var(--year-column) + var(--timeline-gap) + (var(--dot-size) / 2) - 1.5px);
        position: absolute;
        top: 7px;
        width: 3px;
    }
    .mobile-history-row:last-child::after { height: calc(100% + 53px); }
    .mobile-history-row h2 { font-size: 1.7rem; font-weight: 700; line-height: 1; margin: 0; text-align: right; }
    .mobile-history-row:last-child h2 { font-size: 1.15rem; white-space: nowrap; }
    .mobile-history-row.mobile-year-reveal {
        opacity: 0;
        transform: translateY(34px) scale(0.98);
        transition:
            opacity 0.72s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.72s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .mobile-history-row.mobile-year-reveal.is-revealed {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
    .timeline-dot { background: #d8b574; border-radius: 50%; height: var(--dot-size); position: relative; width: var(--dot-size); z-index: 1; }
    .mobile-history-row p { font-size: 1rem; font-weight: 600; line-height: 1.5; margin: -4px 0 14px; }
    .mobile-history-row img { display: block; height: 128px; object-fit: cover; width: min(100%, 280px); }
}

@media (max-width: 768px) {
    .about-hero { min-height: 430px; }
    .hero-content { top: 63%; }
    .hero-content p { font-size: clamp(1.05rem, 5.2vw, 1.4rem); }
    .hero-content p:first-child {
        font-size: clamp(0.78rem, 3.65vw, 0.95rem);
        white-space: nowrap;
    }
    .hero-content img { margin-top: 28px; width: min(265px, 62vw); }
    .history-section { padding: 10px 0 14px; }
    .mobile-history {
        --dot-size: 12px;
        --timeline-gap: 14px;
        --year-column: 62px;
        padding: 0 22px 24px;
        width: min(92vw, 560px);
    }
    .mobile-history-row { min-height: 138px; }
    .mobile-history-row.has-image { min-height: 205px; }
    .mobile-history-row h2 { font-size: 1.55rem; font-weight: 700; line-height: 1; margin: 0; text-align: right; }
    .mobile-history-row:last-child h2 { font-size: 0.9rem; }
    .mobile-history-row:last-child::after { height: calc(100% + 31px); }
    .mobile-history-row p { font-size: 0.85rem; font-weight: 600; line-height: 1.45; margin: -2px 0 12px; }
    .mobile-history-row img { display: block; height: 108px; object-fit: cover; width: min(100%, 230px); }
    .trust-section { padding: 52px 28px; }
    .trust-mobile-content p { color: #fff; font-size: 1rem; line-height: 1.35; }
    .trust-mobile-content h2 { color: #fff; font-size: 1.25rem; font-weight: 700; line-height: 1.4; margin: 6px 0 0; }
}
</style>
