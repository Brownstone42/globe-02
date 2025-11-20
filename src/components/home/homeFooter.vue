<template>
    <section class="footer-wrap">
        <img class="footer-logo" src="/images/footer-logo.png" alt="" />
        <div class="footer-topic">
            <span>บริการด้วยคุณภาพ สร้างความไว้วางใจอย่างยั่งยืน</span>
            <span>พร้อมให้คำปรึกษาและดูแลอย่างใกล้ชิด โดยทีมงานผู้เชี่ยวชาญ</span>
        </div>

        <div class="columns">
            <div class="column product mt-6 pb-6">
                <span class="menu-title">สินค้าทั้งหมด</span>
                <ul class="menu">
                    <li>
                        ถุงมือ
                        <ul class="submenu">
                            <li>- ถุงมือใช้แล้วทิ้ง</li>
                            <li>- ถุงมือเฉพาะทาง</li>
                        </ul>
                    </li>
                    <li>อุปกรณ์ควบคุมการปนเปื้อน</li>
                    <li>ผลิตภัณฑ์ ESD</li>
                    <li>รองเท้า ESD</li>
                    <li>แผ่นรองและผ้า ESD</li>
                    <li>วัสดุยึดติดและทำความสะอาด</li>
                </ul>
            </div>

            <div class="column contact mt-6 pb-6">
                <div class="menu-topic">
                    <div class="logo">
                        <i class="fa-solid fa-mobile-screen-button"></i>
                    </div>
                    <div class="left">
                        <span class="menu-title">Call Center</span>
                    </div>
                </div>
                <div class="menu-topic mt-2">
                    <div class="logo"></div>
                    <div class="left">
                        <span>แผนกบริการลูกค้า</span>
                    </div>
                    <div class="right">
                        <span>: 02-860-1525</span>
                    </div>
                </div>
                <div class="menu-topic mt-2">
                    <div class="logo"></div>
                    <div class="left">
                        <span>ฝ่ายขาย</span>
                    </div>
                    <div class="right">
                        <span>: 091-010-8349</span>
                    </div>
                </div>
                <div class="menu-topic mt-2">
                    <div class="logo"></div>
                    <div class="all">
                        <span>ติดต่อได้ วันจันทร์ - วันศุกร์ 08.00 - 17.00 น.</span>
                    </div>
                </div>
                <div class="menu-topic mt-4">
                    <div class="logo">
                        <i class="fa-solid fa-envelope"></i>
                    </div>
                    <div class="left">
                        <span class="menu-title">Email</span>
                    </div>
                </div>
                <div class="menu-topic mt-2">
                    <div class="logo"></div>
                    <div class="all">
                        <span>admin@idealglobe.com</span>
                    </div>
                </div>
                <div class="menu-topic mt-5">
                    <img src="/images/footer-contact.png" alt="" />
                </div>
            </div>

            <div class="column map mt-6 pb-6">
                <div class="menu-topic">
                    <div class="logo">
                        <i class="fa-solid fa-location-dot"></i>
                    </div>
                    <div class="left">
                        <span class="menu-title">Address</span>
                    </div>
                </div>
                <div class="menu-topic mt-2">
                    <div class="logo"></div>
                    <div class="all">
                        <span>46 Soi Pracha Uthit 27, Bangmod</span>
                    </div>
                </div>
                <div class="menu-topic mt-2">
                    <div class="logo"></div>
                    <div class="all">
                        <span>Thungkru, Bangkok 10140</span>
                    </div>
                </div>
                <div class="menu-topic mt-4">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3877.0019418603474!2d100.50394717455727!3d13.657645599467553!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e2a3c05ecfe141%3A0xbd9fa16b85a649f4!2zaWRlYWwgR2xvYmUgQ28uLEx0ZC7guIjguLHguJTguIjguLPguKvguJnguYjguLLguKLguK3guLjguJvguIHguKPguJPguYwgQ2xlYW5yb29tIEVTRCDguYHguJrguJrguITguKPguJrguKfguIfguIjguKM!5e0!3m2!1sen!2sth!4v1762496582219!5m2!1sen!2sth"
                        width="325"
                        height="225"
                        style="border: 0"
                        allowfullscreen=""
                        loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>
        </div>
    </section>
    <div class="credit">
        <span>© 2025 idealglobe.co.th. All Rights Reserved.</span>
    </div>
</template>

<script>
export default {
    name: 'homeFooter',
}
</script>

<style scoped>
.footer-logo {
    position: absolute;
    width: 200px;
    left: calc(50% - 100px);
    top: -60px;
    z-index: 2;
    opacity: 0.75;
}
.credit {
    display: flex;
    background-color: black;
    color: rgba(255, 255, 255, 0.705);
    justify-content: center;
    padding-top: 10px;
    font-size: 18px;
}
iframe {
    padding-left: 10px;
}
img {
    width: 70%;
}
.right {
    width: 45%;
}
.left {
    width: 40%;
}
.logo {
    width: 15%;
}
.all {
    width: 87%;
}
.menu-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
}
.column {
    padding-left: 2%;
}
.menu-topic {
    display: flex;
}
.menu-topic > div {
    display: flex;
    align-items: center;
}
i {
    font-size: 25px;
}
.footer-wrap {
    background: linear-gradient(to bottom, #000 0%, #3d3b3b 100%);
    color: #ead5b7;
    padding: 40px 20px 20px 20px;
    position: relative;
}
.footer-topic {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-top: 50px !important;
}
.menu-title {
    font-weight: bold;
}
.menu {
    list-style: none;
    padding: 0;
    margin-top: 10px;
}
.menu > li {
    position: relative;
    margin-bottom: 8px;
    padding-left: 15px;
}
.menu > li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 7px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: radial-gradient(circle, #3ca9ac 0%, #3ca9ac 60%, #3ca9ac 100%);
    box-shadow: 0 0 6px #00ff80; /* เพิ่ม glow ให้ดูสว่าง */
}
.submenu {
    list-style: none;
    padding-left: 15px; /* เว้นระยะให้เห็นเป็นชั้น */
    margin-top: 5px;
}
.submenu li {
    font-size: 0.9em;
    color: #3ca9ac;
}
.column.product {
    padding-left: 50px;
}
@media (max-width: 768px) {
    .column.product {
        padding-left: 25%;
        padding-bottom: 0 !important;
    }
    .column.contact {
        padding-left: 10%;
        padding-bottom: 0 !important;
    }
    .column.map {
        padding-left: 10%;
        padding-bottom: 20px;
    }
}
</style>
