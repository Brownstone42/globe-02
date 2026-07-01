<template>
    <div class="product-tabs">
        <div class="tabs is-toggle is-small">
            <ul class="product-ul">
                <li :class="{ 'is-active': internalActive === 'highlights' }">
                    <a @click.prevent="updateTab('highlights')">ข้อมูลทางเทคนิค</a>
                </li>
                <li :class="{ 'is-active': internalActive === 'industry' }">
                    <a @click.prevent="updateTab('industry')">เหมาะสำหรับอุตสาหกรรม</a>
                </li>
                <li :class="{ 'is-active': internalActive === 'usecase' }">
                    <a @click.prevent="updateTab('usecase')">การใช้งานแนะนำ</a>
                </li>
                <li :class="{ 'is-active': internalActive === 'protection' }">
                    <a @click.prevent="updateTab('protection')">คุณสมบัติการป้องกัน</a>
                </li>
            </ul>
        </div>

        <div class="box tab-content">
            <div v-if="internalActive === 'highlights'">
                <p class="content-text">{{ product.spec || '-' }}</p>
            </div>
            <div v-else-if="internalActive === 'industry'">
                <p class="content-text">{{ product.suitableIndustries || '-' }}</p>
            </div>
            <div v-else-if="internalActive === 'usecase'">
                <p class="content-text">{{ product.usecase || '-' }}</p>
            </div>
            <div v-else-if="internalActive === 'protection'">
                <p class="content-text">{{ product.protectionProperties || '-' }}</p>
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
            default: 'highlights',
        },
        product: {
            type: Object,
            required: true,
        },
    },
    emits: ['update:activeTab'],
    computed: {
        internalActive() {
            return this.activeTab || 'highlights'
        },
    },
    methods: {
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
</style>
