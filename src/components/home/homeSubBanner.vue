<template>
    <div class="feature-strip" aria-label="Store benefits">
        <div class="columns is-multiline is-4">
            <div class="column is-one-quarter-desktop is-half-tablet is-full-mobile">
                <div class="feature-item">
                    <p class="title">Free Shipping</p>
                    <p class="subtitle">Orders above $100</p>
                </div>
            </div>

            <div class="column is-one-quarter-desktop is-half-tablet is-full-mobile">
                <div class="feature-item">
                    <p class="title">24/7 Support</p>
                    <p class="subtitle">We're here anytime</p>
                </div>
            </div>

            <div class="column is-one-quarter-desktop is-half-tablet is-full-mobile">
                <div class="feature-item">
                    <p class="title">Secure Payment</p>
                    <p class="subtitle">100% protection</p>
                </div>
            </div>

            <div class="column is-one-quarter-desktop is-half-tablet is-full-mobile">
                <div class="feature-item">
                    <p class="title">Package Insurance</p>
                    <p class="subtitle">Every parcel covered</p>
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
    background: #f9fafb;
    border-radius: 12px;
    padding: 1.5rem 1rem;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
    text-align: center;
    transition: all 0.25s ease;
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
}
.subtitle {
    color: #6b7280;
    font-size: 0.9rem;
    margin: 0;
}
@media (max-width: 768px) {
    .feature-item {
        padding: 1.25rem;
    }
}
</style>
