<template>
    <div class="wrap">
        <div
            class="sub-header"
            ref="subHeader"
            @mouseenter="pauseScroll"
            @mouseleave="resumeScroll"
            @pointerdown="pauseScroll"
            @pointerup="resumeScroll"
        >
            <div
                v-if="!isMobile"
                class="is-flex is-justify-content-space-between is-align-items-center sub-header-desktop-content"
            >
                <div class="is-flex is-align-items-center sub-header-group">
                    <label class="sub-header-label">
                        <!--<i class="fas fa-mobile-alt sub-header-icon"></i>-->
                        Sales : 091-010-8349, 097-294-7975
                    </label>
                    <label class="sub-header-label">
                        <!--<i class="fas fa-phone sub-header-icon"></i>-->
                        Office : 02-860-1525
                    </label>
                    <label class="sub-header-label">
                        <!--<i class="fas fa-envelope sub-header-icon"></i>-->
                        Email : admin@idealglobe.com
                    </label>
                </div>
                <div class="is-flex is-align-items-center sub-header-group sub-header-right-group">
                    <label class="sub-header-label"
                        >ผู้นำด้านอุปกรณ์ Cleanroom และ ESD ครบวงจร</label
                    >
                </div>
            </div>

            <div v-if="isMobile" class="scrolling-content">
                <div class="is-flex is-align-items-center sub-header-group">
                    <label class="sub-header-label">
                        <i class="fas fa-mobile-alt sub-header-icon"></i> Sales : 091-010-8349,
                        097-294-7975
                    </label>
                    <label class="sub-header-label">
                        <i class="fas fa-phone sub-header-icon"></i> Office : 02-860-1525
                    </label>
                    <label class="sub-header-label">
                        <i class="fas fa-envelope sub-header-icon"></i> admin@idealglobe.com
                    </label>
                </div>

                <div class="is-flex is-align-items-center sub-header-group sub-header-right-group">
                    <label class="sub-header-label"
                        >ผู้นำด้านอุปกรณ์ Cleanroom และ ESD ครบวงจร</label
                    >
                </div>

                <div class="is-flex is-align-items-center sub-header-group">
                    <label class="sub-header-label">
                        <i class="fas fa-mobile-alt sub-header-icon"></i> Sales : 091-010-8349,
                        097-294-7975
                    </label>
                    <label class="sub-header-label">
                        <i class="fas fa-phone sub-header-icon"></i> Office : 02-860-1525
                    </label>
                    <label class="sub-header-label">
                        <i class="fas fa-envelope sub-header-icon"></i> admin@idealglobe.com
                    </label>
                </div>

                <div class="is-flex is-align-items-center sub-header-group sub-header-right-group">
                    <label class="sub-header-label"
                        >ผู้นำด้านอุปกรณ์ Cleanroom && ESD ครบวงจร</label
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'slideHeader',
    data() {
        return {
            isMobile: false,
            mql: null,
            animationFrameId: null,
            isPaused: false,
        }
    },
    mounted() {
        this.mql = window.matchMedia('(max-width: 999px)')
        const apply = () => (this.isMobile = this.mql.matches)
        apply()
        this.mql.addEventListener?.('change', apply)
        // fallback สำหรับบางเบราว์เซอร์เก่า
        if (!this.mql.addEventListener) this.mql.addListener(apply)
    },
    beforeUnmount() {
        if (this.mql?.removeEventListener) this.mql.removeEventListener('change', apply)
        else this.mql?.removeListener?.(apply)
    },
    watch: {
        isMobile(newVal) {
            if (newVal) {
                this.startScrollLoop()
            } else {
                this.stopScrollLoop()
                if (this.$refs.subHeader) {
                    this.$refs.subHeader.scrollLeft = 0
                }
            }
        },
    },
    methods: {
        checkScreenSize() {
            this.isMobile = window.innerWidth < 1000
        },
        pauseScroll() {
            this.isPaused = true
        },
        resumeScroll() {
            this.isPaused = false
        },
        startScrollLoop() {
            this.stopScrollLoop()

            const subHeader = this.$refs.subHeader
            if (!subHeader) return

            this.$nextTick(() => {
                const scrollingContent = subHeader.querySelector('.scrolling-content')
                if (!scrollingContent) {
                    console.warn(
                        "'.scrolling-content' not found. Is v-if='isMobile' working correctly?",
                    )
                    return
                }

                const contentWidth = scrollingContent.scrollWidth / 2
                const visibleWidth = subHeader.clientWidth
                if (contentWidth <= visibleWidth) return

                let lastTime
                const scrollSpeed = 50

                const loopScroll = (currentTime) => {
                    if (!lastTime) lastTime = currentTime
                    const deltaTime = currentTime - lastTime
                    lastTime = currentTime

                    if (!this.isPaused) {
                        const scrollAmount = (scrollSpeed / 1000) * deltaTime
                        subHeader.scrollLeft += scrollAmount
                        if (subHeader.scrollLeft >= contentWidth) {
                            subHeader.scrollLeft = 0
                        }
                    }

                    this.animationFrameId = requestAnimationFrame(loopScroll)
                }

                setTimeout(() => {
                    this.animationFrameId = requestAnimationFrame(loopScroll)
                }, 100)
            })
        },
        stopScrollLoop() {
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId)
                this.animationFrameId = null
            }
            this.isPaused = false
        },
    },
}
</script>

<style scoped>
.wrap {
    background-color: black;
}
.sub-header {
    margin: auto;
    width: min(1100px, 92vw);
    display: flex;
    position: sticky;
    z-index: 10;
    height: 30px;
    background-color: black;
    color: #ead5b7;
    align-items: center;
    padding: 0 10px;

    -ms-overflow-style: none;
    scrollbar-width: none;
    overflow-x: hidden;
}
.sub-header::-webkit-scrollbar {
    display: none;
}
.sub-header-group {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-shrink: 0;
}
.sub-header-label {
    white-space: nowrap;
}
.sub-header-icon {
    width: 24px;
    height: 24px;
    font-size: 14px;
    border: 1px solid white;
    border-radius: 50%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin-right: 8px;
}
.sub-header-desktop-content {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.scrolling-content {
    display: flex;
    align-items: center;
    white-space: nowrap;
    min-width: 1500px;
    gap: 150px;
}
@media (max-width: 999px) {
    .sub-header {
        overflow-x: auto;
        justify-content: flex-start;
        white-space: normal;
        -webkit-overflow-scrolling: touch;
    }
}
</style>
