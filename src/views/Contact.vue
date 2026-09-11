<template>
    <main class="contact-page">
        <section class="contact-hero" :style="{ '--contact-background': `url(${contactBackground})` }">
            <div class="contact-hero-content">
                <img :src="footerLogo" alt="Ideal Globe" />
                <div>
                    <h1>บริการด้วยคุณภาพ สร้างความไว้วางใจอย่างยั่งยืน</h1>
                    <p>พร้อมให้คำปรึกษาและดูแลอย่างใกล้ชิด โดยทีมงานผู้เชี่ยวชาญ</p>
                </div>
            </div>
        </section>

        <section class="sales-section" aria-labelledby="sales-heading">
            <h2 id="sales-heading">ทีมงานฝ่ายขาย</h2>
            <p class="flip-hint">
                <span class="desktop-flip-hint">วางเมาส์บนรูปเพื่อดู QR Code</span>
                <span class="mobile-line-hint">กดที่รูปเพื่อเพิ่มเพื่อนทาง Line</span>
            </p>

            <div class="sales-grid">
                <article
                    v-for="person in salesTeam"
                    :key="person.id"
                    class="sales-card"
                >
                    <a
                        class="sales-image-link"
                        :href="lineAddUrl(person)"
                        target="_blank"
                        rel="noopener noreferrer"
                        :aria-label="`เพิ่มเพื่อน Line ${person.name}`"
                        @click="handleSalesImageClick($event, person)"
                    >
                        <span class="sales-image-inner">
                            <span class="sales-image-face sales-image-front">
                                <img v-if="person.imageUrl" class="person-photo" :src="person.imageUrl" :alt="person.name" />
                                <span v-else class="person-placeholder" aria-hidden="true">
                                    <i class="fa-solid fa-user"></i>
                                    <small>รูปพนักงาน</small>
                                </span>
                            </span>
                            <span class="sales-image-face sales-image-back">
                                <img v-if="person.qrCodeUrl" class="qr-image" :src="person.qrCodeUrl" :alt="`QR Code ${person.name}`" />
                                <span v-else class="qr-placeholder" aria-hidden="true">
                                    <i class="fa-solid fa-qrcode"></i>
                                    <small>QR Code</small>
                                </span>
                            </span>
                        </span>
                    </a>

                    <span class="person-info">
                        <strong>{{ person.name }}</strong>
                        <small>{{ displayLine(person) }}</small>
                    </span>
                </article>
            </div>
        </section>

        <section class="contact-details">
            <div class="office-details">
                <div class="detail-block">
                    <h2>ติดต่อสำนักงานใหญ่</h2>
                    <p><strong>Call :</strong> <a href="tel:028601525">02-860-1525</a></p>
                    <p><strong>Email :</strong> <a href="mailto:admin@idealglobe.com">admin@idealglobe.com</a></p>
                </div>

                <div class="detail-block">
                    <h2>ติดต่อแผนกฝ่ายขาย</h2>
                    <p><strong>Call :</strong> <a href="tel:0972204888">097-220-4888</a></p>
                </div>

                <div class="detail-block">
                    <h2>ติดต่อฝ่ายบัญชี</h2>
                    <p><strong>Call :</strong> <a href="tel:028601525">02-860-1525</a> ต่อ 306</p>
                    <p><strong>Email :</strong> <a href="mailto:idealglobe.account@gmail.com">idealglobe.account@gmail.com</a></p>
                    <small>เวลาทำการ วันจันทร์ - วันศุกร์ 08.00 - 17.00 น.</small>
                </div>

                <div class="detail-block">
                    <h2>ที่อยู่จัดส่งเอกสาร</h2>
                    <address>บริษัท ไอเดียลโกลบ จำกัด<br />46 ซอยประชาอุทิศ 27 แขวงบางมด เขตทุ่งครุ กรุงเทพฯ 10140</address>
                </div>
            </div>

            <div class="map-panel">
                <h2>Link ที่อยู่ Google Maps</h2>
                <iframe
                    title="แผนที่ Ideal Globe"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3877.0019418603474!2d100.50394717455727!3d13.657645599467553!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e2a3c05ecfe141%3A0xbd9fa16b85a649f4!2zaWRlYWwgR2xvYmUgQ28uLEx0ZC7guIjguLHguJTguIjguLPguKvguJnguYjguLLguKLguK3guLjguJvguIHguKPguJPguYwgQ2xlYW5yb29tIEVTRCDguYHguJrguJrguITguKPguJrguKfguIfguIjguKM!5e0!3m2!1sen!2sth!4v1762496582219!5m2!1sen!2sth"
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                    allowfullscreen
                ></iframe>
            </div>
        </section>

        <section class="contact-social" aria-labelledby="contact-social-heading">
            <div class="contact-social-inner">
                <h2 id="contact-social-heading">ติดตามเราได้ที่</h2>
                <div class="contact-social-links">
                    <span class="social-circle" aria-label="Facebook">
                        <i class="fa-brands fa-facebook-f"></i>
                    </span>
                    <a
                        class="social-circle"
                        href="https://line.me/R/ti/p/%40idealglobe"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LINE @idealglobe"
                    >
                        <i class="fa-brands fa-line"></i>
                    </a>
                    <span class="social-circle" aria-label="YouTube">
                        <i class="fa-brands fa-youtube"></i>
                    </span>
                    <a class="social-circle" href="mailto:admin@idealglobe.com" aria-label="Email admin@idealglobe.com">
                        <i class="fa-solid fa-envelope"></i>
                    </a>
                </div>
            </div>
        </section>
    </main>
</template>

<script>
import contactBackground from '@/assets/images/contact/background.png'
import footerLogo from '@/assets/images/branding/footer-logo.png'
import { mapStores } from 'pinia'
import { useSalesStore } from '@/stores/salesStore'

export default {
    name: 'ContactView',
    data() {
        return {
            contactBackground,
            footerLogo,
        }
    },
    computed: {
        ...mapStores(useSalesStore),
        salesTeam() {
            return this.salesStore.visibleSales
        },
    },
    created() {
        this.salesStore.loadSales()
    },
    methods: {
        displayLine(person) {
            return person.lineId ? `Line ID : ${person.lineId}` : 'Line ID : -'
        },
        lineAddUrl(person) {
            const savedLink = String(person.link || '').trim()
            if (savedLink) return savedLink
            const lineId = String(person.lineId || '').trim()
            if (!lineId) return '#'
            if (/^https?:\/\//i.test(lineId)) return lineId
            return `https://line.me/R/ti/p/${encodeURIComponent(lineId)}`
        },
        handleSalesImageClick(event, person) {
            if (!person.link && !person.lineId) event.preventDefault()
        },
    },
}
</script>

<style scoped>
.contact-page { background: #fff; color: #23272d; }
.contact-hero {
    align-items: center;
    background: linear-gradient(rgba(25, 31, 38, 0.88), rgba(25, 31, 38, 0.88)), var(--contact-background) center / cover no-repeat;
    display: flex;
    min-height: 245px;
    padding: 42px 5vw;
}
.contact-hero-content { align-items: center; display: flex; gap: 20px; justify-content: center; margin: auto; text-align: left; }
.contact-hero-content img { height: auto; width: 118px; }
.contact-hero-content h1 { color: #fff; font-size: clamp(1.45rem, 2.2vw, 2rem); font-weight: 400; margin: 0; }
.contact-hero-content p { color: #fff; font-size: clamp(0.95rem, 1.4vw, 1.2rem); margin: 3px 0 0; }
.sales-section { margin: 0 auto; padding: 60px 0 72px; width: min(1180px, 90vw); }
.sales-section > h2 { color: #205266; font-size: 1.45rem; margin: 0; text-align: center; }
.flip-hint { color: #8a9299; font-size: 0.82rem; margin: 5px 0 30px; text-align: center; }
.mobile-line-hint { display: none; }
.sales-grid { display: grid; gap: 34px; grid-template-columns: repeat(4, minmax(0, 1fr)); }
.sales-card { background: #fff; border: 1px solid #e4e1db; border-radius: 18px; box-shadow: 0 5px 16px rgba(35, 39, 45, 0.14); overflow: hidden; }
.sales-image-link { aspect-ratio: 140 / 170; display: block; perspective: 1100px; text-decoration: none; width: 100%; }
.sales-image-inner { display: block; height: 100%; position: relative; transform-style: preserve-3d; transition: transform 0.75s cubic-bezier(0.22, 1, 0.36, 1); width: 100%; }
.sales-image-face {
    backface-visibility: hidden;
    display: flex;
    inset: 0;
    overflow: hidden;
    position: absolute;
}
.sales-image-back { align-items: center; background: #ead9c7; justify-content: center; transform: rotateY(180deg); }
.person-placeholder { align-items: center; background: linear-gradient(150deg, #fff 0%, #f3dfb5 68%, #14636d 68%); color: #a0805b; display: flex; flex-direction: column; height: 100%; justify-content: center; width: 100%; }
.person-placeholder i { font-size: 6rem; }
.person-photo { display: block; height: 100%; object-fit: cover; width: 100%; }
.person-placeholder small { margin-top: 12px; }
.person-info {
    align-items: center;
    background: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 105px;
    padding: 14px 12px 18px;
    text-align: center;
}
.person-info strong { color: #a0805b; font-size: 1.45rem; font-weight: 700; line-height: 1.2; }
.person-info small { color: #23272d; font-size: 1rem; line-height: 1.35; margin-top: 8px; }
.qr-placeholder { align-items: center; border: 2px dashed #a0805b; border-radius: 10px; color: #a0805b; display: flex; flex-direction: column; height: 155px; justify-content: center; width: 155px; }
.qr-placeholder i { font-size: 5rem; }
.qr-image { background: transparent; border-radius: 0; height: 72%; mix-blend-mode: multiply; object-fit: contain; padding: 0; width: 72%; }
@media (hover: hover) and (min-width: 601px) {
    .sales-image-link:hover .sales-image-inner { transform: rotateY(180deg); }
}
.contact-details { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); margin: 0 auto; max-width: 1180px; width: 90vw; }
.office-details { border-bottom: 1px solid #d3bd97; border-top: 1px solid #d3bd97; padding: 28px 30px 22px; }
.detail-block + .detail-block { margin-top: 24px; }
.detail-block h2, .map-panel h2 { color: #a0805b; font-size: 1.2rem; margin: 0 0 8px; }
.detail-block p, .detail-block address { font-size: 0.9rem; font-style: normal; line-height: 1.55; margin: 0; }
.detail-block a { color: #23272d; text-decoration: none; }
.detail-block small { color: #a0805b; }
.map-panel { background: #eee6d9; padding: 38px 42px; }
.map-panel iframe { border: 0; height: 270px; width: 100%; }
.contact-social { background: #23272d; color: #fff; padding: 42px 5vw; }
.contact-social-inner { align-items: center; display: flex; gap: 54px; justify-content: center; margin: 0 auto; max-width: 980px; }
.contact-social h2 { color: #fff; font-size: 1.35rem; margin: 0; }
.contact-social-links { display: flex; gap: 18px; }
.social-circle {
    align-items: center;
    background: #a38c67;
    border-radius: 50%;
    color: #fff;
    display: inline-flex;
    font-size: 1.55rem;
    height: 64px;
    justify-content: center;
    text-decoration: none;
    transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
    width: 64px;
}
.social-circle:hover { color: #fff; transform: translateY(-3px); }
.social-circle:nth-child(1):hover { background: #1877f2; }
.social-circle:nth-child(2):hover { background: #06c755; }
.social-circle:nth-child(3):hover { background: #ff0000; }
.social-circle:nth-child(4):hover { background: #52687a; }
@media (max-width: 900px) {
    .sales-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .contact-details { grid-template-columns: 1fr; }
}
@media (max-width: 600px) {
    .contact-hero { min-height: 220px; padding: 34px 24px; }
    .contact-hero-content { flex-direction: column; text-align: center; }
    .contact-hero-content img { width: 92px; }
    .sales-section { padding: 46px 0 54px; }
    .sales-grid { gap: 18px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .desktop-flip-hint { display: none; }
    .mobile-line-hint { display: inline; }
    .sales-image-inner { transform: none !important; }
    .sales-image-back { display: none; }
    .person-placeholder i { font-size: 4rem; }
    .person-info { min-height: 82px; padding: 10px 7px 13px; }
    .person-info strong { font-size: 1rem; }
    .person-info small { font-size: 0.75rem; margin-top: 5px; }
    .qr-placeholder { height: 105px; width: 105px; }
    .qr-image { height:105px; width:105px; }
    .qr-placeholder i { font-size: 3.4rem; }
    .sales-card-back > strong { font-size: 0.86rem; }
    .sales-card-back > small { font-size: 0.7rem; }
    .office-details { padding-inline: 4px; }
    .map-panel { padding: 28px 20px; }
    .contact-social { padding: 34px 20px; }
    .contact-social-inner { flex-direction: column; gap: 22px; }
    .contact-social-links { gap: 12px; }
    .social-circle { font-size: 1.2rem; height: 52px; width: 52px; }
}
</style>
