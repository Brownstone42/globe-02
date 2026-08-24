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

        <div v-for="group in listGroups" :key="group.key" class="form-group list-group">
            <label>{{ group.label }}</label>
            <div v-for="(item, index) in form[group.key]" :key="`${group.key}-${index}`" class="list-row">
                <input v-model="form[group.key][index]" type="text" class="form-input" :placeholder="`${group.label} ข้อที่ ${index + 1}`" />
                <button type="button" class="btn-remove" :aria-label="`ลบ${group.label}ข้อที่ ${index + 1}`" @click="removeListItem(group.key, index)">×</button>
            </div>
            <button type="button" class="btn-add" @click="addListItem(group.key)">+ เพิ่ม{{ group.label }}</button>
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
            <input ref="mainImageInput" type="file" accept="image/*" @change="onMainImageChange" class="form-file" />
            <div v-if="mainImagePreview" class="image-preview">
                <img :src="mainImagePreview" alt="Main preview" />
            </div>
        </div>

        <div class="form-group">
            <label>รูปภาพเพิ่มเติม (ไม่เกิน 4 รูป)</label>
            <input ref="galleryInput" type="file" accept="image/*" multiple @change="onGalleryChange" class="form-file" />
            <div v-if="galleryPreviews.length" class="gallery-preview">
                <div v-for="(src, index) in galleryPreviews" :key="index" class="thumb">
                    <img :src="src" alt="Gallery preview" />
                    <button type="button" class="thumb-remove" :aria-label="`ลบรูปที่ ${index + 1}`" @click="removeGalleryImage(index)">×</button>
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
                highlights: [''],
                properties: [''],
                specifications: [''],
                standards: [''],
                brand: '',
                sku: '',
                category: '',
                packing: '',
                mainImageFile: null,
                existingGalleryImageUrls: [],
                galleryImageFiles: [],
            },
            mainImagePreview: null,
            newGalleryPreviews: [],
            isEditMode: false,
            listGroups: [
                { key: 'highlights', label: 'จุดเด่นสินค้า' },
                { key: 'properties', label: 'คุณสมบัติ' },
                { key: 'specifications', label: 'สเปคสินค้า' },
                { key: 'standards', label: 'มาตรฐานและการรับรอง' },
            ],
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
        galleryPreviews() {
            return [...this.form.existingGalleryImageUrls, ...this.newGalleryPreviews]
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
                    this.form.highlights = this.asEditableList(newVal.highlights)
                    this.form.properties = this.asEditableList(newVal.properties)
                    this.form.specifications = this.asEditableList(newVal.specifications)
                    this.form.standards = this.asEditableList(newVal.standards)
                    this.form.brand = newVal.brand || ''
                    this.form.sku = newVal.sku || ''
                    this.form.packing = newVal.packing || ''
                    this.form.category = newVal.category || ''
                    this.mainImagePreview = newVal.mainImageUrl || null
                    this.form.existingGalleryImageUrls = Array.isArray(newVal.galleryImageUrls)
                        ? [...newVal.galleryImageUrls]
                        : []
                    this.form.mainImageFile = null
                    this.form.galleryImageFiles = []
                    this.newGalleryPreviews = []
                    this.$nextTick(() => this.clearFileInputs())
                } else {
                    this.isEditMode = false
                    this.resetForm()
                }
            },
        },
    },
    methods: {
        clearFileInputs() {
            if (this.$refs.mainImageInput) this.$refs.mainImageInput.value = ''
            if (this.$refs.galleryInput) this.$refs.galleryInput.value = ''
        },
        asEditableList(value) {
            return Array.isArray(value) && value.length ? [...value] : ['']
        },
        addListItem(key) {
            this.form[key].push('')
        },
        removeListItem(key, index) {
            this.form[key].splice(index, 1)
            if (!this.form[key].length) this.form[key].push('')
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
            const availableSlots = 4 - this.galleryPreviews.length
            const fileArray = Array.from(files).slice(0, Math.max(availableSlots, 0))
            if (files.length > availableSlots) alert('รูปภาพเพิ่มเติมรวมกันได้ไม่เกิน 4 รูป')
            this.form.galleryImageFiles.push(...fileArray)
            this.newGalleryPreviews.push(...fileArray.map((file) => URL.createObjectURL(file)))
            event.target.value = ''
        },
        removeGalleryImage(index) {
            const existingCount = this.form.existingGalleryImageUrls.length
            if (index < existingCount) {
                this.form.existingGalleryImageUrls.splice(index, 1)
                return
            }
            const newIndex = index - existingCount
            URL.revokeObjectURL(this.newGalleryPreviews[newIndex])
            this.newGalleryPreviews.splice(newIndex, 1)
            this.form.galleryImageFiles.splice(newIndex, 1)
        },
        resetForm() {
            this.form = {
                name: '',
                shortDescription: '',
                description: '',
                highlights: [''],
                properties: [''],
                specifications: [''],
                standards: [''],
                brand: '',
                sku: '',
                category: '',
                packing: '',
                mainImageFile: null,
                existingGalleryImageUrls: [],
                galleryImageFiles: [],
            }
            this.mainImagePreview = null
            this.newGalleryPreviews.forEach((url) => URL.revokeObjectURL(url))
            this.newGalleryPreviews = []
            this.$nextTick(() => this.clearFileInputs())
        },
        async handleSubmit() {
            const wasEditing = this.isEditMode && this.editingProduct && this.editingProduct.id
            const savedProduct = wasEditing
                ? { id: this.editingProduct.id, category: this.form.category }
                : null

            if (wasEditing) {
                await this.productStore.updateProduct(this.editingProduct.id, this.form)
            } else {
                await this.productStore.saveProduct(this.form)
            }

            if (!this.productStore.error) {
                alert(this.isEditMode ? 'อัปเดตสินค้าสำเร็จ' : 'บันทึกสินค้าเรียบร้อย')
                if (!this.isEditMode) {
                    this.resetForm()
                }
                this.$emit('saved', {
                    mode: wasEditing ? 'update' : 'create',
                    product: savedProduct,
                })
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

.thumb { position: relative; }
.thumb-remove {
    align-items: center;
    background: #dc2626;
    border: 0;
    border-radius: 50%;
    color: #fff;
    cursor: pointer;
    display: flex;
    font-size: 0.9rem;
    height: 20px;
    justify-content: center;
    padding: 0;
    position: absolute;
    right: -6px;
    top: -6px;
    width: 20px;
}

.form-actions {
    margin-top: 8px;
}

.list-group { gap: 7px; }
.list-row { display: flex; gap: 8px; }
.btn-add {
    align-self: flex-start;
    background: #f5f6f7;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    color: #23272d;
    cursor: pointer;
    padding: 6px 11px;
}
.btn-add:hover { border-color: #a0805b; color: #a0805b; }
.btn-remove {
    background: #fee2e2;
    border: 0;
    border-radius: 6px;
    color: #b91c1c;
    cursor: pointer;
    flex: 0 0 34px;
    font-size: 1.2rem;
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
