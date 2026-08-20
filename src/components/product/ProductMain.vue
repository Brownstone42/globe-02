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

                <!-- รูปเล็ก -->
                <div class="image-thumbs">
                    <button
                        v-for="(img, index) in images"
                        :key="img + index"
                        class="thumb-button"
                        :class="{ 'is-active': index === selectedImageIndex }"
                        type="button"
                        @click="$emit('update:selected-image-index', index)"
                    >
                        <figure class="image is-64x64">
                            <img :src="img" :alt="product.name + ' thumbnail ' + (index + 1)" />
                        </figure>
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

            <div v-if="product.standards" class="info-block">
                <p class="info-label">มาตรฐานและการรับรอง</p>
                <ul class="info-list">
                    <li v-for="(item, index) in listValue(product.standards)" :key="index">{{ item }}</li>
                </ul>
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
/* desktop: thumbs ซ้าย / main ขวา */
.image-wrapper {
    display: grid;
    grid-template-columns: 80px 1fr;
    grid-template-areas: 'thumbs main';
    column-gap: 1rem;
    align-items: start;
}

.image-main {
    grid-area: main;
    background: #fff;
    padding: 1.5rem;
    border-radius: 6px;
}

.image-main img {
    width: 100%;
    height: auto;
    object-fit: contain;
}

.image-thumbs {
    grid-area: thumbs;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.thumb-button {
    border: none;
    padding: 0;
    background: transparent;
    cursor: pointer;
    border-radius: 4px;
    overflow: hidden;
}

.thumb-button img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    background: #fff;
}

.thumb-button.is-active {
    outline: 2px solid #00b894;
}

/* กล่องรายละเอียดขวา */
.product-info {
    padding: 1.5rem;
    border-radius: 6px;
}

.short-desc {
    font-size: 1rem;
    font-weight: 600;
    color: #1e293b;
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
    color: #64748b;
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

figure {
    margin: auto;
}

/* mobile: main บน / thumbs ล่าง */
@media screen and (max-width: 768px) {
    .product-main {
        flex-direction: column-reverse;
    }

    .image-wrapper {
        grid-template-columns: 1fr;
        grid-template-areas:
            'main'
            'thumbs';
        row-gap: 0.75rem;
    }

    .image-thumbs {
        flex-direction: row;
        justify-content: center;
    }

    .thumb-button {
        width: 64px;
        height: 64px;
    }
}
</style>
