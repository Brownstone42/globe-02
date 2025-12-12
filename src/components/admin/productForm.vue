<template>
    <form class="product-form" @submit.prevent="handleSubmit">
        <!-- 1. ชื่อ -->
        <div class="form-group">
            <label for="name">ชื่อสินค้า (name)</label>
            <input id="name" type="text" v-model="form.name" class="form-input" required />
        </div>

        <!-- 2. รายละเอียด -->
        <div class="form-group">
            <label for="description">รายละเอียด (description)</label>
            <textarea
                id="description"
                v-model="form.description"
                class="form-textarea"
                rows="3"
            ></textarea>
        </div>

        <!-- 3. ยี่ห้อ -->
        <div class="form-group">
            <label for="brand">ยี่ห้อ (brand)</label>
            <input id="brand" type="text" v-model="form.brand" class="form-input" />
        </div>

        <!-- 4. SKU -->
        <div class="form-group">
            <label for="sku">SKU</label>
            <input id="sku" type="text" v-model="form.sku" class="form-input" />
        </div>

        <!-- 4.5 Category -->
        <div class="form-group">
            <label for="category">หมวดหมู่ (category)</label>
            <select id="category" v-model="form.category" class="form-select" required>
                <option value="" disabled>-- เลือกหมวดหมู่ --</option>
                <option v-for="cat in categoryOptions" :key="cat.id" :value="cat.slug">
                    {{ cat.name }}
                </option>
            </select>
        </div>

        <!-- 5. มาตรฐาน (standards) -->
        <div class="form-group">
            <label>มาตรฐาน (standards)</label>

            <!-- select สำหรับเลือกมาตรฐานจาก list -->
            <div class="standards-row">
                <select v-model="tempStandard" class="form-select">
                    <option value="" disabled>-- เลือกมาตรฐาน --</option>
                    <option v-for="std in availableStandards" :key="std" :value="std">
                        {{ std }}
                    </option>
                </select>
                <button type="button" class="btn-secondary" @click="addStandard">เพิ่ม</button>
            </div>

            <!-- แสดง standards ที่เลือกแล้ว -->
            <div class="standards-chips" v-if="form.standards.length">
                <span v-for="std in form.standards" :key="std" class="chip">
                    {{ std }}
                    <button type="button" class="chip-remove" @click="removeStandard(std)">
                        ×
                    </button>
                </span>
            </div>

            <p v-if="standardError" class="error-text">
                {{ standardError }}
            </p>
        </div>

        <!-- 6. แพคกิ้ง -->
        <div class="form-group">
            <label for="packing">แพคกิ้ง (packing)</label>
            <input id="packing" type="text" v-model="form.packing" class="form-input" />
        </div>

        <!-- 7. รูปภาพ -->
        <div class="form-group">
            <label>รูปภาพหลัก (mainImage)</label>
            <input type="file" accept="image/*" @change="onMainImageChange" />
            <div v-if="mainImagePreview" class="image-preview">
                <img :src="mainImagePreview" alt="Main preview" />
            </div>
        </div>

        <div class="form-group">
            <label>รูปภาพเพิ่มเติม (galleryImages)</label>
            <input type="file" accept="image/*" multiple @change="onGalleryChange" />

            <div v-if="galleryPreviews.length" class="gallery-preview">
                <div v-for="(src, index) in galleryPreviews" :key="index" class="thumb">
                    <img :src="src" alt="Gallery preview" />
                </div>
            </div>
        </div>

        <div class="form-actions">
            <button type="submit" class="btn-primary" :disabled="productStore.loading">
                <span v-if="productStore.loading">Saving...</span>
                <span v-else>
                    {{ isEditMode ? 'อัปเดตสินค้า' : 'บันทึกสินค้า' }}
                </span>
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
                description: '',
                brand: '',
                sku: '',
                standards: [],
                packing: '',
                mainImageFile: null,
                galleryImageFiles: [],
                category: '',
            },
            availableStandards: ['ISO 9001', 'ISO 14001', 'CE', 'RoHS'],
            tempStandard: '',
            standardError: '',
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
                    // เติมค่าให้ฟอร์มจาก product ที่เลือก
                    this.form.name = newVal.name || ''
                    this.form.description = newVal.description || ''
                    this.form.brand = newVal.brand || ''
                    this.form.sku = newVal.sku || ''
                    this.form.packing = newVal.packing || ''
                    this.form.category = newVal.category || ''
                    this.form.standards = Array.isArray(newVal.standards)
                        ? [...newVal.standards]
                        : []

                    // preview จาก URL เดิม
                    this.mainImagePreview = newVal.mainImageUrl || null
                    this.galleryPreviews = Array.isArray(newVal.galleryImageUrls)
                        ? [...newVal.galleryImageUrls]
                        : []

                    // reset file input (ถือว่าเวลายังไม่เลือกไฟล์ใหม่)
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
        addStandard() {
            this.standardError = ''

            if (!this.tempStandard) {
                this.standardError = 'กรุณาเลือกมาตรฐานก่อน'
                return
            }

            if (this.form.standards.includes(this.tempStandard)) {
                this.standardError = 'มาตรฐานนี้ถูกเลือกแล้ว'
                return
            }

            this.form.standards.push(this.tempStandard)
            this.tempStandard = ''
        },
        removeStandard(std) {
            this.form.standards = this.form.standards.filter((item) => item !== std)
        },
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
            this.galleryPreviews = fileArray.map((file) => URL.createObjectURL(file))
        },
        resetForm() {
            this.form = {
                name: '',
                description: '',
                brand: '',
                sku: '',
                standards: [],
                packing: '',
                mainImageFile: null,
                galleryImageFiles: [],
                category: '',
            }
            this.tempStandard = ''
            this.standardError = ''
            this.mainImagePreview = null
            this.galleryPreviews = []
        },
        async handleSubmit() {
            // บันทึก/อัปเดต
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

.form-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.form-input,
.form-textarea,
.form-select,
.form-select {
    border: 1px solid #d1d5db;
    border-radius: 6px;
    padding: 6px 8px;
    font-size: 0.9rem;
}

.form-textarea {
    resize: vertical;
}

.standards-row {
    display: flex;
    gap: 8px;
    align-items: center;
}

.standards-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 6px;
}

.chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    border-radius: 999px;
    background: #e5e7eb;
    font-size: 0.8rem;
}

.chip-remove {
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 0.9rem;
}

.error-text {
    color: #dc2626;
    font-size: 0.8rem;
}

.image-preview img {
    max-width: 180px;
    border-radius: 6px;
    border: 1px solid #e5e7eb;
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
    padding: 6px 12px;
    border-radius: 6px;
    border: none;
    background: #2563eb;
    color: white;
    font-size: 0.9rem;
    cursor: pointer;
    transition:
        background 0.15s ease,
        opacity 0.15s ease;
}

.btn-primary:hover {
    background: #1d4ed8;
}

/* ตอน disabled */
.btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-secondary {
    padding: 6px 10px;
    border-radius: 6px;
    border: 1px solid #d1d5db;
    background: white;
    font-size: 0.85rem;
    cursor: pointer;
}

.btn-secondary:hover {
    background: #f3f4f6;
}
</style>
