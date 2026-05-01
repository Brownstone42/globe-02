<template>
    <div class="product-management">
        <div class="pm-layout">
            <!-- FORM (Left Column) -->
            <div class="pm-column">
                <div class="pm-form-header">
                    <h2 class="pm-section-title">
                        {{ editingProduct ? 'Editing: ' + editingProduct.name : 'Select a Product' }}
                    </h2>
                </div>
                <section class="pm-form">
                    <div v-if="!editingProduct" class="form-placeholder">
                        <i class="fa-solid fa-pen-to-square"></i>
                        <p>เลือกสินค้าจากรายการด้านขวาเพื่อเริ่มกรอกรายละเอียด</p>
                    </div>

                    <form v-else @submit.prevent="handleSaveDetail" class="detail-edit-form">
                        <div class="form-group">
                            <label for="details">1. รายละเอียดสินค้า (Detail)</label>
                            <textarea
                                id="details"
                                v-model="form.details"
                                rows="4"
                                placeholder="รายละเอียดข้อมูลทั่วไปของสินค้า..."
                                class="form-textarea"
                            ></textarea>
                        </div>

                        <div class="form-group">
                            <label for="spec">2. คุณสมบัติทางเทคนิค (Spec)</label>
                            <textarea
                                id="spec"
                                v-model="form.spec"
                                rows="4"
                                placeholder="ข้อมูลคุณสมบัติทางเทคนิค (Specification)..."
                                class="form-textarea"
                            ></textarea>
                        </div>

                        <div class="form-group">
                            <label for="usecase">3. การใช้งาน (Usecase)</label>
                            <textarea
                                id="usecase"
                                v-model="form.usecase"
                                rows="4"
                                placeholder="ตัวอย่างการนำไปใช้งานหรือกรณีศึกษา..."
                                class="form-textarea"
                            ></textarea>
                        </div>

                        <div class="form-actions-sticky">
                            <button
                                type="submit"
                                class="btn-primary-large"
                                :disabled="productStore.loading"
                            >
                                <span v-if="productStore.loading">บันทึกข้อมูล...</span>
                                <span v-else>บันทึกรายละเอียดทั้งหมด</span>
                            </button>
                        </div>
                    </form>
                </section>
            </div>

            <!-- LIST (Right Column) -->
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
                                    <th style="width: 80px">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="product in filteredProducts"
                                    :key="product.id"
                                    :class="{ 'row-active': currentProductId === product.id }"
                                >
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
                                            จัดการ
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
import { useProductStore } from '@/stores/productStore'
import { useCategoryStore } from '@/stores/categoryStore'

export default {
    name: 'ProductDetailManagement',
    data() {
        return {
            currentProductId: null,
            filterCategory: '',
            form: {
                details: '',
                spec: '',
                usecase: '',
            },
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
            return this.products.find((p) => p.id === this.currentProductId)
        },
    },
    async mounted() {
        await this.productStore.fetchProducts()
        if (!this.categoryStore.categories || !this.categoryStore.categories.length) {
            await this.categoryStore.loadCategories()
        }
    },
    methods: {
        startEdit(product) {
            this.currentProductId = product.id
            // Load existing data into form
            this.form.details = product.details || ''
            this.form.spec = product.spec || ''
            this.form.usecase = product.usecase || ''
        },
        async handleSaveDetail() {
            if (!this.currentProductId) return

            try {
                // We use updateProduct which already handles these fields now
                await this.productStore.updateProduct(this.currentProductId, {
                    ...this.editingProduct, // Keep existing fields
                    details: this.form.details,
                    spec: this.form.spec,
                    usecase: this.form.usecase,
                })

                if (!this.productStore.error) {
                    alert('บันทึกรายละเอียดสินค้าเรียบร้อยแล้ว')
                } else {
                    alert('เกิดข้อผิดพลาด: ' + this.productStore.error)
                }
            } catch (err) {
                console.error(err)
                alert('เกิดข้อผิดพลาดในการบันทึก')
            }
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

.pm-layout {
    display: grid;
    grid-template-columns: 1.1fr 1.1fr; /* Equal or slight variation */
    gap: 32px;
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
    height: 40px;
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
    position: relative;
}

.detail-edit-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-textarea {
    width: 100%;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 12px 16px;
    font-size: 0.95rem;
    line-height: 1.6;
    color: #1e293b;
    background: #f8fafc;
    resize: vertical;
    transition: all 0.2s;
}

.form-textarea:focus {
    outline: none;
    border-color: #3b82f6;
    background: white;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.form-actions-sticky {
    position: sticky;
    bottom: -24px; /* Align with padding */
    left: -24px;
    right: -24px;
    background: white;
    padding: 16px 0;
    border-top: 1px solid #f1f5f9;
    margin-top: 12px;
    z-index: 5;
}

.btn-primary-large {
    width: 100%;
    background: #2563eb;
    color: white;
    border: none;
    border-radius: 12px;
    padding: 14px;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
}

.btn-primary-large:hover {
    background: #1d4ed8;
    transform: translateY(-1px);
    box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
}

.btn-primary-large:disabled {
    background: #94a3b8;
    cursor: not-allowed;
    transform: none;
}

.row-active {
    background-color: #f0f9ff !important;
}

.row-active td {
    border-bottom-color: #bae6fd !important;
}

.pm-list {
    padding: 0;
}

/* Custom Scrollbar Styles */
.pm-form::-webkit-scrollbar,
.pm-list::-webkit-scrollbar {
    width: 6px;
}

.pm-form::-webkit-scrollbar-thumb,
.pm-list::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}

.form-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #94a3b8;
    text-align: center;
    gap: 16px;
}

.form-placeholder i {
    font-size: 3rem;
    opacity: 0.3;
}

.pm-list-placeholder {
    font-size: 0.9rem;
    color: #6b7280;
    padding: 20px;
    text-align: center;
}

.pm-table-wrapper {
    flex: 1;
}

.pm-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    font-size: 0.9rem;
}

.pm-table th,
.pm-table td {
    padding: 12px 10px;
    border-bottom: 1px solid #f1f5f9;
    text-align: left;
}

.pm-table th {
    background: #f8fafc;
    font-weight: 600;
    color: #475569;
    position: sticky;
    top: 0;
    z-index: 10;
    box-shadow: 0 1px 0 #e2e8f0;
}

.col-image img {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
}

.image-placeholder {
    width: 50px;
    height: 50px;
    border-radius: 8px;
    border: 1px dashed #cbd5e1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    color: #94a3b8;
}

.btn-ghost {
    padding: 6px 12px;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
    background: white;
    font-size: 0.85rem;
    color: #2563eb;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-ghost:hover {
    background: #eff6ff;
    border-color: #3b82f6;
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
