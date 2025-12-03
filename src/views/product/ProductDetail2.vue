<template>
    <section class="product-detail-page">
        <div class="container is-max-desktop">
            <!-- Breadcrumb -->
            <nav class="breadcrumb mt-4" aria-label="breadcrumbs">
                <ul>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </nav>

            <!-- ถ้าไม่พบสินค้า -->
            <div v-if="!product" class="mt-6 mb-6">ไม่พบสินค้า</div>

            <!-- ส่วนบน: รูป + รายละเอียด -->
            <div v-else class="columns mt-4 product-main">
                <!-- ฝั่งซ้าย: รูป + carousel -->
                <div class="column is-6">
                    <div class="image-wrapper">
                        <!-- thumbnails -->
                        <div class="image-thumbs">
                            <button
                                v-for="(img, index) in product.images"
                                :key="img"
                                class="thumb-button"
                                :class="{ 'is-active': index === selectedImageIndex }"
                                type="button"
                                @click="selectedImageIndex = index"
                            >
                                <figure class="image is-64x64">
                                    <img
                                        :src="img"
                                        :alt="product.name + ' thumbnail ' + (index + 1)"
                                    />
                                </figure>
                            </button>
                        </div>

                        <!-- main image -->
                        <div class="image-main">
                            <figure class="image">
                                <img :src="currentImage" :alt="product.name" />
                            </figure>
                        </div>
                    </div>
                </div>

                <!-- ฝั่งขวา: รายละเอียด -->
                <div class="column is-6 product-info">
                    <h1 class="title is-4">{{ product.name }}</h1>
                    <p class="subtitle is-6">{{ product.shortDescription }}</p>

                    <div class="content product-brief">
                        <p v-for="(line, i) in product.brief" :key="i">
                            {{ line }}
                        </p>
                    </div>

                    <!-- ถ้ามีข้อมูลพวก brand, quality, packing ก็แยกเป็น list เอาไว้ -->
                    <div class="columns mt-4">
                        <div class="column">
                            <p class="has-text-weight-semibold">Brand :</p>
                            <p>{{ product.brand || '-' }}</p>
                        </div>
                        <div class="column">
                            <p class="has-text-weight-semibold">Standard Packing :</p>
                            <p>{{ product.packing || '-' }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- แท็บ: รายละเอียด / คุณสมบัติ / ประเภทการใช้งาน -->
            <div v-if="product" class="product-tabs mt-6">
                <div class="tabs is-toggle is-small">
                    <ul class="product-ul">
                        <li :class="{ 'is-active': activeTab === 'detail' }">
                            <a @click.prevent="activeTab = 'detail'"> รายละเอียด </a>
                        </li>
                        <li :class="{ 'is-active': activeTab === 'feature' }">
                            <a @click.prevent="activeTab = 'feature'"> คุณสมบัติ </a>
                        </li>
                        <li :class="{ 'is-active': activeTab === 'usage' }">
                            <a @click.prevent="activeTab = 'usage'"> ประเภทการใช้งาน </a>
                        </li>
                    </ul>
                </div>

                <div class="box">
                    <!-- ยังไม่ต้องทำ detail จริง ใช้ placeholder ไว้ก่อน -->
                    <div v-if="activeTab === 'detail'">
                        <p>เนื้อหารายละเอียดสินค้า (รายละเอียด) — ยังไม่ต้องใส่จริงตอนนี้</p>
                    </div>
                    <div v-else-if="activeTab === 'feature'">
                        <p>เนื้อหาคุณสมบัติของสินค้า — default แท็บนี้</p>
                    </div>
                    <div v-else-if="activeTab === 'usage'">
                        <p>เนื้อหาเกี่ยวกับประเภทการใช้งาน — ยังไม่ต้องใส่รายละเอียดตอนนี้</p>
                    </div>
                </div>
            </div>

            <!-- สินค้าในหมวดเดียวกัน -->
            <div v-if="relatedProducts.length" class="related-products mt-6 mb-6">
                <h2 class="title is-5 mb-4">สินค้าในหมวดเดียวกัน</h2>

                <div class="columns is-multiline">
                    <div
                        v-for="item in relatedProducts"
                        :key="item.id"
                        class="column is-3-desktop is-6-tablet is-12-mobile"
                    >
                        <div class="related-card">
                            <RouterLink
                                :to="{
                                    name: 'product-detail',
                                    params: { category: item.category, productId: item.id },
                                }"
                            >
                                <figure class="image related-image">
                                    <img :src="item.image" :alt="item.name" />
                                </figure>
                                <div class="related-info">
                                    <h3 class="is-size-6 has-text-weight-semibold">
                                        {{ item.name }}
                                    </h3>
                                    <p class="is-size-7">
                                        {{ item.shortDescription }}
                                    </p>
                                </div>
                            </RouterLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: 'ProductDetail',
    props: {
        category: {
            type: String,
            required: true,
        },
        productId: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            selectedImageIndex: 0,
            activeTab: 'feature', // default = คุณสมบัติ

            allProducts: [
                // mock data ตัวอย่าง – ใช้ชุดเดียวกับ productCategory แล้วเพิ่ม field ที่ต้องใช้
                {
                    id: 'latex-powder-free',
                    category: 'glove',
                    group: 'disposable',
                    name: 'Disposable Gloves',
                    shortDescription: 'ถุงมือใช้แล้วทิ้ง',
                    image: '/images/products/glove-01.png',
                    images: [
                        '/images/products/glove-01.png',
                        '/images/products/glove-01-side.png',
                        '/images/products/glove-01-box.png',
                    ],
                    brief: [
                        'ถุงมือยางไนไตร คุณภาพสูง สำหรับห้องคลีนรูม',
                        'ปราศจากแป้ง เหมาะสำหรับงานที่ต้องการความสะอาด',
                    ],
                    brand: 'IDEAL / TBG',
                    packing: '100 pcs / Dispenser Box',
                },
                {
                    id: 'black-esd',
                    category: 'glove',
                    group: 'special',
                    name: 'Specialty Work',
                    shortDescription: 'ถุงมือพิเศษงาน ESD',
                    image: '/images/products/glove-black.png',
                    images: [
                        '/images/products/glove-black.png',
                        '/images/products/glove-black-close.png',
                    ],
                    brief: ['ถุงมือสำหรับงานป้องกันไฟฟ้าสถิต', 'เหมาะสำหรับงานอิเล็กทรอนิกส์'],
                    brand: 'IDEAL',
                    packing: '1 pair / pack',
                },
                {
                    id: 'coverall-white',
                    category: 'coverall',
                    name: 'Coverall Protection',
                    shortDescription: 'ชุดป้องกันฝุ่นและสารเคมี',
                    image: '/images/products/coverall-white.png',
                    images: ['/images/products/coverall-white.png'],
                    brief: ['ชุดคลุมป้องกันแบบทั้งตัว สำหรับงานคลีนรูม'],
                    brand: 'IDEAL',
                    packing: '1 pc / pack',
                },
                {
                    id: 'footwear-white',
                    category: 'shoe',
                    name: 'Footwear Protection',
                    shortDescription: 'อุปกรณ์ป้องกันเท้า',
                    image: '/images/products/shoe-white.png',
                    images: ['/images/products/shoe-white.png'],
                    brief: ['รองเท้าสำหรับใช้ในห้องคลีนรูม'],
                    brand: 'IDEAL',
                    packing: '1 pair / box',
                },
            ],

            categoryMap: {
                glove: 'ถุงมือ',
                coverall: 'ชุดคลุมป้องกัน',
                mask: 'หน้ากากอนามัย',
                esd: 'ผลิตภัณฑ์ ESD',
                shoe: 'รองเท้า',
            },
        }
    },
    computed: {
        product() {
            return this.allProducts.find(
                (p) => p.id === this.productId && p.category === this.category,
            )
        },
        categoryLabel() {
            return this.categoryMap[this.category] || 'สินค้า'
        },
        currentImage() {
            if (!this.product || !this.product.images || !this.product.images.length) {
                return this.product?.image || ''
            }
            return this.product.images[this.selectedImageIndex] || this.product.images[0]
        },
        relatedProducts() {
            if (!this.product) return []

            // สินค้าในหมวดเดียวกัน แต่ไม่ใช่ตัวปัจจุบัน และไม่เกิน 4 ชิ้น
            return this.allProducts
                .filter((p) => p.category === this.product.category && p.id !== this.product.id)
                .slice(0, 4)
        },
    },
    watch: {
        // เวลาเปลี่ยน productId จากการกด related card ให้ reset รูปหลัก + tab กลับไป default
        productId() {
            this.selectedImageIndex = 0
            this.activeTab = 'feature'
        },
    },
}
</script>

<style scoped>
.product-detail-page {
    background: #f7f7f7;
    padding-bottom: 3rem;
}

/* รูป + thumbs layout */
.image-wrapper {
    display: grid;
    grid-template-columns: 80px 1fr;
    grid-template-areas: 'thumbs main'; /* แถวเดียว: ซ้าย = thumbs, ขวา = main */
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

/* ขวา */
.product-info {
    padding: 1.5rem;
    border-radius: 6px;
}

.product-brief p {
    margin-bottom: 0.25rem;
}

/* related */
.related-card {
    background: #fff;
    padding: 1rem;
    border-radius: 6px;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.related-image {
    margin-bottom: 0.75rem;
}

.related-image img {
    width: 100%;
    height: auto;
    object-fit: contain;
}

.related-info h3 {
    margin-bottom: 0.25rem;
}

.product-ul {
    display: flex;
    justify-content: center;
}

/* responsive */
@media screen and (max-width: 768px) {
    .product-main {
        flex-direction: column-reverse;
    }

    .image-wrapper {
        grid-template-columns: 1fr;
        grid-template-areas:
            'main'
            'thumbs'; /* บน = main, ล่าง = thumbs */
        row-gap: 0.75rem;
    }

    .image-main {
        grid-column: 1 / 2;
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
