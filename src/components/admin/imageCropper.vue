<template>
    <div class="cropper" v-if="src">
        <div ref="stage" class="stage">
            <img
                ref="img"
                :src="src"
                alt="crop source"
                draggable="false"
                @load="onImageLoad"
            />

            <div
                v-if="ready"
                class="crop-box"
                :style="boxStyle"
                @pointerdown.self="startMove"
            >
                <div class="grid-line v1"></div>
                <div class="grid-line v2"></div>
                <div class="grid-line h1"></div>
                <div class="grid-line h2"></div>

                <span
                    v-for="corner in corners"
                    :key="corner"
                    class="handle"
                    :class="corner"
                    @pointerdown.stop="startResize($event, corner)"
                ></span>
            </div>
        </div>

        <small class="cropper-hint">
            ลากกรอบเพื่อเลือกตำแหน่ง • ลากมุมเพื่อย่อ/ขยาย • สัดส่วนคงที่ {{ ratioLabel }}
        </small>
    </div>
</template>

<script>
export default {
    name: 'imageCropper',
    props: {
        // Source File chosen by the user. Passing null clears the cropper.
        file: { type: File, default: null },
        aspect: { type: Number, default: 16 / 9 },
        ratioLabel: { type: String, default: '16:9' },
        // Cropped output is downscaled to at most this width.
        maxOutputWidth: { type: Number, default: 1600 },
    },
    data() {
        return {
            src: null,
            ready: false,
            displayW: 0,
            displayH: 0,
            box: { x: 0, y: 0, w: 0, h: 0 },
            drag: null,
            corners: ['nw', 'ne', 'sw', 'se'],
        }
    },
    computed: {
        boxStyle() {
            return {
                left: `${this.box.x}px`,
                top: `${this.box.y}px`,
                width: `${this.box.w}px`,
                height: `${this.box.h}px`,
            }
        },
    },
    watch: {
        file: {
            immediate: true,
            handler(file) {
                if (this.src) URL.revokeObjectURL(this.src)
                this.ready = false
                this.src = file ? URL.createObjectURL(file) : null
            },
        },
    },
    mounted() {
        window.addEventListener('resize', this.onResize)
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.onResize)
        this.stopDrag()
        if (this.src) URL.revokeObjectURL(this.src)
    },
    methods: {
        onImageLoad() {
            this.measure()
            this.resetBox()
            this.ready = true
        },

        measure() {
            const img = this.$refs.img
            this.displayW = img.clientWidth
            this.displayH = img.clientHeight
        },

        // Largest box of the target aspect, centred on the image.
        resetBox() {
            let w = this.displayW
            let h = w / this.aspect
            if (h > this.displayH) {
                h = this.displayH
                w = h * this.aspect
            }
            this.box = {
                x: (this.displayW - w) / 2,
                y: (this.displayH - h) / 2,
                w,
                h,
            }
        },

        onResize() {
            if (!this.ready) return
            const prevW = this.displayW
            this.measure()
            if (!prevW || !this.displayW) return
            // Keep the selection where it was, proportionally.
            const k = this.displayW / prevW
            this.box = {
                x: this.box.x * k,
                y: this.box.y * k,
                w: this.box.w * k,
                h: this.box.h * k,
            }
        },

        clamp(value, min, max) {
            return Math.min(Math.max(value, min), max)
        },

        startMove(e) {
            this.drag = {
                mode: 'move',
                startX: e.clientX,
                startY: e.clientY,
                origin: { ...this.box },
            }
            this.bindDrag(e)
        },

        startResize(e, corner) {
            this.drag = {
                mode: 'resize',
                corner,
                origin: { ...this.box },
            }
            this.bindDrag(e)
        },

        bindDrag(e) {
            e.target.setPointerCapture?.(e.pointerId)
            window.addEventListener('pointermove', this.onDrag)
            window.addEventListener('pointerup', this.stopDrag)
        },

        stopDrag() {
            this.drag = null
            window.removeEventListener('pointermove', this.onDrag)
            window.removeEventListener('pointerup', this.stopDrag)
        },

        onDrag(e) {
            if (!this.drag) return
            e.preventDefault()
            if (this.drag.mode === 'move') this.doMove(e)
            else this.doResize(e)
        },

        doMove(e) {
            const { startX, startY, origin } = this.drag
            this.box = {
                ...origin,
                x: this.clamp(origin.x + (e.clientX - startX), 0, this.displayW - origin.w),
                y: this.clamp(origin.y + (e.clientY - startY), 0, this.displayH - origin.h),
            }
        },

        // Resize from a corner, keeping the opposite corner pinned and the aspect locked.
        doResize(e) {
            const rect = this.$refs.stage.getBoundingClientRect()
            const px = this.clamp(e.clientX - rect.left, 0, this.displayW)
            const py = this.clamp(e.clientY - rect.top, 0, this.displayH)
            const { corner, origin } = this.drag

            const anchorX = corner === 'nw' || corner === 'sw' ? origin.x + origin.w : origin.x
            const anchorY = corner === 'nw' || corner === 'ne' ? origin.y + origin.h : origin.y

            const MIN_W = 40
            let w = Math.abs(px - anchorX)

            // Don't let the box grow past the image edges it is expanding toward.
            const maxW = corner === 'nw' || corner === 'sw' ? anchorX : this.displayW - anchorX
            const maxH = corner === 'nw' || corner === 'ne' ? anchorY : this.displayH - anchorY
            w = this.clamp(w, MIN_W, Math.min(maxW, maxH * this.aspect))

            const h = w / this.aspect
            const x = corner === 'nw' || corner === 'sw' ? anchorX - w : anchorX
            const y = corner === 'nw' || corner === 'ne' ? anchorY - h : anchorY

            this.box = { x, y, w, h }
        },

        /**
         * Renders the current selection to a JPEG File.
         * Returns null when no image is loaded.
         */
        async getCroppedFile(filename = 'cover.jpg') {
            if (!this.ready || !this.file) return null
            const img = this.$refs.img
            const scale = img.naturalWidth / this.displayW

            const sx = this.box.x * scale
            const sy = this.box.y * scale
            const sw = this.box.w * scale
            const sh = this.box.h * scale

            const outW = Math.round(Math.min(sw, this.maxOutputWidth))
            const outH = Math.round(outW / this.aspect)

            const canvas = document.createElement('canvas')
            canvas.width = outW
            canvas.height = outH
            const ctx = canvas.getContext('2d')
            ctx.imageSmoothingQuality = 'high'
            ctx.drawImage(img, sx, sy, sw, sh, 0, 0, outW, outH)

            const blob = await new Promise((resolve) =>
                canvas.toBlob(resolve, 'image/jpeg', 0.9),
            )
            if (!blob) return null

            return new File([blob], filename, { type: 'image/jpeg' })
        },
    },
}
</script>

<style scoped>
.cropper {
    margin-top: 8px;
}

.stage {
    position: relative;
    display: inline-block;
    max-width: 100%;
    line-height: 0;
    border-radius: 8px;
    overflow: hidden;
    background: #0f172a;
}

.stage img {
    display: block;
    max-width: 100%;
    height: auto;
    user-select: none;
    -webkit-user-drag: none;
}

.crop-box {
    position: absolute;
    box-sizing: border-box;
    border: 2px solid #fff;
    cursor: move;
    /* Dims everything outside the selection. */
    box-shadow: 0 0 0 9999px rgba(15, 23, 42, 0.55);
    touch-action: none;
}

.grid-line {
    position: absolute;
    background: rgba(255, 255, 255, 0.35);
    pointer-events: none;
}

.grid-line.v1,
.grid-line.v2 {
    top: 0;
    bottom: 0;
    width: 1px;
}
.grid-line.v1 {
    left: 33.33%;
}
.grid-line.v2 {
    left: 66.66%;
}

.grid-line.h1,
.grid-line.h2 {
    left: 0;
    right: 0;
    height: 1px;
}
.grid-line.h1 {
    top: 33.33%;
}
.grid-line.h2 {
    top: 66.66%;
}

.handle {
    position: absolute;
    width: 14px;
    height: 14px;
    background: #fff;
    border-radius: 2px;
    touch-action: none;
}

.handle.nw {
    top: -7px;
    left: -7px;
    cursor: nwse-resize;
}
.handle.ne {
    top: -7px;
    right: -7px;
    cursor: nesw-resize;
}
.handle.sw {
    bottom: -7px;
    left: -7px;
    cursor: nesw-resize;
}
.handle.se {
    bottom: -7px;
    right: -7px;
    cursor: nwse-resize;
}

.cropper-hint {
    display: block;
    margin-top: 6px;
    color: #64748b;
    font-size: 12px;
}
</style>
