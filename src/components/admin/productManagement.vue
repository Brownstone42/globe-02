<!-- src/components/admin/productManagement.vue -->
<template>
    <div class="product-management">
        <h1 class="pm-title">Product Management</h1>

        <div class="pm-layout">
            <!-- FORM -->
            <section class="pm-form">
                <div class="pm-form-header">
                    <h2 class="pm-section-title">
                        {{ currentProductId ? 'Edit Product' : 'Create Product' }}
                    </h2>
                    <button
                        v-if="currentProductId"
                        type="button"
                        class="btn-secondary small"
                        @click="startCreate"
                    >
                        + สร้างสินค้าใหม่
                    </button>
                </div>

                <product-form :editing-product="editingProduct" @saved="handleSaved"></product-form>
            </section>

            <!-- LIST -->
            <section class="pm-list">
                <h2 class="pm-section-title">Product List</h2>

                <div v-if="isLoading" class="pm-list-placeholder">กำลังโหลดสินค้า...</div>

                <div v-else-if="!products.length" class="pm-list-placeholder">ยังไม่มีสินค้า</div>

                <div v-else class="pm-table-wrapper">
                    <table class="pm-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Brand</th>
                                <th>SKU</th>
                                <th style="width: 120px">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="product in products" :key="product.id">
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
                                <td>{{ product.brand }}</td>
                                <td>{{ product.sku }}</td>
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
</template>

<script>
import ProductForm from './productForm.vue'
import { useProductStore } from '@/stores/productStore'

export default {
    name: 'ProductManagement',
    components: {
        ProductForm,
    },
    data() {
        return {
            currentProductId: null, // null = create mode, not null = edit mode
        }
    },
    computed: {
        productStore() {
            return useProductStore()
        },
        products() {
            return this.productStore.products
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
        handleSaved() {
            // หลัง save หรือ update เสร็จ → กลับสู่ create mode
            this.currentProductId = null
            // ถ้าอยากแน่นอนก็ reload อีกรอบได้ (แต่ไม่จำเป็นเพราะ state update ใน store แล้ว)
            // this.productStore.fetchProducts()
        },
    },
}
</script>

<style scoped>
.product-management {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.pm-title {
    font-size: 1.4rem;
    font-weight: 600;
    margin-bottom: 8px;
}

.pm-layout {
    display: grid;
    grid-template-columns: 1.1fr 1fr;
    gap: 20px;
    align-items: flex-start;
}

.pm-section-title {
    font-size: 1.1rem;
    font-weight: 500;
    margin-bottom: 8px;
}

.pm-form,
.pm-list {
    background: white;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.pm-form-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.pm-list-placeholder {
    font-size: 0.9rem;
    color: #6b7280;
}

.pm-table-wrapper {
    overflow-x: auto;
}

.pm-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
}

.pm-table th,
.pm-table td {
    padding: 6px 8px;
    border-bottom: 1px solid #e5e7eb;
    text-align: left;
    vertical-align: middle;
}

.pm-table th {
    background: #f9fafb;
    font-weight: 500;
}

.col-image img {
    width: 48px;
    height: 48px;
    object-fit: cover;
    border-radius: 4px;
    border: 1px solid #e5e7eb;
}

.image-placeholder {
    width: 48px;
    height: 48px;
    border-radius: 4px;
    border: 1px dashed #d1d5db;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    color: #9ca3af;
}

.btn-ghost {
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid #d1d5db;
    background: white;
    font-size: 0.8rem;
    cursor: pointer;
    margin-right: 4px;
}

.btn-ghost:hover {
    background: #f3f4f6;
}

.btn-danger {
    padding: 2px 6px;
    border-radius: 4px;
    border: none;
    background: #dc2626;
    color: white;
    font-size: 0.8rem;
    cursor: pointer;
}

.btn-danger:hover {
    background: #b91c1c;
}

.btn-secondary.small {
    padding: 4px 8px;
    font-size: 0.8rem;
}
.error-text {
    margin-top: 8px;
    color: #dc2626;
    font-size: 0.8rem;
}
</style>
