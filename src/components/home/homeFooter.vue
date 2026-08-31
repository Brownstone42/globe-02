<template>
    <footer class="site-footer">
        <section class="standards-strip" aria-labelledby="standards-strip-title">
            <div class="standards-strip-inner">
                <div class="standards-strip-copy">
                    <h2 id="standards-strip-title">มาตรฐานและการรับรองที่เกี่ยวข้องกับผลิตภัณฑ์ของเรา</h2>
                    <p>Product Standards, Testing &amp; Compliance</p>
                </div>
                <div class="standards-logo-space">
                    <div v-for="(logo, index) in standardLogos" :key="logo" class="standard-logo-item">
                        <img :src="logo" :alt="`มาตรฐานและการรับรอง ${index + 1}`" />
                    </div>
                </div>
            </div>
        </section>
        <div class="footer-inner">
            <div class="footer-brand">
                <img :src="footerLogo" alt="Ideal Globe" />
                <div>
                    <strong>
                        <span class="slogan-line">บริการด้วยคุณภาพ</span>
                        <span class="slogan-line">สร้างความไว้วางใจอย่างยั่งยืน</span>
                    </strong>
                    <span class="slogan-subtitle">
                        <span class="slogan-line">พร้อมให้คำปรึกษาและดูแลอย่างใกล้ชิด</span>
                        <span class="slogan-line">โดยทีมงานผู้เชี่ยวชาญ</span>
                    </span>
                </div>
            </div>

            <div class="footer-grid">
                <section class="footer-column product-column">
                    <h2>
                        <RouterLink :to="{ name: 'product-all' }">สินค้าทั้งหมด</RouterLink>
                    </h2>
                    <ul class="product-menu">
                        <li v-for="category in visibleCategories" :key="category.id">
                            <RouterLink
                                :to="{
                                    name: 'product-category',
                                    params: { category: category.slug },
                                }"
                            >
                                {{ categoryLabelThai(category) }}
                            </RouterLink>
                        </li>
                    </ul>
                </section>

                <section class="footer-column contact-column">
                    <h2>Call Center</h2>
                    <p class="contact-line">
                        สำนักงานใหญ่ :
                        <a href="tel:028601525">02-860-1525</a>,
                        <a href="tel:0972204888">097-220-4888</a>
                    </p>
                    <small>ติดต่อได้ วันจันทร์ - วันศุกร์ 08.00 - 17.00 น.</small>

                    <div class="footer-divider"></div>

                    <div class="sales-list">
                        <span>ฝ่ายขาย :</span>
                        <div>
                            <p><a href="tel:0910108349">091-010-8349</a> <small>(คุณนิด)</small></p>
                            <p><a href="tel:0972947975">097-294-7975</a> <small>(คุณแอน)</small></p>
                        </div>
                    </div>

                    <div class="footer-divider"></div>

                    <h2>Email</h2>
                    <a class="email-link" href="mailto:admin@idealglobe.com">
                        admin@idealglobe.com
                    </a>
                </section>

                <section class="footer-column address-column">
                    <h2>Address</h2>
                    <address>
                        46 ซอยประชาอุทิศ 27 แขวงบางมด<br />
                        เขตทุ่งครุ กรุงเทพฯ 10140
                    </address>
                    <iframe
                        title="แผนที่ Ideal Globe"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3877.0019418603474!2d100.50394717455727!3d13.657645599467553!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e2a3c05ecfe141%3A0xbd9fa16b85a649f4!2zaWRlYWwgR2xvYmUgQ28uLEx0ZC7guIjguLHguJTguIjguLPguKvguJnguYjguLLguKLguK3guLjguJvguIHguKPguJPguYwgQ2xlYW5yb29tIEVTRCDguYHguJrguJrguITguKPguJrguKfguIfguIjguKM!5e0!3m2!1sen!2sth!4v1762496582219!5m2!1sen!2sth"
                        loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"
                        allowfullscreen
                    ></iframe>
                </section>

                <section class="footer-column line-column">
                    <a
                        class="qr-link"
                        href="https://line.me/R/ti/p/%40idealglobe"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="เพิ่มเพื่อน LINE Ideal Globe"
                    >
                        <img :src="lineQr" alt="LINE QR Code @idealglobe" />
                    </a>
                    <small>LINE OA</small>
                    <p><strong>@IDEALGLOBE</strong> (มี@)</p>
                    <a
                        class="add-friend-btn"
                        href="https://lin.ee/qyMmToF"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="เพิ่มเพื่อน LINE @idealglobe"
                    >
                        <img
                            src="https://scdn.line-apps.com/n/line_add_friends/btn/th.png"
                            alt="LINE @idealglobe"
                            height="36"
                        />
                    </a>

                    <div class="social-row" aria-label="Social media">
                        <span><i class="fa-brands fa-facebook-f"></i></span>
                        <span><i class="fa-brands fa-line"></i></span>
                        <span><i class="fa-brands fa-youtube"></i></span>
                        <span><i class="fa-solid fa-envelope"></i></span>
                    </div>
                </section>
            </div>
        </div>

        <button class="back-to-top" type="button" aria-label="กลับขึ้นด้านบน" @click="scrollToTop">
            <i class="fa-solid fa-chevron-up"></i>
        </button>

        <div class="footer-credit">© 2026 idealglobe.com All Rights Reserved.</div>
    </footer>
</template>

<script>
import { mapStores } from 'pinia'
import { useCategoryStore } from '@/stores/categoryStore'
import { categoryLabelThai } from '@/utils/categoryLabels'
import footerLogo from '@/assets/images/branding/footer-logo.png'
import lineQr from '@/assets/images/contact/line-qr.png'
import standard01 from '@/assets/images/standards/01.png'
import standard02 from '@/assets/images/standards/02.png'
import standard03 from '@/assets/images/standards/03.png'
import standard04 from '@/assets/images/standards/04.png'
import standard05 from '@/assets/images/standards/05.png'

export default {
    name: 'homeFooter',
    data() {
        return {
            footerLogo,
            lineQr,
            standardLogos: [standard01, standard02, standard03, standard04, standard05],
        }
    },
    computed: {
        ...mapStores(useCategoryStore),
        visibleCategories() {
            return [...this.categoryStore.visibleCategories].sort(
                (a, b) => (a.order || 0) - (b.order || 0),
            )
        },
    },
    created() {
        if (!this.categoryStore.categories.length && !this.categoryStore.loading) {
            this.categoryStore.loadCategories()
        }
    },
    methods: {
        categoryLabelThai,
        scrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' })
        },
    },
}
</script>

<style scoped>
.site-footer {
    background: #23272d;
    color: #f4f4f4;
    position: relative;
}

.standards-strip {
    background: #f7f8fa;
    color: #23272d;
}

.standards-strip-inner {
    align-items: center;
    display: grid;
    gap: 24px;
    grid-template-columns: minmax(520px, 1.35fr) minmax(0, 1.65fr);
    margin: 0 auto;
    padding: 18px 0;
    width: min(1380px, 90vw);
}

.standards-strip-copy h2 {
    color: #23272d;
    font-size: clamp(1rem, 1.35vw, 1.3rem);
    font-weight: 700;
    line-height: 1.25;
    margin: 0 0 5px;
    white-space: nowrap;
}

.standards-strip-copy p {
    color: #48515e;
    font-size: clamp(0.85rem, 1.05vw, 1rem);
    margin: 0;
    white-space: nowrap;
}

.standards-logo-space {
    align-items: center;
    display: grid;
    gap: clamp(5px, 0.7vw, 11px);
    grid-template-columns: repeat(5, minmax(0, 1fr));
}

.standard-logo-item {
    align-items: center;
    display: flex;
    height: 54px;
    justify-content: center;
    min-width: 0;
}

.standard-logo-item img {
    display: block;
    height: 100%;
    object-fit: contain;
    width: 100%;
}


.footer-inner {
    margin: 0 auto;
    padding: 48px 0 66px;
    width: min(1380px, 90vw);
}

.footer-brand {
    align-items: center;
    display: flex;
    gap: 18px;
    justify-content: center;
    margin: 0 auto 70px;
}

.footer-brand > img {
    height: auto;
    width: 112px;
}

.footer-brand > div {
    display: flex;
    flex-direction: column;
}

.footer-brand strong {
    color: #fff;
    font-size: clamp(1.55rem, 2.25vw, 2.25rem);
    font-weight: 400;
    line-height: 1.25;
}

.footer-brand span {
    color: #fff;
    font-family: 'Sukhumvit-Thin', sans-serif;
    font-size: clamp(1rem, 1.45vw, 1.35rem);
    text-align: center;
}

.slogan-line + .slogan-line::before {
    content: ' ';
}

.footer-brand strong .slogan-line {
    font-family: inherit;
    font-size: inherit;
    text-align: inherit;
}

.footer-grid {
    display: grid;
    gap: 48px;
    grid-template-columns: 0.95fr 1.2fr 1.1fr 0.85fr;
}

.footer-column {
    min-width: 0;
}

.footer-column h2 {
    color: #c2a783;
    font-size: 1.2rem;
    font-weight: 700;
    margin: 0 0 12px;
}

.product-column h2 {
    color: #fff;
}

.product-column h2 a {
    color: #fff;
    text-decoration: none;
}

.product-column h2 a:hover {
    color: #a0805b;
}

.product-menu,
.product-menu ul {
    list-style: none;
    margin: 0;
    padding: 0;
}

.product-menu > li {
    font-size: 0.95rem;
    margin-bottom: 10px;
    padding-left: 14px;
    position: relative;
}

.product-menu > li a {
    color: #f4f4f4;
    text-decoration: none;
    transition: color 0.18s ease;
}

.product-menu > li a:hover {
    color: #a0805b;
}

.product-menu > li::before {
    color: #c2a783;
    content: '•';
    left: 0;
    position: absolute;
}

.product-menu ul {
    color: #c2a783;
    font-size: 0.88rem;
    margin: 4px 0 0 12px;
}

.contact-line,
.email-link,
.address-column address {
    color: #f4f4f4;
    font-size: 1rem;
    font-style: normal;
    line-height: 1.55;
    margin: 0;
}

.contact-line a,
.email-link {
    color: #f4f4f4;
    text-decoration: none;
}

.contact-column small {
    color: #c2a783;
    display: block;
    font-size: 0.75rem;
}

.sales-list {
    display: grid;
    font-size: 1rem;
    gap: 10px;
    grid-template-columns: auto minmax(0, 1fr);
}

.sales-list p {
    margin: 0 0 7px;
}

.sales-list a {
    color: #f4f4f4;
    text-decoration: none;
}

.sales-list small {
    color: #c2a783;
    display: inline;
    font-size: 0.78rem;
}

.footer-divider {
    background: #c2a783;
    height: 1px;
    margin: 14px 0;
    opacity: 0.9;
    width: 100%;
}

.address-column iframe {
    border: 0;
    display: block;
    height: 180px;
    margin-top: 14px;
    width: 100%;
}

.line-column {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
}

.qr-link img {
    border-radius: 22px;
    display: block;
    height: auto;
    width: min(190px, 100%);
}

.qr-link {
    cursor: pointer;
    display: block;
    position: relative;
    z-index: 2;
}

.line-column > small {
    color: #fff;
    font-size: 0.72rem;
    margin-top: 12px;
}

.line-column > p {
    color: #c2a783;
    font-size: 0.95rem;
    margin: 2px 0 8px;
}

.line-column > p strong {
    color: #c2a783;
    font-size: 1.2rem;
}

.add-friend-btn {
    display: inline-flex;
    border-radius: 10px;
    line-height: 0;
    overflow: hidden;
    text-decoration: none;
    transition: opacity 0.18s ease, transform 0.18s ease;
}

.add-friend-btn img {
    display: block;
    height: 36px;
    width: auto;
}

.add-friend-btn:hover {
    opacity: 0.9;
    transform: translateY(-1px);
}

.social-row {
    display: flex;
    gap: 10px;
    margin-top: 20px;
}

.social-row span {
    align-items: center;
    background: #a0805b;
    border-radius: 50%;
    color: #fff;
    display: inline-flex;
    height: 42px;
    justify-content: center;
    transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
    width: 42px;
}

.social-row span:hover { color: #fff; transform: translateY(-3px); }
.social-row span:nth-child(1):hover { background: #1877f2; }
.social-row span:nth-child(2):hover { background: #06c755; }
.social-row span:nth-child(3):hover { background: #ff0000; }
.social-row span:nth-child(4):hover { background: #52687a; }

.back-to-top {
    align-items: center;
    background: #80796e;
    border: 0;
    border-radius: 50%;
    bottom: 48px;
    color: #fff;
    cursor: pointer;
    display: flex;
    font-size: 1.55rem;
    height: 58px;
    justify-content: center;
    position: absolute;
    right: 24px;
    width: 58px;
}

.footer-credit {
    background: #111317;
    color: rgba(255, 255, 255, 0.72);
    font-size: 0.75rem;
    padding: 10px 80px;
    text-align: center;
}

@media (max-width: 1050px) {
    .standards-strip-inner {
        gap: 14px;
        grid-template-columns: 1fr;
    }

    .standards-logo-space { max-width: 760px; }

    .footer-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 600px) {
    .standards-strip-inner {
        display: block;
        padding: 16px 0;
        text-align: center;
        width: min(86vw, 460px);
    }

    .standards-strip-copy h2,
    .standards-strip-copy p { white-space: normal; }

    .standards-logo-space {
        gap: 10px;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        margin-top: 16px;
    }

    .standard-logo-item { height: 48px; }

    .footer-inner {
        padding: 42px 0 70px;
        width: min(86vw, 460px);
    }

    .footer-brand {
        flex-direction: column;
        margin-bottom: 50px;
        text-align: center;
    }

    .footer-brand > img {
        width: 88px;
    }

    .footer-brand .slogan-line {
        display: block;
    }

    .footer-brand .slogan-line + .slogan-line::before {
        content: none;
    }

    .footer-brand .slogan-subtitle {
        display: block;
        white-space: nowrap;
    }

    .footer-brand .slogan-subtitle .slogan-line {
        display: inline;
        font-size: clamp(0.72rem, 3.1vw, 0.9rem);
    }

    .footer-brand .slogan-subtitle .slogan-line + .slogan-line::before {
        content: ' ';
    }

    .footer-grid {
        gap: 42px;
        grid-template-columns: 1fr;
    }

    .line-column {
        align-items: center;
        text-align: center;
        width: 100%;
    }

    .line-column .qr-link {
        align-self: center;
        margin-left: auto;
        margin-right: auto;
        width: min(190px, 100%);
    }

    .line-column .qr-link img {
        width: 100%;
    }

    .line-column .social-row {
        justify-content: center;
    }

    .back-to-top {
        bottom: 54px;
        height: 48px;
        right: 14px;
        width: 48px;
    }

    .footer-credit {
        padding: 10px 62px;
    }
}
</style>
