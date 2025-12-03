<template>
    <div class="related-products">
        <h2 class="title is-5 mb-4">สินค้าในหมวดเดียวกัน</h2>

        <div class="columns is-multiline">
            <div
                v-for="item in items"
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
</style>
