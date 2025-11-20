<template>
    <div class="feature-strip" aria-label="Store benefits">
        <div class="columns is-multiline is-4">
            <div class="column is-half-desktop is-half-tablet is-full-mobile">
                <div class="feature-item">
                    <div class="item-icon">
                        <img src="/images/icon-banner04.png" alt="" />
                    </div>
                    <div class="item-text">
                        <p class="title">คุ้มค่าและโปร่งใส</p>
                        <p class="subtitle">เสนอราคาที่คุ้มค่าโดยไม่ลดคุณภาพ</p>
                    </div>
                </div>
            </div>

            <div class="column is-half-desktop is-half-tablet is-full-mobile">
                <div class="feature-item">
                    <div class="item-icon">
                        <img src="/images/icon-banner03.png" alt="" />
                    </div>
                    <div class="item-text">
                        <p class="title">สินค้าคุณภาพสูง</p>
                        <p class="subtitle">ทุกสินค้าได้รับการตรวจสอบและรับรองตามมาตรฐานสากล</p>
                    </div>
                </div>
            </div>

            <div class="column is-half-desktop is-half-tablet is-full-mobile">
                <div class="feature-item">
                    <div class="item-icon">
                        <img src="/images/icon-banner02.png" alt="" />
                    </div>
                    <div class="item-text">
                        <p class="title">ตอบโจทย์ความต้องการ</p>
                        <p class="subtitle">พร้อมให้คำแนะนำและสเปกสินค้าที่เหมาะสมที่สุด</p>
                    </div>
                </div>
            </div>

            <div class="column is-half-desktop is-half-tablet is-full-mobile">
                <div class="feature-item">
                    <div class="item-icon">
                        <img src="/images/icon-banner01.png" alt="" />
                    </div>
                    <div class="item-text">
                        <p class="title">บริการหลังการขายมืออาชีพ</p>
                        <p class="subtitle">ดูแลครบวงจร พร้อมให้คำปรึกษาหลังการใช้งาน</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AppSubBanner',
}
</script>

<style scoped>
.item-icon {
    width: 15%;
    display: flex;
    align-items: center;
}
.item-text {
    width: 85%;
    margin-left: 10px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
}
.feature-strip {
    z-index: 2;
    --overlap: 56px;
    width: min(1100px, 92vw);
    margin-inline: auto;
    margin-top: calc(var(--overlap) * -1);
    background: #fff;
    border-radius: 18px;
    padding: clamp(14px, 2vw, 18px) clamp(12px, 2vw, 20px);
    box-shadow:
        0 10px 20px rgba(0, 0, 0, 0.06),
        0 24px 40px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(0, 0, 0, 0.06);
}
.column {
    padding: 1rem;
}
.feature-item {
    border-radius: 12px;
    padding: 1.5rem 1rem;
    transition: all 0.25s ease;
    display: flex;
}
.feature-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}
.title {
    font-weight: 700;
    color: #2a2f35;
    font-size: 1.1rem;
    margin-bottom: 0.25rem;
    letter-spacing: 0.5px;
    width: 100%;
}
.subtitle {
    color: #6b7280;
    font-size: 0.9rem;
    margin: 0;
    margin-bottom: 0 !important;
    width: 100%;
}
@media (max-width: 768px) {
    .feature-item {
        padding: 1.25rem;
    }
}
</style>
