<template>
    <div class="related-products">
        <h2 class="title is-5 mb-4">สินค้าในหมวดเดียวกัน</h2>

        <div class="columns is-multiline">
            <div
                v-for="item in items"
                :key="item.id"
                class="column is-3-desktop is-6-tablet is-6-mobile"
            >
                <div class="related-card">
                    <RouterLink
                        :to="{
                            name: 'product-detail',
                            params: { category: item.category, productId: item.id },
                        }"
                    >
                        <figure class="image related-image">
                            <img :src="item.mainImageUrl" :alt="item.name" />
                        </figure>

                        <div class="related-info">
                            <h3 class="is-size-6 has-text-weight-semibold">
                                {{ item.name }}
                            </h3>

                            <p class="is-size-7">
                                {{ shortText(item.description) }}
                            </p>
                        </div>
                    </RouterLink>
                </div>
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
.related-card {
    background: #fff;
    padding: 1rem;
    border-radius: 6px;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.related-card > a {
    color: inherit;
    display: flex;
    flex-direction: column;
    height: 100%;
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
        border-radius: 8px;
        padding: 10px;
    }

    .related-image {
        aspect-ratio: 1 / 1;
        margin-bottom: 8px;
    }

    .related-image img {
        height: 100%;
        object-fit: contain;
    }

    .related-info h3 {
        display: -webkit-box;
        font-size: 0.9rem !important;
        line-height: 1.35;
        min-height: 2.7em;
        overflow: hidden;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
    }

    .related-info p {
        display: -webkit-box;
        font-size: 0.75rem !important;
        line-height: 1.4;
        overflow: hidden;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
    }
}
</style>
