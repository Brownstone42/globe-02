<template>
    <div class="header">
        <div class="row">
            <img
                :src="headerLogo"
                alt="Company Logo"
                class="header-logo"
                @click="navigate('/')"
            />

            <!-- Desktop Menu -->
            <nav class="nav-menu desktop-menu">
                <a href="/about" class="nav-item" @click.prevent="navigate('/about')">ABOUT US</a>
                <a href="#" class="nav-item" @click="navigate('/product')">PRODUCT</a>
                <a href="#" class="nav-item" @click.prevent="navigate('/blogs')">BLOGS</a>
                <a href="/contact" class="nav-item" @click.prevent="navigate('/contact')">CONTACT US</a>
                <a
                    href="https://lin.ee/qyMmToF"
                    class="line-add-button"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="เพิ่มเพื่อน LINE @idealglobe"
                >
                    <img
                        src="https://scdn.line-apps.com/n/line_add_friends/btn/th.png"
                        alt="LINE @idealglobe"
                        height="36"
                    />
                </a>
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
            <a href="/about" class="mobile-item" @click.prevent="navigate('/about')">ABOUT US</a>
            <a href="#" class="mobile-item" @click="navigate('/product')">PRODUCT</a>
            <a href="#" class="mobile-item" @click.prevent="navigate('/blogs')">BLOGS</a>
            <a href="/contact" class="mobile-item" @click.prevent="navigate('/contact')">CONTACT US</a>
        </nav>

        <div class="mobile-contact-floating" aria-label="ช่องทางสอบถามและสั่งซื้อ">
            <a class="floating-phone" href="tel:0972204888" aria-label="โทร 097-220-4888">
                <i class="fa-solid fa-phone" aria-hidden="true"></i>
            </a>
            <a
                href="https://lin.ee/qyMmToF"
                class="floating-line"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="สอบถามและสั่งซื้อผ่าน LINE @idealglobe"
            >
                <img :src="lineIcon" alt="" />
                <span>สอบถามและสั่งซื้อ</span>
            </a>
        </div>
    </div>
</template>

<script>
import headerLogo from '@/assets/images/branding/logo-header.png'
import lineIcon from '@/assets/images/branding/line-icon.png'

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
            headerLogo,
            lineIcon,
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
    align-items: center;
    display: flex;
    gap: 38px;
}

.nav-item {
    color: #fff;
    text-decoration: none;
    font-weight: 500;
    font-size: 16px;
}
.nav-item:hover {
    opacity: 0.8;
    color: #a0805b;
}

.line-add-button {
    border-radius: 10px;
    display: inline-flex;
    flex-shrink: 0;
    line-height: 0;
    overflow: hidden;
    transition: opacity 0.18s ease, transform 0.18s ease;
}

.line-add-button img {
    display: block;
    height: 36px;
    width: auto;
}

.line-add-button:hover {
    opacity: 0.9;
    transform: translateY(-1px);
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
    color: #fff;
    text-decoration: none;
    font-weight: 500;
}
.mobile-item:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #a0805b;
}

.mobile-contact-floating {
    display: none;
}

/* Responsive */
@media (max-width: 768px) {
    .desktop-menu {
        display: none; /* ซ่อนเมนู Desktop */
    }

    .hamburger {
        display: flex; /* แสดงปุ่ม Hamburger */
    }

    .mobile-contact-floating {
        align-items: center;
        animation: line-button-enter 0.72s cubic-bezier(0.22, 1, 0.36, 1) both;
        -webkit-backdrop-filter: blur(7px) saturate(1.1);
        backdrop-filter: blur(7px) saturate(1.1);
        background: rgba(225, 229, 234, 0.32);
        border-radius: 999px;
        bottom: 25px;
        display: flex;
        filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.24));
        gap: 7px;
        left: 50%;
        padding: 8px;
        position: fixed;
        transition: opacity 0.18s ease, transform 0.18s ease;
        transform: translateX(-50%);
        width: min(270px, calc(100vw - 34px));
        z-index: 999;
    }

    .floating-phone {
        align-items: center;
        background: #364052;
        border-radius: 50%;
        color: #fff;
        display: flex;
        flex: 0 0 41px;
        font-size: 1.15rem;
        height: 41px;
        justify-content: center;
        text-decoration: none;
    }

    .floating-line {
        align-items: center;
        background: #50bd2e;
        border-radius: 999px;
        color: #fff;
        display: flex;
        flex: 1;
        font-size: clamp(0.78rem, 3.1vw, 0.9rem);
        font-weight: 700;
        gap: 6px;
        height: 38px;
        justify-content: center;
        min-width: 0;
        padding: 0 12px;
        position: relative;
        text-decoration: none;
        white-space: nowrap;
    }

    .floating-line img {
        filter: brightness(0) invert(1);
        height: 20px;
        object-fit: contain;
        width: 24px;
    }

    .mobile-contact-floating::before,
    .mobile-contact-floating::after {
        border: 2px solid rgba(128, 135, 145, 0.62);
        border-radius: 999px;
        content: '';
        inset: -3px;
        opacity: 0;
        pointer-events: none;
        position: absolute;
        z-index: -1;
        animation: line-button-aura 2.2s ease-out 0.9s infinite;
    }

    .mobile-contact-floating::after {
        animation-delay: 2s;
    }

    .floating-phone:active,
    .floating-line:active {
        opacity: 0.86;
        transform: scale(0.96);
    }

    @keyframes line-button-enter {
        from {
            opacity: 0;
            transform: translate(-50%, 42px) scale(0.88);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) scale(1);
        }
    }

    @keyframes line-button-aura {
        0% {
            opacity: 0.7;
            transform: scale(0.96);
        }
        75%, 100% {
            opacity: 0;
            transform: scale(1.42);
        }
    }

}
</style>
