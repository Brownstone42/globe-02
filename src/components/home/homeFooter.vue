<template>
    <section class="contact-section">
        <div class="overlay">
            <div class="columns">
                <div class="column">
                    <span class="step-header">ขั้นตอนการสั่งสินค้า</span>

                    <div class="step mt-6">
                        <div class="step-order">
                            <div class="step-dot">1</div>
                        </div>
                        <div class="step-content">
                            <span class="step-topic">สอบถามและสั่งซื้อ</span>
                            <span class="step-body"
                                >ลูกค้าสามารถสอบถามข้อมูลสินค้าและบริการผ่านช่องทางต่างๆ
                                ที่สะดวก</span
                            >
                        </div>
                    </div>

                    <div class="step mt-6">
                        <div class="step-order">
                            <div class="step-dot">2</div>
                        </div>
                        <div class="step-content">
                            <span class="step-topic">รับใบเสนอราคา</span>
                            <span class="step-body"
                                >เราจะจัดทำใบเสนอราคาตามความต้องการของลูกค้าอย่างถูกต้องและรวดเร็ว</span
                            >
                        </div>
                    </div>

                    <div class="step mt-6">
                        <div class="step-order">
                            <div class="step-dot">3</div>
                        </div>
                        <div class="step-content">
                            <span class="step-topic">ยืนยันการสั่งซื้อรับใบสั่งสินค้า</span>
                            <span class="step-body"
                                >ยืนยันการสั่งซื้อ และ
                                ทางเราจะออกใบสั่งสินค้าเพื่อดำเนินการจัดส่ง</span
                            >
                        </div>
                    </div>

                    <div class="step mt-6">
                        <div class="step-order">
                            <div class="step-dot">4</div>
                        </div>
                        <div class="step-content">
                            <span class="step-topic">จัดส่งสินค้า</span>
                            <span class="step-body"
                                >เราจัดส่งสินค้าที่มีคุณภาพให้ถึงมือลูกค้าอย่างถูกต้อง และ
                                ตรงเวลาพร้อมบริการหลังการขาย โดยทีมงานผู้เชี่ยวชาญ</span
                            >
                        </div>
                    </div>
                </div>
                <div class="column">
                    <span class="form-header mt-4"> กรอกฟอร์มเพื่อให้เราติดต่อกลับ </span>
                    <div class="form-body">
                        <input type="text" class="input mt-5" placeholder="Name" />
                        <input type="text" class="input mt-5" placeholder="Email" />
                        <input type="text" class="input mt-5" placeholder="Phone No." />
                        <textarea class="textarea mt-5" placeholder="Messages" rows="3"></textarea>
                        <button class="button mt-5 is-primary">ติดต่อเรา</button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: 'homeFooter',
}
</script>

<style scoped>
.form-body {
    width: 80%;
    display: flex;
    flex-direction: column;
}
button {
    align-self: end;
}
input {
    height: 50px;
}
.form-header {
    font-size: 18pt;
}
.step-body {
    font-family: 'Sukhumvit-Thin';
    font-size: 12pt;
}
.step-topic {
    font-size: 18pt;
    color: #25b6b0;
}
.step-header {
    font-size: 28pt;
}
.step-dot {
    /* ปรับแต่งง่ายด้วยตัวแปร */
    --size: 30px; /* ขนาดวงกลม */
    --bg: #25b6b0; /* สีเขียววงใน */
    --ring: 10px; /* ความหนาวงแหวนเงารอบนอก */
    --shadow-offset: 10px; /* ระยะเลื่อนของเงา */
    --shadow-blur: 12px; /* ความเบลอของเงา */

    position: relative;
    width: var(--size);
    height: var(--size);
    border-radius: 50%;
    background: var(--bg);
    color: #fff;
    font:
        700 calc(var(--size) * 0.42) / 1 system-ui,
        sans-serif;
    display: grid;
    place-items: center;

    /* วงแหวนเงารอบนอก */
    box-shadow: 0 0 0 var(--ring) rgba(0, 0, 0, 0.25);
    isolation: isolate; /* ให้ pseudo อยู่ด้านหลังจริง ๆ */
}

/* เงาหล่นนุ่ม ๆ ไปทางขวาล่าง */
.step-dot::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.35);
    transform: translate(var(--shadow-offset), var(--shadow-offset)) scale(0.9);
    filter: blur(var(--shadow-blur));
    z-index: -1;
}
.step-content {
    width: 90%;
    display: flex;
    flex-direction: column;
    padding-left: 20px;
}
.step-order {
    width: 10%;
    display: flex;
    align-items: center;
    justify-content: end;
}
.step {
    display: flex;
    width: 100%;
}
.columns {
    width: 100%;
    align-items: center;
}
.column {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.contact-section {
    position: relative;
    width: 100%;
    background-image: url('/images/contact-background.png');
    background-size: cover; /* ปรับให้เต็มโดยรักษาอัตราส่วน */
    background-position: center center; /* ให้อยู่ตรงกลาง */
    background-repeat: no-repeat;
    display: flex;
    /*align-items: center;
    justify-content: center;*/
}

/* เพิ่ม overlay มืด ๆ ให้ข้อความด้านบนอ่านง่ายขึ้น */
.overlay {
    position: relative;
    width: min(1100px, 92vw);
    margin: auto;
    /*width: 100%;
    height: 100%;*/
    /*background: rgba(0, 0, 0, 0.5);  ปรับความเข้มได้ */
    display: flex;
    flex-direction: column;
    align-items: center;
    /*justify-content: center;*/
    color: white;
    /*text-align: center;*/
    padding: 2rem;
}

/* สำหรับมือถือ */
@media (max-width: 768px) {
    .contact-section {
        background-position: center top; /* โฟกัสส่วนบนของภาพ */
        background-size: cover;
    }

    .overlay {
        padding: 1.5rem;
    }
}
</style>
