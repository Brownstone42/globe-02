<template>
    <div class="related-products">
        <h2 class="related-title">สินค้าที่เกี่ยวข้อง</h2>

        <div class="columns is-multiline">
            <div
                v-for="item in items"
                :key="item.id"
                class="column is-3-desktop is-6-tablet is-6-mobile"
            >
                <article class="related-card">
                    <RouterLink
                        class="related-image"
                        :to="{
                            name: 'product-detail',
                            params: { category: item.category, productId: item.id },
                        }"
                    >
                        <img v-if="item.mainImageUrl" :src="item.mainImageUrl" :alt="item.name" />
                        <div v-else class="image-placeholder" aria-hidden="true"></div>
                    </RouterLink>

                    <div class="related-info">
                        <h3>{{ item.name }}</h3>
                        <p>{{ item.shortDescription || shortText(item.description) || 'รายละเอียดสินค้า' }}</p>

                        <div class="related-link-row">
                            <RouterLink
                                class="product-detail-btn"
                                :to="{
                                    name: 'product-detail',
                                    params: { category: item.category, productId: item.id },
                                }"
                            >
                                ดูรายละเอียดสินค้า
                            </RouterLink>
                            <RouterLink
                                class="quote-btn"
                                :to="{ name: 'quotation', query: { productId: item.id } }"
                            >ขอใบเสนอราคา</RouterLink>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'RelatedProducts',
    props: {
        items: {
            type: Array,
            default: () => [],
        },
    },
    methods: {
        shortText(text) {
            if (!text) return ''
            // ตัดข้อความความยาวให้เหมาะเพื่อให้ layout สวยเหมือนเดิม
            return text.length > 50 ? text.slice(0, 47) + '...' : text
        },
    },
}
</script>

<style scoped>
.related-title {
    color: #a0805b;
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0 0 18px;
}

.related-card {
    background: #fff;
    border-radius: 12px 12px 30px 12px;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    padding: 0;
}

.related-image {
    align-items: center;
    background: #fff;
    display: flex;
    height: 190px;
    justify-content: center;
    overflow: hidden;
}

.related-image img {
    display: block;
    height: 100%;
    max-height: 100%;
    max-width: 100%;
    object-fit: contain;
    width: 100%;
}

.image-placeholder {
    background: linear-gradient(135deg, #f8fafc, #e5e7eb);
    height: 100%;
    width: 100%;
}

.related-info {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 9px 13px 13px;
}

.related-info h3 {
    color: #a0805b;
    display: -webkit-box;
    font-size: 0.95rem;
    font-weight: 700;
    line-height: 1.3;
    margin: 0;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
}

.related-info p {
    color: #8a9298;
    display: -webkit-box;
    font-size: 0.7rem;
    line-height: 1.35;
    margin: 3px 0 9px;
    min-height: 1.35em;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
}

.related-link-row {
    border-top: 1px solid #d9dddf;
    display: flex;
    flex-direction: column;
    gap: 7px;
    margin-top: auto;
    padding-top: 12px;
}

.product-detail-btn,
.quote-btn {
    align-items: center;
    border-radius: 6px;
    display: flex;
    font-family: inherit;
    font-size: 0.72rem;
    justify-content: center;
    min-height: 32px;
    padding: 6px 8px;
    text-align: center;
    text-decoration: none;
    transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease;
    width: 100%;
}

.product-detail-btn {
    border: 1px solid #a0805b;
    color: #a0805b;
}

.product-detail-btn:hover {
    background: #f5f6f7;
    color: #896b49;
}

.quote-btn {
    background: #a0805b;
    border: 0;
    color: #fff;
    cursor: pointer;
}

.quote-btn:hover {
    background: #896b49;
    color: #fff;
}

@media (max-width: 768px) {
    .related-products {
        padding-inline: 16px;
    }

    .related-products .columns {
        display: grid;
        gap: 12px;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        margin: 0;
    }

    .related-products .column {
        padding: 0;
        width: auto;
    }

    .related-card {
        border-radius: 10px 10px 22px 10px;
    }

    .related-image {
        aspect-ratio: 1 / 1;
        height: auto;
    }

    .related-image img {
        height: 100%;
        object-fit: contain;
    }

    .related-info h3 {
        font-size: 0.82rem;
        line-height: 1.35;
    }

    .related-info p {
        font-size: 0.65rem;
    }

    .related-info {
        padding: 8px 9px 10px;
    }

    .related-link-row {
        gap: 6px;
        padding-top: 9px;
    }

    .product-detail-btn,
    .quote-btn {
        font-size: 0.64rem;
        min-height: 30px;
        padding: 5px 4px;
    }
}
</style>
