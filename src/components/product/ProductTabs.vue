<template>
    <div class="product-tabs">
        <div class="tabs is-toggle is-small">
            <ul class="product-ul">
                <li :class="{ 'is-active': internalActive === 'detail' }">
                    <a @click.prevent="updateTab('detail')">รายละเอียด</a>
                </li>
                <li :class="{ 'is-active': internalActive === 'feature' }">
                    <a @click.prevent="updateTab('feature')">คุณสมบัติ</a>
                </li>
                <li :class="{ 'is-active': internalActive === 'usage' }">
                    <a @click.prevent="updateTab('usage')">ประเภทการใช้งาน</a>
                </li>
            </ul>
        </div>

        <div class="box">
            <!-- ตอนนี้ยังเป็น placeholder ตามที่บอก -->
            <div v-if="internalActive === 'detail'">
                <p>เนื้อหารายละเอียดสินค้า (รายละเอียด) — ยังไม่ต้องใส่จริงตอนนี้</p>
            </div>
            <div v-else-if="internalActive === 'feature'">
                <p>เนื้อหาคุณสมบัติของสินค้า — default แท็บนี้</p>
            </div>
            <div v-else-if="internalActive === 'usage'">
                <p>เนื้อหาเกี่ยวกับประเภทการใช้งาน — ยังไม่ต้องใส่รายละเอียดตอนนี้</p>
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
            default: 'feature',
        },
    },
    emits: ['update:activeTab'],
    computed: {
        internalActive() {
            return this.activeTab || 'feature'
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
</style>
