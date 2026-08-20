<template>
    <footer class="site-footer">
        <div class="footer-inner">
            <div class="footer-brand">
                <img src="/images/footer-logo.png" alt="Ideal Globe" />
                <div>
                    <strong>บริการด้วยคุณภาพ สร้างความไว้วางใจอย่างยั่งยืน</strong>
                    <span>พร้อมให้คำปรึกษาและดูแลอย่างใกล้ชิด โดยทีมงานผู้เชี่ยวชาญ</span>
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
                                {{ category.name }}
                            </RouterLink>
                        </li>
                    </ul>
                </section>

                <section class="footer-column contact-column">
                    <h2>Call Center</h2>
                    <p class="contact-line">สำนักงานใหญ่ : <a href="tel:028601525">02-860-1525</a></p>
                    <small>ติดต่อได้ วันจันทร์ - วันศุกร์ 08.00 - 17.00 น.</small>

                    <div class="footer-divider"></div>

                    <div class="sales-list">
                        <span>ฝ่ายขาย :</span>
                        <div>
                            <p><a href="tel:0972204888">097-220-4888</a> <small>(คุณบราวน์)</small></p>
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
                        <img src="/images/example/qr.png" alt="LINE QR Code @idealglobe" />
                    </a>
                    <small>LINE OA</small>
                    <p>@ <strong>IDEAL GLOBE</strong> (มี@)</p>
                    <a
                        class="add-friend-btn"
                        href="https://line.me/R/ti/p/%40idealglobe"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <i class="fa-brands fa-line"></i>
                        Add Friends
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

export default {
    name: 'homeFooter',
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
    align-items: center;
    background: #66bd46;
    border-radius: 6px;
    color: #fff;
    display: inline-flex;
    font-size: 0.82rem;
    gap: 5px;
    padding: 6px 10px;
    text-decoration: none;
}

.social-row {
    display: flex;
    gap: 10px;
    margin-top: 20px;
}

.social-row span {
    align-items: center;
    background: #fff;
    border-radius: 50%;
    color: #23272d;
    display: inline-flex;
    height: 42px;
    justify-content: center;
    width: 42px;
}

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
    .footer-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 600px) {
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

    .footer-grid {
        gap: 42px;
        grid-template-columns: 1fr;
    }

    .line-column {
        align-items: center;
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
