<template>
    <div class="header">
        <div class="row">
            <img src="/images/logo.png" alt="Company Logo" class="header-logo" />

            <!-- Desktop Menu -->
            <nav class="nav-menu desktop-menu">
                <a href="#" class="nav-item">หน้าแรก</a>
                <a href="#" class="nav-item">สินค้า</a>
                <a href="#" class="nav-item">เกี่ยวกับเรา</a>
                <a href="#" class="nav-item">ติดต่อเรา</a>
            </nav>

            <!-- Hamburger Button (Mobile) -->
            <div class="hamburger" @click="isOpen = !isOpen">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>

        <!-- Mobile Menu -->
        <nav class="mobile-menu" v-if="isOpen">
            <a href="#" class="mobile-item">หน้าแรก</a>
            <a href="#" class="mobile-item">สินค้า</a>
            <a href="#" class="mobile-item">เกี่ยวกับเรา</a>
            <a href="#" class="mobile-item">ติดต่อเรา</a>
        </nav>
    </div>
</template>

<script>
export default {
    name: 'mainHeader',
    data() {
        return {
            isOpen: false,
        }
    },
}
</script>

<style scoped>
.header {
    display: flex;
    flex-direction: column;
    background: linear-gradient(to top, #216e74, #2b8489, #3cabae);
    width: 100%;
}

/* Row (Logo + Menu/Hamburger) */
.header .row {
    display: flex;
    width: min(1100px, 92vw);
    height: 100px;
    margin: auto;
    align-items: center;
    justify-content: space-between;
}

.header-logo {
    max-height: 70px;
    width: auto;
}

/* Desktop Menu */
.desktop-menu {
    display: flex;
    gap: 100px;
}

.nav-item {
    color: white;
    text-decoration: none;
    font-weight: 500;
    font-size: 18px;
}
.nav-item:hover {
    opacity: 0.8;
}

/* Hamburger Button */
.hamburger {
    display: none;
    flex-direction: column;
    gap: 6px;
    cursor: pointer;
}

.hamburger span {
    width: 28px;
    height: 3px;
    background: white;
    border-radius: 2px;
}

/* Mobile Menu */
.mobile-menu {
    display: flex;
    flex-direction: column;
    background: #2b8489;
    width: 100%;
    padding: 10px 0;
}

.mobile-item {
    padding: 12px 20px;
    color: white;
    text-decoration: none;
    font-weight: 500;
}
.mobile-item:hover {
    background: rgba(255, 255, 255, 0.1);
}

/* Responsive */
@media (max-width: 768px) {
    .desktop-menu {
        display: none; /* ซ่อนเมนู Desktop */
    }

    .hamburger {
        display: flex; /* แสดงปุ่ม Hamburger */
    }
}
</style>
