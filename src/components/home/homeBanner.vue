<template>
    <section class="hero" role="banner" aria-label="Welcome to IdealGlobe">
        <div class="hero-bg" aria-hidden="true"></div>

        <!-- Responsive image -->
        <picture class="hero-media" aria-hidden="true">
            <source
                type="image/webp"
                srcset="
                    /images/banner3.png  640w,
                    /images/banner3.png  960w,
                    /images/banner3.png 1280w
                "
                sizes="100vw"
            />
            <img
                class="hero-img"
                src="/images/banner3.png"
                srcset="
                    /images/banner3.png  640w,
                    /images/banner3.png  960w,
                    /images/banner3.png 1280w
                "
                sizes="100vw"
                alt=""
                decoding="async"
                fetchpriority="high"
            />
        </picture>

        <!-- Optional text overlay -->
        <!--<div class="hero-content">
            <h1 class="hero-title">WELCOME TO</h1>
            <p class="hero-brand">IdealGlobe</p>
        </div>-->
    </section>
</template>

<script>
export default { name: 'AppBanner' }
</script>

<style scoped>
.hero {
    position: relative;
    height: 600px; /* ← กำหนดความสูงคงที่ */
    overflow: hidden;
    isolation: isolate;
}

/* cream gradient background */
.hero-bg {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #fff7ea 0%, #fff2d8 40%, #fff9f0 100%);
    z-index: 0;
}

/* image fills area */
.hero-media {
    position: absolute;
    inset: 0;
    z-index: 0;
}
.hero-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
}

/* overlay text */
.hero-content {
    position: relative;
    z-index: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #2a2f35;
    text-align: center;
}

.hero-title {
    font-size: 16px;
    letter-spacing: 0.25em;
    opacity: 0.7;
    margin-bottom: 8px;
}

.hero-brand {
    font-size: 56px;
    font-weight: 800;
    letter-spacing: -0.02em;
}

/* Mobile adjustments */
@media (max-width: 640px) {
    .hero {
        height: 380px; /* ลดความสูงบนจอเล็ก */
    }
    .hero-brand {
        font-size: 36px;
    }
}
</style>
