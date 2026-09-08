<template>
    <section class="clients-section" aria-labelledby="clients-title">
        <h2 id="clients-title">ลูกค้าของเรา</h2>

        <div class="clients-rows">
            <div
                v-for="(row, rowIndex) in logoRows"
                :key="rowIndex"
                class="clients-viewport"
            >
                <div
                    class="clients-track"
                    :style="{ '--slide-duration': '32s' }"
                >
                    <div class="clients-logo-set">
                        <div v-for="logo in row" :key="`original-${logo.src}`" class="client-logo-item">
                            <img :src="logo.src" :alt="logo.alt" />
                        </div>
                    </div>
                    <div class="clients-logo-set" aria-hidden="true">
                        <div v-for="logo in row" :key="`copy-${logo.src}`" class="client-logo-item">
                            <img :src="logo.src" alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import client01 from '@/assets/images/clients/01.png'
import client02 from '@/assets/images/clients/02.png'
import client03 from '@/assets/images/clients/03.png'
import client04 from '@/assets/images/clients/04.png'
import client05 from '@/assets/images/clients/05.png'
import client06 from '@/assets/images/clients/06.png'
import client07 from '@/assets/images/clients/07.png'
import client08 from '@/assets/images/clients/08.png'
import client09 from '@/assets/images/clients/09.png'
import client10 from '@/assets/images/clients/010.png'
import client11 from '@/assets/images/clients/011.png'
import client12 from '@/assets/images/clients/012.png'
import client13 from '@/assets/images/clients/013.png'
import client14 from '@/assets/images/clients/014.png'
import client15 from '@/assets/images/clients/015.png'
import client16 from '@/assets/images/clients/016.png'
import client17 from '@/assets/images/clients/017.png'
import client18 from '@/assets/images/clients/018.png'
import client19 from '@/assets/images/clients/019.png'
import client20 from '@/assets/images/clients/020.png'

const logos = [
    client01, client02, client03, client04, client05, client06, client07,
    client08, client09, client10, client11, client12, client13, client14,
    client15, client16, client17, client18, client19, client20,
].map((src, index) => ({ src, alt: `โลโก้ลูกค้า ${index + 1}` }))

export default {
    name: 'HomeClients',
    data() {
        return {
            logoRows: [logos.slice(0, 7), logos.slice(7, 14), logos.slice(14)],
        }
    },
}
</script>

<style scoped>
.clients-section {
    --clients-width: min(1180px, 92vw);
    background: #fff;
    overflow: hidden;
    padding: 66px 0 76px;
}

.clients-section h2 {
    color: #a0805b;
    font-size: clamp(1.65rem, 2.3vw, 2.15rem);
    font-weight: 700;
    margin: 0 0 40px;
    text-align: center;
}

.clients-rows {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.clients-viewport {
    margin: 0 auto;
    overflow: hidden;
    width: var(--clients-width);
}

.clients-track {
    animation: clients-slide var(--slide-duration) linear infinite;
    display: flex;
    width: max-content;
    will-change: transform;
}

.clients-logo-set {
    display: flex;
    flex: 0 0 auto;
}

.client-logo-item {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    flex: 0 0 calc(var(--clients-width) / 4);
    height: 88px;
    justify-content: center;
    padding: 8px 12px;
}

.client-logo-item img {
    display: block;
    height: 100%;
    max-width: 100%;
    object-fit: contain;
    width: 100%;
}

.clients-viewport:hover .clients-track {
    animation-play-state: paused;
}

@keyframes clients-slide {
    from { transform: translate3d(0, 0, 0); }
    to { transform: translate3d(-50%, 0, 0); }
}

@media (max-width: 600px) {
    .clients-section {
        --clients-width: 94vw;
        padding: 46px 0 52px;
    }

    .clients-section h2 {
        margin-bottom: 26px;
    }

    .clients-rows {
        gap: 10px;
    }

    .client-logo-item {
        height: 58px;
        padding: 6px 3px;
    }
}
</style>
