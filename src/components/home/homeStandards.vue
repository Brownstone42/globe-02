<template>
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
</template>

<script>
import standard01 from '@/assets/images/standards/01.png'
import standard02 from '@/assets/images/standards/02.png'
import standard03 from '@/assets/images/standards/03.png'
import standard04 from '@/assets/images/standards/04.png'
import standard05 from '@/assets/images/standards/05.png'

export default {
    name: 'HomeStandards',
    data() {
        return {
            standardLogos: [standard01, standard02, standard03, standard04, standard05],
        }
    },
}
</script>

<style scoped>
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

@media (max-width: 1050px) {
    .standards-strip-inner {
        gap: 14px;
        grid-template-columns: 1fr;
    }

    .standards-logo-space {
        max-width: 760px;
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
    .standards-strip-copy p {
        white-space: normal;
    }

    .standards-logo-space {
        gap: 4px;
        grid-template-columns: repeat(5, minmax(0, 1fr));
        margin-top: 16px;
    }

    .standard-logo-item {
        height: 34px;
    }
}
</style>

