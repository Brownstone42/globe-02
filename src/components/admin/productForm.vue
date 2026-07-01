<template>
    <form class="product-form" @submit.prevent="handleSubmit">
        <div class="form-group">
            <label for="name">ชื่อสินค้า</label>
            <input id="name" type="text" v-model="form.name" class="form-input" placeholder="-" required />
        </div>

        <div class="form-group">
            <label for="shortDescription">รายละเอียดย่อ</label>
            <input id="shortDescription" type="text" v-model="form.shortDescription" class="form-input" placeholder="-" />
        </div>

        <div class="form-group">
            <label for="description">รายละเอียดสินค้า</label>
            <textarea id="description" v-model="form.description" class="form-textarea" rows="4" placeholder="-"></textarea>
        </div>

        <div class="form-group">
            <label for="highlights">จุดเด่นสินค้า</label>
            <textarea id="highlights" v-model="form.highlights" class="form-textarea" rows="2" placeholder="-"></textarea>
        </div>

        <div class="form-group">
            <label for="spec">ข้อมูลทางเทคนิค</label>
            <textarea id="spec" v-model="form.spec" class="form-textarea" rows="2" placeholder="-"></textarea>
        </div>

        <div class="form-group">
            <label for="standards">มาตรฐานและการรับรอง</label>
            <textarea id="standards" v-model="form.standards" class="form-textarea" rows="2" placeholder="-"></textarea>
        </div>

        <div class="form-group">
            <label for="suitableIndustries">เหมาะสำหรับอุตสาหกรรมอะไร</label>
            <textarea id="suitableIndustries" v-model="form.suitableIndustries" class="form-textarea" rows="2" placeholder="-"></textarea>
        </div>

        <div class="form-group">
            <label for="usecase">การใช้งานแนะนำ</label>
            <textarea id="usecase" v-model="form.usecase" class="form-textarea" rows="2" placeholder="-"></textarea>
        </div>

        <div class="form-group">
            <label for="protectionProperties">คุณสมบัติการป้องกัน</label>
            <textarea id="protectionProperties" v-model="form.protectionProperties" class="form-textarea" rows="2" placeholder="-"></textarea>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label for="brand">ยี่ห้อ</label>
                <input id="brand" type="text" v-model="form.brand" class="form-input" placeholder="-" />
            </div>
            <div class="form-group">
                <label for="sku">SKU</label>
                <input id="sku" type="text" v-model="form.sku" class="form-input" placeholder="-" />
            </div>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label for="category">หมวดหมู่</label>
                <select id="category" v-model="form.category" class="form-select" required>
                    <option value="" disabled>-- เลือกหมวดหมู่ --</option>
                    <option v-for="cat in categoryOptions" :key="cat.id" :value="cat.slug">
                        {{ cat.name }}
                    </option>
                </select>
            </div>
            <div class="form-group">
                <label for="packing">แพคกิ้ง</label>
                <input id="packing" type="text" v-model="form.packing" class="form-input" placeholder="-" />
            </div>
        </div>

        <div class="form-group">
            <label>รูปภาพหลัก</label>
            <input type="file" accept="image/*" @change="onMainImageChange" class="form-file" />
            <div v-if="mainImagePreview" class="image-preview">
                <img :src="mainImagePreview" alt="Main preview" />
            </div>
        </div>

        <div class="form-group">
            <label>รูปภาพเพิ่มเติม</label>
            <input type="file" accept="image/*" multiple @change="onGalleryChange" class="form-file" />
            <div v-if="galleryPreviews.length" class="gallery-preview">
                <div v-for="(src, index) in galleryPreviews" :key="index" class="thumb">
                    <img :src="src" alt="Gallery preview" />
                </div>
            </div>
        </div>

        <div class="form-actions">
            <button type="submit" class="btn-primary" :disabled="productStore.loading">
                <span v-if="productStore.loading">Saving...</span>
                <span v-else>{{ isEditMode ? 'อัปเดตสินค้า' : 'บันทึกสินค้า' }}</span>
            </button>
        </div>
    </form>
</template>

<script>
import { useProductStore } from '@/stores/productStore'
import { useCategoryStore } from '@/stores/categoryStore'

export default {
    name: 'ProductForm',
    props: {
        editingProduct: {
            type: Object,
            default: null,
        },
    },
    emits: ['saved'],
    data() {
        return {
            form: {
                name: '',
                shortDescription: '',
                description: '',
                highlights: '',
                spec: '',
                standards: '',
                suitableIndustries: '',
                usecase: '',
                protectionProperties: '',
                brand: '',
                sku: '',
                category: '',
                packing: '',
                mainImageFile: null,
                galleryImageFiles: [],
            },
            mainImagePreview: null,
            galleryPreviews: [],
            isEditMode: false,
        }
    },
    computed: {
        productStore() {
            return useProductStore()
        },
        categoryStore() {
            return useCategoryStore()
        },
        categoryOptions() {
            return this.categoryStore.sortedCategories || []
        },
    },
    async mounted() {
        if (!this.categoryStore.categories || !this.categoryStore.categories.length) {
            await this.categoryStore.loadCategories()
        }
    },
    watch: {
        editingProduct: {
            immediate: true,
            handler(newVal) {
                if (newVal) {
                    this.isEditMode = true
                    this.form.name = newVal.name || ''
                    this.form.shortDescription = newVal.shortDescription || ''
                    this.form.description = newVal.description || ''
                    this.form.highlights = newVal.highlights || ''
                    this.form.spec = newVal.spec || ''
                    this.form.standards = newVal.standards || ''
                    this.form.suitableIndustries = newVal.suitableIndustries || ''
                    this.form.usecase = newVal.usecase || ''
                    this.form.protectionProperties = newVal.protectionProperties || ''
                    this.form.brand = newVal.brand || ''
                    this.form.sku = newVal.sku || ''
                    this.form.packing = newVal.packing || ''
                    this.form.category = newVal.category || ''
                    this.mainImagePreview = newVal.mainImageUrl || null
                    this.galleryPreviews = Array.isArray(newVal.galleryImageUrls)
                        ? [...newVal.galleryImageUrls]
                        : []
                    this.form.mainImageFile = null
                    this.form.galleryImageFiles = []
                } else {
                    this.isEditMode = false
                    this.resetForm()
                }
            },
        },
    },
    methods: {
        onMainImageChange(event) {
            const file = event.target.files && event.target.files[0]
            if (!file) return
            this.form.mainImageFile = file
            this.mainImagePreview = URL.createObjectURL(file)
        },
        onGalleryChange(event) {
            const files = event.target.files
            if (!files || !files.length) return
            const fileArray = Array.from(files).slice(0, 4)
            this.form.galleryImageFiles = fileArray
            this.galleryPreviews = fileArray.map((f) => URL.createObjectURL(f))
        },
        resetForm() {
            this.form = {
                name: '',
                shortDescription: '',
                description: '',
                highlights: '',
                spec: '',
                standards: '',
                suitableIndustries: '',
                usecase: '',
                protectionProperties: '',
                brand: '',
                sku: '',
                category: '',
                packing: '',
                mainImageFile: null,
                galleryImageFiles: [],
            }
            this.mainImagePreview = null
            this.galleryPreviews = []
        },
        async handleSubmit() {
            if (this.isEditMode && this.editingProduct && this.editingProduct.id) {
                await this.productStore.updateProduct(this.editingProduct.id, this.form)
            } else {
                await this.productStore.saveProduct(this.form)
            }

            if (!this.productStore.error) {
                alert(this.isEditMode ? 'อัปเดตสินค้าสำเร็จ' : 'บันทึกสินค้าเรียบร้อย')
                if (!this.isEditMode) {
                    this.resetForm()
                }
                this.$emit('saved')
            } else {
                alert(this.productStore.error || 'เกิดข้อผิดพลาด')
            }
        },
    },
}
</script>

<style scoped>
.product-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #374151;
}

.form-input,
.form-select {
    width: 100%;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    padding: 6px 8px;
    font-size: 0.9rem;
    color: #1e293b;
    background: white;
    box-sizing: border-box;
}

.form-textarea {
    width: 100%;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    padding: 6px 8px;
    font-size: 0.9rem;
    color: #1e293b;
    background: white;
    resize: vertical;
    box-sizing: border-box;
}

.form-file {
    font-size: 0.85rem;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.image-preview img {
    max-width: 180px;
    border-radius: 6px;
    border: 1px solid #e5e7eb;
    margin-top: 6px;
}

.gallery-preview {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 6px;
}

.thumb img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 4px;
    border: 1px solid #e5e7eb;
}

.form-actions {
    margin-top: 8px;
}

.btn-primary {
    padding: 8px 16px;
    border-radius: 6px;
    border: none;
    background: #2563eb;
    color: white;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s ease, opacity 0.15s ease;
}

.btn-primary:hover {
    background: #1d4ed8;
}

.btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
</style>
