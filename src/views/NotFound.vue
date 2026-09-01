<template>
    <main class="not-found-page">
        <div class="not-found-card">
            <p class="error-code" aria-hidden="true">404</p>
            <h1>ไม่พบหน้าที่ต้องการ</h1>
            <p>หน้าที่คุณกำลังค้นหาอาจถูกย้าย ลบ หรือ URL ไม่ถูกต้อง</p>
            <RouterLink class="home-link" to="/">กลับสู่หน้าแรก</RouterLink>
        </div>
    </main>
</template>

<script>
export default {
    name: 'NotFound',
}
</script>

<style scoped>
.not-found-page {
    align-items: center;
    background: #eef1ef;
    display: flex;
    justify-content: center;
    min-height: 60vh;
    padding: 64px 20px;
    text-align: center;
}

.not-found-card {
    max-width: 560px;
}

.error-code {
    color: #a0805b;
    font-size: clamp(4rem, 14vw, 7rem);
    font-weight: 700;
    line-height: 1;
    margin: 0 0 14px;
}

h1 {
    color: #205266;
    font-size: clamp(1.6rem, 4vw, 2.25rem);
    margin-bottom: 12px;
}

.not-found-card > p:not(.error-code) {
    color: #5f6b70;
    line-height: 1.7;
    margin-bottom: 28px;
}

.home-link {
    background: #205266;
    border-radius: 999px;
    color: #fff;
    display: inline-flex;
    font-weight: 600;
    padding: 11px 24px;
    transition: background-color 0.2s ease;
}

.home-link:hover {
    background: #163e4e;
    color: #fff;
}
</style>
