<template>
    <div class="product-tabs">
        <div class="product-tab-nav">
            <ul class="product-ul">
                <li v-for="tab in tabs" :key="tab.key" :class="{ 'is-active': internalActive === tab.key }">
                    <button type="button" @click="updateTab(tab.key)">{{ tab.label }}</button>
                </li>
            </ul>
        </div>

        <div class="box tab-content">
            <div v-if="internalActive === 'details'">
                <h3>คุณสมบัติ</h3>
                <ul v-if="listValue(product.properties).length" class="content-list">
                    <li v-for="(item, index) in listValue(product.properties)" :key="index">{{ item }}</li>
                </ul>
                <p v-else>-</p>

                <h3 class="standards-heading">มาตรฐานการรับรอง</h3>
                <ul v-if="listValue(product.standards).length" class="content-list">
                    <li v-for="(item, index) in listValue(product.standards)" :key="index">{{ item }}</li>
                </ul>
                <p v-else>-</p>
            </div>
            <div v-else-if="internalActive === 'specifications'">
                <ul v-if="listValue(product.specifications).length" class="content-list">
                    <li v-for="(item, index) in listValue(product.specifications)" :key="index">{{ item }}</li>
                </ul>
                <p v-else>-</p>
            </div>
            <div v-else>
                <p>-</p>
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
            default: 'details',
        },
        product: {
            type: Object,
            required: true,
        },
    },
    emits: ['update:activeTab'],
    computed: {
        internalActive() {
            return this.activeTab || 'details'
        },
    },
    data() {
        return {
            tabs: [
                { key: 'details', label: 'รายละเอียด' },
                { key: 'specifications', label: 'สเปคสินค้า' },
                { key: 'suitable', label: 'เหมาะกับ' },
                { key: 'documents', label: 'เอกสารที่เกี่ยวข้อง' },
                { key: 'faq', label: 'คำถามที่พบบ่อย' },
            ],
        }
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
.product-tab-nav { border-bottom: 1px solid #d8d5cf; border-top: 1px solid #d8d5cf; overflow-x: auto; }
.product-ul {
    display: flex;
    justify-content: center;
    min-width: max-content;
}
.product-ul li button {
    background: transparent;
    border: 0;
    color: #72777b;
    cursor: pointer;
    font-family: inherit;
    font-size: 0.9rem;
    min-width: 145px;
    padding: 17px 18px 14px;
}
.product-ul li.is-active button {
    color: #a0805b;
    font-weight: 700;
    box-shadow: inset 0 -3px #a0805b;
}
.tab-content {
    background: transparent;
    box-shadow: none;
    min-height: 80px;
    padding: 28px 42px;
}
.tab-content h3 { color: #a0805b; font-size: 1.15rem; font-weight: 700; margin-bottom: 10px; }
.standards-heading { margin-top: 24px; }
.content-text {
    white-space: pre-wrap;
}
.content-list { list-style: disc; margin-left: 1.25rem; }
@media (max-width: 768px) {
    .product-ul { justify-content: flex-start; }
    .product-ul li button { min-width: 120px; padding-inline: 12px; }
    .tab-content { padding: 22px 16px; }
}
</style>
