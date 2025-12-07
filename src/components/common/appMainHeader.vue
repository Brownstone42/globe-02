<template>
    <div class="header">
        <div class="row">
            <img
                src="/images/logo2.png"
                alt="Company Logo"
                class="header-logo"
                @click="navigate('/')"
            />

            <!-- Desktop Menu -->
            <nav class="nav-menu desktop-menu">
                <a href="#" class="nav-item">ABOUT US</a>
                <a href="#" class="nav-item" @click="navigate('/product')">PRODUCT</a>
                <a href="#" class="nav-item">BLOGS</a>
                <a href="#" class="nav-item">CONTACT US</a>
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
            <a href="#" class="mobile-item">ABOUT US</a>
            <a href="#" class="mobile-item" @click="navigate('/product')">PRODUCT</a>
            <a href="#" class="mobile-item">BLOGS</a>
            <a href="#" class="mobile-item">CONTACT US</a>
        </nav>
    </div>
</template>

<script>
export default {
    name: 'mainHeader',
    mounted() {
        window.addEventListener('resize', this.handleResize)
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.handleResize)
    },
    data() {
        return {
            isOpen: false,
        }
    },
    methods: {
        navigate(path) {
            this.$router.push(path)
            this.isOpen = false
        },
        handleResize() {
            if (window.innerWidth > 768 && this.isOpen) {
                this.isOpen = false
            }
        },
    },
}
</script>

<style scoped>
.header {
    display: flex;
    flex-direction: column;
    /*background: linear-gradient(to top, #216e74, #2b8489, #3cabae);*/
    background-color: #23272d;
    width: 100%;
    position: sticky; /* NEW: stick to top */
    top: 0; /* NEW */
    z-index: 50; /* NEW: above page content */
}

/* Row (Logo + Menu/Hamburger) */
.header .row {
    display: flex;
    width: min(1100px, 92vw);
    height: 70px;
    margin: auto;
    align-items: center;
    justify-content: space-between;
}

.header-logo {
    max-height: 40px;
    width: auto;
    cursor: pointer;
}

/* Desktop Menu */
.desktop-menu {
    display: flex;
    gap: 50px;
}

.nav-item {
    color: #ead5b7;
    text-decoration: none;
    font-weight: 500;
    font-size: 16px;
}
.nav-item:hover {
    opacity: 0.8;
    color: #3ca9ac;
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
    background: #ead5b7;
    border-radius: 2px;
}

/* Mobile Menu */
.mobile-menu {
    display: flex;
    flex-direction: column;
    background: #23272d;
    width: 100%;
    padding: 10px 0;
}

.mobile-item {
    padding: 12px 20px;
    color: #ead5b7;
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
