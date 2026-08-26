<template>
    <div class="header">
        <div class="row">
            <img
                src="/images/logo-header1.png"
                alt="Company Logo"
                class="header-logo"
                @click="navigate('/')"
            />

            <!-- Desktop Menu -->
            <nav class="nav-menu desktop-menu">
                <a href="/about" class="nav-item" @click.prevent="navigate('/about')">ABOUT US</a>
                <a href="#" class="nav-item" @click="navigate('/product')">PRODUCT</a>
                <a href="#" class="nav-item" @click.prevent="navigate('/blogs')">BLOGS</a>
                <a href="#" class="nav-item">CONTACT US</a>
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
            <a href="#" class="mobile-item">CONTACT US</a>
        </nav>

        <a
            href="https://lin.ee/qyMmToF"
            class="mobile-line-floating"
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

.mobile-line-floating {
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

    .mobile-line-floating {
        animation: line-button-enter 0.72s cubic-bezier(0.22, 1, 0.36, 1) both;
        border-radius: 10px;
        display: block;
        filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.24));
        line-height: 0;
        overflow: visible;
        position: fixed;
        right: 27px;
        bottom: 34px;
        transition: opacity 0.18s ease, transform 0.18s ease;
        z-index: 999;
    }

    .mobile-line-floating img {
        border-radius: 10px;
        display: block;
        height: 36px;
        width: auto;
    }

    .mobile-line-floating::before,
    .mobile-line-floating::after {
        border: 2px solid rgba(6, 199, 85, 0.72);
        border-radius: 13px;
        content: '';
        inset: -3px;
        opacity: 0;
        pointer-events: none;
        position: absolute;
        z-index: -1;
        animation: line-button-aura 2.2s ease-out 0.9s infinite;
    }

    .mobile-line-floating::after {
        animation-delay: 2s;
    }

    .mobile-line-floating:active {
        opacity: 0.86;
        transform: scale(0.96);
    }

    @keyframes line-button-enter {
        from {
            opacity: 0;
            transform: translateX(48px) scale(0.88);
        }
        to {
            opacity: 1;
            transform: translateX(0) scale(1);
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

    @media (prefers-reduced-motion: reduce) {
        .mobile-line-floating {
            animation: none;
        }

        .mobile-line-floating::before,
        .mobile-line-floating::after {
            animation: none;
        }
    }
}
</style>
