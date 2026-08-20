<template>
    <div class="product-tabs">
        <div class="tabs is-toggle is-small">
            <ul class="product-ul">
                <li :class="{ 'is-active': internalActive === 'properties' }">
                    <a @click.prevent="updateTab('properties')">คุณสมบัติ</a>
                </li>
                <li :class="{ 'is-active': internalActive === 'specifications' }">
                    <a @click.prevent="updateTab('specifications')">สเปคสินค้า</a>
                </li>
                <li :class="{ 'is-active': internalActive === 'standards' }">
                    <a @click.prevent="updateTab('standards')">มาตรฐานและการรับรอง</a>
                </li>
            </ul>
        </div>

        <div class="box tab-content">
            <div v-if="internalActive === 'properties'">
                <ul v-if="listValue(product.properties).length" class="content-list">
                    <li v-for="(item, index) in listValue(product.properties)" :key="index">{{ item }}</li>
                </ul>
                <p v-else>-</p>
            </div>
            <div v-else-if="internalActive === 'specifications'">
                <ul v-if="listValue(product.specifications).length" class="content-list">
                    <li v-for="(item, index) in listValue(product.specifications)" :key="index">{{ item }}</li>
                </ul>
                <p v-else>-</p>
            </div>
            <div v-else-if="internalActive === 'standards'">
                <ul v-if="listValue(product.standards).length" class="content-list">
                    <li v-for="(item, index) in listValue(product.standards)" :key="index">{{ item }}</li>
                </ul>
                <p v-else>-</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ProductTabs',
    props: {
        activeTab: {
            type: String,
            default: 'properties',
        },
        product: {
            type: Object,
            required: true,
        },
    },
    emits: ['update:activeTab'],
    computed: {
        internalActive() {
            return this.activeTab || 'properties'
        },
    },
    methods: {
        listValue(value) {
            if (Array.isArray(value)) return value
            return value ? [value] : []
        },
        updateTab(tab) {
            this.$emit('update:activeTab', tab)
        },
    },
}
</script>

<style scoped>
.product-tabs .tabs ul li a {
    min-width: 120px;
    justify-content: center;
}
.product-ul {
    justify-content: center;
}
.tab-content {
    min-height: 80px;
}
.content-text {
    white-space: pre-wrap;
}
.content-list { list-style: disc; margin-left: 1.25rem; }
</style>
