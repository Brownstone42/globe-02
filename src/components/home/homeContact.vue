<template>
    <section id="contact-section" class="contact-section">
        <div class="stats-strip" aria-label="ข้อมูลบริษัท">
            <div class="stats-inner">
                <div class="stat-item">
                    <strong>30+</strong>
                    <span>ปี ประสบการณ์</span>
                </div>
                <div class="stat-item">
                    <strong>1000+</strong>
                    <span>รายการสินค้า</span>
                    <small>ครอบคลุมทุกความต้องการ</small>
                </div>
                <div class="stat-item">
                    <strong>300+</strong>
                    <span>ลูกค้า</span>
                    <small>วางใจให้เราดูแล</small>
                </div>
                <div class="stat-item">
                    <strong>จัดส่ง</strong>
                    <span>รวดเร็ว</span>
                    <small>ทั่วประเทศ</small>
                </div>
                <div class="stat-item stat-service">
                    <strong>ให้คำปรึกษา</strong>
                    <span>บริการหลังการขาย</span>
                    <small>และให้คำปรึกษา</small>
                </div>
            </div>
        </div>

        <div class="order-contact-layout">
            <div class="steps-panel">
                <div class="steps-content">
                    <h2>ขั้นตอนการสั่งสินค้า</h2>

                    <ol class="steps-list">
                        <li>
                            <span class="step-number">1</span>
                            <div>
                                <h3>สอบถามและสั่งซื้อ</h3>
                                <p>ลูกค้าสามารถสอบถามข้อมูลสินค้าและบริการผ่านช่องทางต่าง ๆ ที่สะดวก</p>
                            </div>
                        </li>
                        <li>
                            <span class="step-number">2</span>
                            <div>
                                <h3>รับใบเสนอราคา</h3>
                                <p>เราจะจัดทำใบเสนอราคาตามความต้องการของลูกค้าอย่างถูกต้องและรวดเร็ว</p>
                            </div>
                        </li>
                        <li>
                            <span class="step-number">3</span>
                            <div>
                                <h3>ยืนยันการสั่งซื้อรับใบสั่งสินค้า</h3>
                                <p>ยืนยันการสั่งซื้อ และทางเราจะออกใบสั่งสินค้าเพื่อดำเนินการจัดส่ง</p>
                            </div>
                        </li>
                        <li>
                            <span class="step-number">4</span>
                            <div>
                                <h3>จัดส่งสินค้า</h3>
                                <p>จัดส่งสินค้าที่มีคุณภาพให้ถึงมือลูกค้าอย่างถูกต้อง ตรงเวลา พร้อมบริการหลังการขาย</p>
                            </div>
                        </li>
                    </ol>
                </div>
            </div>

            <div class="form-panel">
                <div class="form-content">
                    <h2>กรอกฟอร์มเพื่อให้เราติดต่อกลับ</h2>

                    <form class="contact-form" @submit.prevent>
                        <div class="field-grid">
                            <label>
                                <span>Name <b>*</b></span>
                                <input type="text" placeholder="Your Name" required />
                            </label>
                            <label>
                                <span>Company <b>*</b></span>
                                <input type="text" placeholder="Company Name" required />
                            </label>
                            <label>
                                <span>Email <b>*</b></span>
                                <input type="email" placeholder="Your Email @Company.com" required />
                            </label>
                            <label>
                                <span>Phone <b>*</b></span>
                                <input type="tel" placeholder="02-123-1234" required />
                            </label>
                        </div>

                        <label class="message-field">
                            <span>Message</span>
                            <textarea rows="3" placeholder="Please describe your requirements"></textarea>
                        </label>

                        <button type="submit">ติดต่อเรา</button>
                    </form>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: 'homeContact',
}
</script>

<style scoped>
.contact-section {
    background: #23272d;
    width: 100%;
}

.stats-strip {
    background: #a0805b;
    color: #fff;
    padding: 58px 0 54px;
}

.stats-inner {
    align-items: start;
    display: grid;
    gap: 28px;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    margin: 0 auto;
    width: min(1180px, 90vw);
}

.stat-item {
    align-items: center;
    display: flex;
    flex-direction: column;
    text-align: center;
}

.stat-item strong {
    color: #fff;
    font-size: clamp(1.75rem, 2.6vw, 2.55rem);
    font-weight: 700;
    line-height: 1.05;
}

.stat-item span {
    color: #fff;
    font-size: 1.05rem;
    font-weight: 700;
    line-height: 1.25;
    margin-top: 4px;
}

.stat-item small {
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.72rem;
    line-height: 1.25;
    margin-top: 3px;
}

.stat-service strong {
    font-size: clamp(1.55rem, 2.2vw, 2.15rem);
}

.order-contact-layout {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
}

.steps-panel {
    background: #23272d;
    color: #fff;
    display: flex;
    justify-content: flex-end;
    padding: 56px 7vw 64px 5vw;
}

.steps-content {
    max-width: 620px;
    width: 100%;
}

.steps-content h2,
.form-content h2 {
    font-size: clamp(1.75rem, 2.5vw, 2.45rem);
    font-weight: 500;
    line-height: 1.25;
    margin: 0;
}

.steps-list {
    display: flex;
    flex-direction: column;
    gap: 30px;
    list-style: none;
    margin: 38px 0 0;
    padding: 0;
}

.steps-list li {
    align-items: flex-start;
    display: grid;
    gap: 22px;
    grid-template-columns: 44px minmax(0, 1fr);
}

.step-number {
    align-items: center;
    background: #a0805b;
    border: 6px solid #171a1e;
    border-radius: 50%;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.28);
    color: #fff;
    display: flex;
    font-weight: 700;
    height: 44px;
    justify-content: center;
    width: 44px;
}

.steps-list h3 {
    color: #a0805b;
    font-size: 1.18rem;
    font-weight: 500;
    line-height: 1.25;
    margin: 1px 0 3px;
}

.steps-list p {
    color: #e5e7eb;
    font-family: 'Sukhumvit-Thin', sans-serif;
    font-size: 0.9rem;
    line-height: 1.4;
    margin: 0;
    max-width: 500px;
}

.form-panel {
    background: #deddda;
    color: #26343e;
    padding: 56px 5vw 64px;
}

.form-content {
    max-width: 640px;
    width: 100%;
}

.form-content h2 {
    text-align: center;
}

.contact-form {
    margin-top: 42px;
}

.field-grid {
    display: grid;
    gap: 20px 18px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
}

.contact-form label {
    display: flex;
    flex-direction: column;
    gap: 7px;
}

.contact-form label > span {
    color: #52616b;
    font-size: 0.75rem;
}

.contact-form label b {
    color: #dc2626;
}

.contact-form input,
.contact-form textarea {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 7px;
    box-sizing: border-box;
    color: #334155;
    font-family: inherit;
    font-size: 0.85rem;
    outline: none;
    padding: 12px 14px;
    width: 100%;
}

.contact-form input {
    height: 52px;
}

.contact-form input:focus,
.contact-form textarea:focus {
    border-color: #a0805b;
    box-shadow: 0 0 0 3px rgba(160, 128, 91, 0.15);
}

.message-field {
    margin-top: 20px;
}

.contact-form textarea {
    min-height: 84px;
    resize: vertical;
}

.contact-form button {
    background: #a0805b;
    border: 0;
    border-radius: 7px;
    color: #fff;
    cursor: pointer;
    display: block;
    font-family: inherit;
    font-weight: 600;
    margin: 34px 0 0 auto;
    min-width: 180px;
    padding: 13px 28px;
}

.contact-form button:hover {
    background: #896b49;
}

@media (max-width: 800px) {
    .stats-strip {
        padding: 54px 0;
    }

    .stats-inner {
        gap: 46px 20px;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        width: min(86vw, 520px);
    }

    .stat-service {
        grid-column: 1 / -1;
    }

    .order-contact-layout {
        grid-template-columns: 1fr;
    }

    .steps-panel,
    .form-panel {
        justify-content: center;
        padding: 54px 8vw 60px;
    }

    .steps-content,
    .form-content {
        max-width: 560px;
    }

    .steps-content h2 {
        text-align: center;
    }
}

@media (max-width: 520px) {
    .field-grid {
        grid-template-columns: 1fr;
    }

    .steps-list li {
        gap: 15px;
        grid-template-columns: 40px minmax(0, 1fr);
    }

    .step-number {
        border-width: 5px;
        height: 40px;
        width: 40px;
    }

    .contact-form button {
        width: 100%;
    }
}
</style>
