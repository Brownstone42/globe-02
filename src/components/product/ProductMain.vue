<template>
    <div class="columns product-main">
        <!-- ซ้าย: รูป + carousel -->
        <div class="column is-6">
            <div class="image-wrapper">
                <!-- รูปใหญ่ -->
                <div class="image-main">
                    <figure class="image">
                        <img :src="currentImage" :alt="product.name" />
                    </figure>
                </div>

                <!-- รูปเล็กแนวนอน -->
                <div v-if="images.length" class="thumb-carousel">
                    <button
                        class="carousel-arrow"
                        type="button"
                        aria-label="รูปก่อนหน้า"
                        :disabled="selectedImageIndex === 0"
                        @click="selectImage(selectedImageIndex - 1)"
                    >
                        ‹
                    </button>
                    <div class="image-thumbs">
                    <button
                        v-for="(img, index) in images"
                        :key="img + index"
                        class="thumb-button"
                        :class="{ 'is-active': index === selectedImageIndex }"
                        type="button"
                        @click="selectImage(index)"
                    >
                        <figure class="image is-64x64">
                            <img :src="img" :alt="product.name + ' thumbnail ' + (index + 1)" />
                        </figure>
                    </button>
                    </div>
                    <button
                        class="carousel-arrow"
                        type="button"
                        aria-label="รูปถัดไป"
                        :disabled="selectedImageIndex === images.length - 1"
                        @click="selectImage(selectedImageIndex + 1)"
                    >
                        ›
                    </button>
                </div>
            </div>
        </div>

        <!-- ขวา: รายละเอียด -->
        <div class="column is-6 product-info">
            <h1 class="title is-4 mb-2">{{ product.name }}</h1>

            <p v-if="product.shortDescription" class="short-desc">
                {{ product.shortDescription }}
            </p>

            <p v-if="product.description" class="full-desc">
                {{ product.description }}
            </p>

            <div v-if="product.highlights" class="info-block">
                <p class="info-label">จุดเด่นสินค้า</p>
                <ul class="info-list">
                    <li v-for="(item, index) in listValue(product.highlights)" :key="index">{{ item }}</li>
                </ul>
            </div>

            <div class="sku-row">
                <span class="sku-chip">SKU: {{ product.sku || '-' }}</span>
            </div>

            <div class="product-actions">
                <a
                    class="action-btn line-btn"
                    href="https://lin.ee/qyMmToF"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img src="/images/line_icon.png" alt="" />
                    สอบถามและสั่งซื้อสินค้า<br />@idealglobe
                </a>
                <button class="action-btn quote-action" type="button">
                    <i class="fa-regular fa-file-lines"></i>
                    ขอใบเสนอราคา
                </button>
                <a class="action-btn phone-btn" href="tel:0972204888">
                    <i class="fa-solid fa-phone"></i>
                    โทรสอบถาม<br />097-220-4888
                </a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ProductMain',
    props: {
        product: {
            type: Object,
            required: true,
        },
        categoryLabel: {
            type: String,
            default: '',
        },
        currentImage: {
            type: String,
            required: true,
        },
        selectedImageIndex: {
            type: Number,
            required: true,
        },
    },
    emits: ['update:selected-image-index'],
    methods: {
        selectImage(index) {
            if (index < 0 || index >= this.images.length) return
            this.$emit('update:selected-image-index', index)
        },
        listValue(value) {
            if (Array.isArray(value)) return value
            return value ? [value] : []
        },
    },
    computed: {
        // รวม mainImageUrl + galleryImageUrls ให้กลายเป็น array เดียว
        images() {
            const list = []
            if (this.product.mainImageUrl) {
                list.push(this.product.mainImageUrl)
            }
            if (
                Array.isArray(this.product.galleryImageUrls) &&
                this.product.galleryImageUrls.length
            ) {
                list.push(...this.product.galleryImageUrls)
            }
            // ถ้าไม่มีรูปเลย คืน array ว่าง แต่ layout ยังอยู่เพราะ v-for แค่ไม่ render ปุ่ม
            return list
        },
    },
}
</script>

<style scoped>
.image-wrapper {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.image-main {
    background: #fff;
    border-radius: 8px;
    height: 420px;
    overflow: hidden;
    padding: 1.25rem;
}

.image-main figure {
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: center;
    overflow: hidden;
    width: 100%;
}

.image-main img {
    display: block;
    height: 100%;
    max-height: 100%;
    max-width: 100%;
    object-fit: contain;
    width: 100%;
}

.thumb-carousel {
    align-items: center;
    display: grid;
    gap: 8px;
    grid-template-columns: 26px minmax(0, 1fr) 26px;
}

.image-thumbs {
    display: flex;
    gap: 10px;
    justify-content: center;
    min-width: 0;
    overflow-x: auto;
    scrollbar-width: none;
}
.image-thumbs::-webkit-scrollbar { display: none; }

.thumb-button {
    background: #fff;
    border: 1px solid transparent;
    border-radius: 5px;
    cursor: pointer;
    flex: 0 0 72px;
    height: 72px;
    overflow: hidden;
    padding: 4px;
}

.thumb-button img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    background: #fff;
}

.thumb-button.is-active {
    border-color: #a0805b;
    box-shadow: 0 0 0 1px #a0805b;
}

.carousel-arrow {
    background: transparent;
    border: 0;
    color: #a0805b;
    cursor: pointer;
    font-size: 1.75rem;
    padding: 0;
}

.carousel-arrow:disabled {
    cursor: default;
    opacity: 0.25;
}

/* กล่องรายละเอียดขวา */
.product-info {
    padding: 1.5rem;
    border-radius: 6px;
}

.product-info :deep(.title) { color: #23272d; }

.short-desc {
    font-size: 1rem;
    font-weight: 600;
    color: #a0805b;
    margin-bottom: 0.5rem;
}

.full-desc {
    font-size: 0.9rem;
    color: #475569;
    white-space: pre-wrap;
    margin-bottom: 1rem;
}

.info-block {
    margin-bottom: 0.75rem;
}

.info-label {
    font-size: 0.8rem;
    font-weight: 700;
    color: #a0805b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.15rem;
}

.info-value {
    font-size: 0.9rem;
    color: #1e293b;
    white-space: pre-wrap;
}

.info-list {
    color: #1e293b;
    font-size: 0.9rem;
    list-style: disc;
    margin: 0 0 0 1.2rem;
}

.sku-chip {
    background: #e7e1d8;
    border: 1px solid #cdbb9f;
    border-radius: 3px;
    color: #5f4a31;
    display: inline-block;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 5px 10px;
}

.sku-row {
    display: block;
    margin: 7px 0 12px;
}

.product-actions {
    display: grid;
    gap: 9px;
    grid-template-columns: repeat(3, minmax(0, 1fr));
}

.action-btn {
    align-items: center;
    border: 0;
    border-radius: 7px;
    color: #fff;
    display: flex;
    font-family: inherit;
    font-size: 0.72rem;
    justify-content: center;
    line-height: 1.25;
    min-height: 48px;
    padding: 7px 9px;
    text-align: left;
    text-decoration: none;
}

.action-btn i,
.action-btn img { margin-right: 7px; }
.action-btn img { height: 21px; width: 21px; }
.line-btn { background: #43ba46; }
.quote-action { background: #23272d; cursor: default; }
.phone-btn { background: #a0805b; }

figure {
    margin: auto;
}

@media screen and (max-width: 768px) {
    .product-main {
        flex-direction: column-reverse;
    }

    .image-main { height: 330px; }
    .thumb-button { flex-basis: 60px; height: 60px; }
    .product-actions { grid-template-columns: 1fr; }
}
</style>
