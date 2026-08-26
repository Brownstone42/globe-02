<!-- src/components/admin/productManagement.vue -->
<template>
    <div class="product-management">
        <div class="pm-layout">
            <!-- FORM -->
            <div class="pm-column">
                <div class="pm-form-header">
                    <h2 class="pm-section-title">
                        {{ currentProductId ? 'Edit Product' : 'Create Product' }}
                    </h2>
                    <div class="pm-form-actions">
                        <button
                            v-if="currentProductId"
                            type="button"
                            class="btn-secondary small"
                            :disabled="productStore.loading"
                            @click="startCreate"
                        >
                            + สร้างสินค้าใหม่
                        </button>
                        <button
                            type="submit"
                            form="admin-product-form"
                            class="btn-primary small"
                            :disabled="productStore.loading"
                        >
                            {{ productStore.loading
                                ? 'Saving...'
                                : currentProductId
                                    ? 'อัปเดตสินค้า'
                                    : 'บันทึกสินค้า' }}
                        </button>
                    </div>
                </div>
                <section class="pm-form">
                    <product-form
                        :editing-product="editingProduct"
                        @saved="handleSaved"
                    ></product-form>
                </section>
            </div>

            <!-- LIST -->
            <div class="pm-column">
                <div class="pm-list-header">
                    <h2 class="pm-section-title">Product List</h2>
                    <div class="pm-filter">
                        <select v-model="filterCategory" class="filter-select">
                            <option value="">-- All Categories --</option>
                            <option v-for="cat in categories" :key="cat.id" :value="cat.slug">
                                {{ cat.name }}
                            </option>
                        </select>
                    </div>
                </div>

                <section class="pm-list">
                    <div v-if="isLoading" class="pm-list-placeholder">กำลังโหลดสินค้า...</div>

                    <div v-else-if="!filteredProducts.length" class="pm-list-placeholder">
                        ไม่พบสินค้าในหมวดหมู่นี้
                    </div>

                    <div v-else class="pm-table-wrapper">
                        <table class="pm-table">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th style="width: 120px">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="product in filteredProducts" :key="product.id">
                                    <td class="col-image">
                                        <img
                                            v-if="product.mainImageUrl"
                                            :src="product.mainImageUrl"
                                            alt=""
                                        />
                                        <div v-else class="image-placeholder">No image</div>
                                    </td>
                                    <td>{{ product.name }}</td>
                                    <td>{{ product.category }}</td>
                                    <td>
                                        <button
                                            type="button"
                                            class="btn-ghost"
                                            @click="startEdit(product)"
                                        >
                                            แก้ไข
                                        </button>
                                        <button
                                            type="button"
                                            class="btn-danger"
                                            @click="deleteProduct(product)"
                                        >
                                            ลบ
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <p v-if="error" class="error-text">
                        {{ error }}
                    </p>
                </section>
            </div>
        </div>
    </div>
</template>

<script>
import ProductForm from './productForm.vue'
import { useProductStore } from '@/stores/productStore'
import { useCategoryStore } from '@/stores/categoryStore'

export default {
    name: 'ProductManagement',
    components: {
        ProductForm,
    },
    data() {
        return {
            currentProductId: null, // null = create mode, not null = edit mode
            filterCategory: '', // หมวดหมู่ที่เลือกกรอง
        }
    },
    computed: {
        productStore() {
            return useProductStore()
        },
        categoryStore() {
            return useCategoryStore()
        },
        products() {
            return this.productStore.products
        },
        categories() {
            return this.categoryStore.categories || []
        },
        filteredProducts() {
            if (!this.filterCategory) return this.products
            return this.products.filter((p) => p.category === this.filterCategory)
        },
        isLoading() {
            return this.productStore.loading
        },
        error() {
            return this.productStore.error
        },
        editingProduct() {
            if (!this.currentProductId) return null
            return this.products.find((item) => item.id === this.currentProductId) || null
        },
    },
    async mounted() {
        // โหลดสินค้าครั้งแรก
        await this.productStore.fetchProducts()
        await this.productStore.migrateProductSchema()
        // โหลดหมวดหมู่
        if (!this.categoryStore.categories || !this.categoryStore.categories.length) {
            await this.categoryStore.loadCategories()
        }
    },
    methods: {
        startCreate() {
            this.currentProductId = null
        },
        startEdit(product) {
            this.currentProductId = product.id
        },
        async deleteProduct(product) {
            const ok = window.confirm(`ต้องการลบสินค้า "${product.name}" ใช่หรือไม่?`)
            if (!ok) return

            await this.productStore.deleteProduct(product.id)

            if (this.currentProductId === product.id) {
                this.currentProductId = null
            }
        },
        async handleSaved({ mode, product } = {}) {
            if (mode === 'update' && product?.id) {
                // รีเซ็ตฟอร์มจากข้อมูลล่าสุด แต่ยังคงอยู่ในโหมดแก้ไขสินค้าชิ้นเดิม
                this.currentProductId = null
                await this.$nextTick()
                this.currentProductId = product.id
                return
            }

            this.currentProductId = null
        },
    },
}
</script>

<style scoped>
.product-management {
    display: flex;
    flex-direction: column;
    gap: 16px;
    height: 100%;
    overflow: hidden;
}

.pm-title {
    font-size: 1.4rem;
    font-weight: 600;
    margin-bottom: 8px;
    flex-shrink: 0;
}

.pm-layout {
    display: grid;
    grid-template-columns: 1.1fr 1fr;
    gap: 32px; /* กว้างขึ้นนิดหน่อยให้ดูโปร่ง */
    align-items: stretch;
    flex: 1;
    min-height: 0;
}

.pm-column {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
}

.pm-section-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1e293b;
    flex-shrink: 0;
}

.pm-list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    height: 40px; /* ยึดความสูงให้เท่ากับฝั่งซ้าย */
}

.pm-filter {
    display: flex;
    gap: 8px;
    align-items: center;
}

.filter-select {
    padding: 6px 12px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    background: white;
    font-size: 0.9rem;
    color: #475569;
    outline: none;
    cursor: pointer;
    transition: border-color 0.2s;
}

.filter-select:focus {
    border-color: #3b82f6;
}

.pm-form,
.pm-list {
    background: white;
    padding: 24px;
    border-radius: 16px;
    box-shadow:
        0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
    flex: 1; /* ยืดเต็มพื้นที่ที่เหลือใน pm-column */
    overflow-y: auto;
    display: flex;
    flex-direction: column;
}

.pm-list {
    padding: 0;
}

/* Custom Scrollbar Styles */
.pm-form::-webkit-scrollbar,
.pm-list::-webkit-scrollbar {
    width: 6px;
}

.pm-form::-webkit-scrollbar-track,
.pm-list::-webkit-scrollbar-track {
    background: transparent;
}

.pm-form::-webkit-scrollbar-thumb,
.pm-list::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}

.pm-form::-webkit-scrollbar-thumb:hover,
.pm-list::-webkit-scrollbar-thumb:hover {
    background: #cbd5e1;
}

.pm-form-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    flex-shrink: 0;
}

.pm-form-actions {
    align-items: center;
    display: flex;
    gap: 8px;
}

.btn-primary.small {
    background: #2563eb;
    border: 0;
    border-radius: 6px;
    color: #fff;
    cursor: pointer;
    font-family: inherit;
    font-size: 0.85rem;
    font-weight: 600;
    padding: 7px 14px;
    transition: background 0.15s ease, opacity 0.15s ease;
}

.btn-primary.small:hover:not(:disabled) {
    background: #1d4ed8;
}

.btn-primary.small:disabled,
.btn-secondary.small:disabled {
    cursor: not-allowed;
    opacity: 0.6;
}

.pm-list-placeholder {
    font-size: 0.9rem;
    color: #6b7280;
    padding: 20px;
    text-align: center;
}

.pm-table-wrapper {
    flex: 1;
    overflow-y: visible; /* We use the parent (pm-list) for scrolling */
}

.pm-table {
    width: 100%;
    border-collapse: separate; /* Required for sticky border to look good */
    border-spacing: 0;
    font-size: 0.9rem;
}

.pm-table th,
.pm-table td {
    padding: 12px 10px;
    border-bottom: 1px solid #f1f5f9;
    text-align: left;
    vertical-align: middle;
}

.pm-table th {
    background: #f8fafc;
    font-weight: 600;
    color: #475569;
    position: sticky;
    top: 0;
    z-index: 10;
    box-shadow: 0 1px 0 #e2e8f0; /* เส้นแบ่งใต้หัวตารางเวลาเลื่อน */
}

.col-image img {
    width: 56px;
    height: 56px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
}

.image-placeholder {
    width: 56px;
    height: 56px;
    border-radius: 8px;
    border: 1px dashed #cbd5e1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    color: #94a3b8;
    background: #f8fafc;
}

.btn-ghost {
    padding: 6px 12px;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
    background: white;
    font-size: 0.85rem;
    color: #475569;
    cursor: pointer;
    margin-right: 6px;
    transition: all 0.2s;
}

.btn-ghost:hover {
    background: #f1f5f9;
    color: #1e293b;
    border-color: #cbd5e1;
}

.btn-danger {
    padding: 6px 12px;
    border-radius: 6px;
    border: none;
    background: #fee2e2;
    color: #dc2626;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-danger:hover {
    background: #fecaca;
    color: #b91c1c;
}

.btn-secondary.small {
    padding: 6px 12px;
    font-size: 0.85rem;
    border-radius: 6px;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
}

.error-text {
    margin-top: 12px;
    color: #dc2626;
    font-size: 0.85rem;
    padding: 8px;
    background: #fef2f2;
    border-radius: 6px;
}
</style>
