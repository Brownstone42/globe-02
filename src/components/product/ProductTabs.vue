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
            <div v-else-if="internalActive === 'suitable'">
                <ul v-if="listValue(product.suitable).length" class="content-list">
                    <li v-for="(item, index) in listValue(product.suitable)" :key="index">{{ item }}</li>
                </ul>
                <p v-else>-</p>
            </div>
            <div v-else-if="internalActive === 'documents'">
                <div v-if="documents.length" class="document-buttons">
                    <a
                        v-for="(document, index) in documents"
                        :key="document.url + index"
                        class="document-download"
                        :href="document.url"
                        :download="document.name"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <i class="fa-solid fa-download" aria-hidden="true"></i>
                        {{ document.name }}
                    </a>
                </div>
                <p v-else>-</p>
            </div>
            <div v-else-if="internalActive === 'faq'">
                <div v-if="faqItems.length" class="faq-list">
                    <section v-for="(item, index) in faqItems" :key="index" class="faq-item" :class="{ 'is-open': isFaqExpanded(index) }">
                        <button type="button" class="faq-question" :aria-expanded="isFaqExpanded(index)" @click="toggleFaq(index)">
                            <span>{{ item.question }}</span>
                            <span class="faq-arrow" aria-hidden="true"></span>
                        </button>
                        <div class="faq-answer-panel">
                            <p>{{ item.answer || '-' }}</p>
                        </div>
                    </section>
                </div>
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
                            <template v-else-if="tab.key === 'suitable'">
                                <ul v-if="listValue(product.suitable).length" class="content-list">
                                    <li v-for="(item, index) in listValue(product.suitable)" :key="index">{{ item }}</li>
                                </ul>
                                <p v-else>-</p>
                            </template>
                            <template v-else-if="tab.key === 'documents'">
                                <div v-if="documents.length" class="document-buttons">
                                    <a
                                        v-for="(document, index) in documents"
                                        :key="document.url + index"
                                        class="document-download"
                                        :href="document.url"
                                        :download="document.name"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <i class="fa-solid fa-download" aria-hidden="true"></i>
                                        {{ document.name }}
                                    </a>
                                </div>
                                <p v-else>-</p>
                            </template>
                            <template v-else-if="tab.key === 'faq'">
                                <div v-if="faqItems.length" class="faq-list">
                                    <section v-for="(item, index) in faqItems" :key="index" class="faq-item" :class="{ 'is-open': isFaqExpanded(index) }">
                                        <button type="button" class="faq-question" :aria-expanded="isFaqExpanded(index)" @click="toggleFaq(index)">
                                            <span>{{ item.question }}</span>
                                            <span class="faq-arrow" aria-hidden="true"></span>
                                        </button>
                                        <div class="faq-answer-panel">
                                            <p>{{ item.answer || '-' }}</p>
                                        </div>
                                    </section>
                                </div>
                                <p v-else>-</p>
                            </template>
                            <p v-else>-</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        <div v-if="hashtags.length" class="hashtag-list hashtag-section-footer">
            <span v-for="hashtag in hashtags" :key="hashtag" class="hashtag-chip">#{{ hashtag }}</span>
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
        documents() {
            if (!Array.isArray(this.product.documents)) return []
            return this.product.documents
                .filter((item) => item && item.url)
                .map((item) => ({ name: item.name || item.fileName || 'ดาวน์โหลดเอกสาร', url: item.url }))
        },
        faqItems() {
            if (!Array.isArray(this.product.faq)) return []
            return this.product.faq.filter((item) => item && (item.question || item.answer))
        },
        hashtags() {
            if (!Array.isArray(this.product.hashtags)) return []
            return this.product.hashtags
                .map((item) => String(item || '').replace(/^#+/, '').trim())
                .filter(Boolean)
        },
    },
    data() {
        return {
            expandedTabs: [],
            expandedFaqItems: [],
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
        toggleFaq(index) {
            const position = this.expandedFaqItems.indexOf(index)
            if (position === -1) this.expandedFaqItems.push(index)
            else this.expandedFaqItems.splice(position, 1)
        },
        isFaqExpanded(index) {
            return this.expandedFaqItems.includes(index)
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
.hashtag-list { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 22px; }
.hashtag-section-footer { margin: 18px 42px 6px; }
.hashtag-chip {
    background: #ead9c7;
    border-radius: 999px;
    color: #a0805b;
    display: inline-flex;
    font-size: 0.82rem;
    font-weight: 600;
    line-height: 1;
    padding: 8px 13px;
}
.document-buttons { align-items: flex-start; display: flex; flex-direction: column; gap: 10px; }
.document-download {
    align-items: center;
    background: #a0805b;
    border-radius: 6px;
    color: #fff;
    display: inline-flex;
    gap: 9px;
    padding: 10px 16px;
    text-decoration: none;
}
.document-download:hover { background: #876a4a; color: #fff; }
.faq-list { border-top: 1px solid #ddd8d0; }
.faq-item { border-bottom: 1px solid #ddd8d0; }
.faq-question {
    align-items: center;
    background: transparent;
    border: 0;
    color: #23272d;
    cursor: pointer;
    display: flex;
    font-family: inherit;
    font-size: 1rem;
    font-weight: 600;
    justify-content: space-between;
    padding: 15px 4px;
    text-align: left;
    width: 100%;
}
.faq-item.is-open .faq-question { color: #a0805b; }
.faq-arrow {
    border-bottom: 2px solid currentColor;
    border-right: 2px solid currentColor;
    flex: 0 0 8px;
    height: 8px;
    margin: 0 7px 0 14px;
    transform: rotate(45deg) translateY(-2px);
    transition: transform 0.42s cubic-bezier(0.22, 1, 0.36, 1);
    width: 8px;
}
.faq-item.is-open .faq-arrow { transform: rotate(225deg) translate(-2px, -2px); }
.faq-answer-panel {
    display: grid;
    grid-template-rows: 0fr;
    opacity: 0;
    transition:
        grid-template-rows 0.42s cubic-bezier(0.22, 1, 0.36, 1),
        opacity 0.42s ease;
}
.faq-answer-panel p { color: #59636d; line-height: 1.6; margin: 0; min-height: 0; overflow: hidden; white-space: pre-wrap; }
.faq-item.is-open .faq-answer-panel { grid-template-rows: 1fr; opacity: 1; }
.faq-item.is-open .faq-answer-panel p { padding: 0 4px 16px; }
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
    .hashtag-section-footer { margin: 18px 16px 4px; }
}
</style>
