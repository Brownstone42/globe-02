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

        <div class="mobile-accordion">
            <section v-for="tab in tabs" :key="tab.key" class="accordion-item" :class="{ 'is-open': isExpanded(tab.key) }">
                <button
                    class="accordion-trigger"
                    type="button"
                    :aria-expanded="isExpanded(tab.key)"
                    :aria-controls="`accordion-content-${tab.key}`"
                    @click="toggleAccordion(tab.key)"
                >
                    <span>{{ tab.label }}</span>
                    <span class="accordion-arrow" aria-hidden="true"></span>
                </button>

                <div
                    :id="`accordion-content-${tab.key}`"
                    class="accordion-panel"
                    :aria-hidden="!isExpanded(tab.key)"
                >
                    <div class="accordion-panel-inner">
                        <div class="accordion-content">
                            <template v-if="tab.key === 'details'">
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
                            </template>
                            <template v-else-if="tab.key === 'specifications'">
                                <ul v-if="listValue(product.specifications).length" class="content-list">
                                    <li v-for="(item, index) in listValue(product.specifications)" :key="index">{{ item }}</li>
                                </ul>
                                <p v-else>-</p>
                            </template>
                            <p v-else>-</p>
                        </div>
                    </div>
                </div>
            </section>
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
            expandedTabs: [],
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
        toggleAccordion(tab) {
            const index = this.expandedTabs.indexOf(tab)
            if (index === -1) {
                this.expandedTabs.push(tab)
                this.updateTab(tab)
            } else {
                this.expandedTabs.splice(index, 1)
            }
        },
        isExpanded(tab) {
            return this.expandedTabs.includes(tab)
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
.content-list li::marker { color: #a0805b; font-size: 0.7em; }
.mobile-accordion { display: none; }
@media (max-width: 768px) {
    .product-tab-nav,
    .tab-content { display: none; }
    .mobile-accordion {
        border-top: 1px solid #d8d5cf;
        display: block;
    }
    .accordion-item { border-bottom: 1px solid #d8d5cf; }
    .accordion-trigger {
        align-items: center;
        background: transparent;
        border: 0;
        color: #72777b;
        cursor: pointer;
        display: flex;
        font-family: inherit;
        font-size: 1rem;
        justify-content: space-between;
        padding: 17px 16px;
        text-align: left;
        width: 100%;
    }
    .accordion-item.is-open .accordion-trigger {
        color: #a0805b;
        font-weight: 700;
    }
    .accordion-arrow {
        border-bottom: 2px solid currentColor;
        border-right: 2px solid currentColor;
        height: 8px;
        margin-right: 4px;
        transform: rotate(45deg) translateY(-2px);
        transition: transform 0.48s cubic-bezier(0.22, 1, 0.36, 1);
        width: 8px;
    }
    .accordion-item.is-open .accordion-arrow { transform: rotate(225deg) translate(-2px, -2px); }
    .accordion-panel {
        display: grid;
        grid-template-rows: 0fr;
        opacity: 0;
        transition:
            grid-template-rows 0.48s cubic-bezier(0.22, 1, 0.36, 1),
            opacity 0.48s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .accordion-item.is-open .accordion-panel {
        grid-template-rows: 1fr;
        opacity: 1;
    }
    .accordion-panel-inner {
        min-height: 0;
        overflow: hidden;
    }
    .accordion-content {
        color: #475569;
        padding: 2px 16px 20px;
    }
    .accordion-content h3 { color: #a0805b; font-size: 1.15rem; font-weight: 700; margin-bottom: 10px; }
}
</style>
