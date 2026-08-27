<template>
    <form id="admin-product-form" class="product-form" @submit.prevent="handleSubmit">
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
            <div class="list-header">
                <label>{{ group.label }}</label>
                <button type="button" class="btn-add" @click="addListItem(group.key)">+ เพิ่ม{{ group.label }}</button>
            </div>
            <div v-for="(item, index) in form[group.key]" :key="`${group.key}-${index}`" class="list-row">
                <input v-model="form[group.key][index]" type="text" class="form-input" :placeholder="`${group.label} ข้อที่ ${index + 1}`" />
                <button type="button" class="btn-remove" :aria-label="`ลบ${group.label}ข้อที่ ${index + 1}`" @click="removeListItem(group.key, index)">×</button>
            </div>
        </div>

        <div class="form-group document-group">
            <label>เอกสารที่เกี่ยวข้อง</label>
            <input ref="documentInput" type="file" multiple class="form-file" @change="onDocumentsChange" />
            <div v-for="(document, index) in form.documents" :key="document.key" class="document-row">
                <div class="document-fields">
                    <input
                        v-model="document.name"
                        type="text"
                        class="form-input"
                        :placeholder="`ชื่อเอกสารไฟล์ที่ ${index + 1}`"
                    />
                    <small>{{ document.fileName }}</small>
                </div>
                <button type="button" class="btn-remove" :aria-label="`ลบเอกสารไฟล์ที่ ${index + 1}`" @click="removeDocument(index)">×</button>
            </div>
        </div>

        <div class="form-group faq-group">
            <div class="faq-header">
                <label>คำถามที่พบบ่อย (FAQ)</label>
                <button type="button" class="btn-add" @click="addFaq">+ Add Q&amp;A</button>
            </div>
            <div class="faq-paste-area">
                <textarea
                    v-model="faqRawInput"
                    class="form-textarea"
                    rows="4"
                    placeholder="วางข้อความรูปแบบ Q: คำถาม และ A: คำตอบ จากนั้นกด Parse & Add"
                ></textarea>
                <button type="button" class="btn-parse" :disabled="!faqRawInput.trim()" @click="parseFaq">Parse &amp; Add</button>
            </div>
            <div v-if="!form.faq.length" class="empty-faq">ยังไม่มีคำถามที่พบบ่อย กด + Add Q&amp;A เพื่อเพิ่มคำถามและคำตอบ</div>
            <div v-for="(item, index) in form.faq" :key="index" class="faq-row">
                <div class="faq-inputs">
                    <input v-model="item.question" type="text" class="form-input" placeholder="กรอกคำถาม" />
                    <textarea v-model="item.answer" class="form-textarea" rows="2" placeholder="กรอกคำตอบ"></textarea>
                </div>
                <button type="button" class="btn-remove" :aria-label="`ลบคำถามข้อที่ ${index + 1}`" @click="removeFaq(index)">×</button>
            </div>
        </div>

        <div class="form-group list-group">
            <div class="list-header">
                <label>Hashtag</label>
                <button type="button" class="btn-add" :disabled="!hashtagInput.trim()" @click="addHashtags">+ เพิ่ม Hashtag</button>
            </div>
            <input
                v-model="hashtagInput"
                type="text"
                class="form-input"
                placeholder="พิมพ์ Hashtag เช่น Cleanroom, ESD, Safety แล้วกดเพิ่ม"
                @keydown.enter.prevent="addHashtags"
            />
            <div v-if="form.hashtags.length" class="hashtag-admin-list">
                <span v-for="(hashtag, index) in form.hashtags" :key="`${hashtag}-${index}`" class="hashtag-admin-chip">
                    #{{ hashtag }}
                    <button type="button" :aria-label="`ลบ Hashtag ${hashtag}`" @click="removeHashtag(index)">×</button>
                </span>
            </div>
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
                suitable: [''],
                documents: [],
                faq: [],
                hashtags: [],
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
            faqRawInput: '',
            hashtagInput: '',
            isEditMode: false,
            listGroups: [
                { key: 'highlights', label: 'จุดเด่นสินค้า' },
                { key: 'properties', label: 'คุณสมบัติ' },
                { key: 'standards', label: 'มาตรฐานและการรับรอง' },
                { key: 'specifications', label: 'สเปคสินค้า' },
                { key: 'suitable', label: 'เหมาะกับ' },
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
                    this.form.suitable = this.asEditableList(newVal.suitable)
                    this.form.documents = this.asEditableDocuments(newVal.documents)
                    this.form.faq = this.asEditableFaq(newVal.faq)
                    this.form.hashtags = this.asEditableHashtags(newVal.hashtags)
                    this.faqRawInput = ''
                    this.hashtagInput = ''
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
            if (this.$refs.documentInput) this.$refs.documentInput.value = ''
        },
        asEditableList(value) {
            return Array.isArray(value) && value.length ? [...value] : ['']
        },
        asEditableDocuments(value) {
            if (!Array.isArray(value)) return []
            return value
                .filter((item) => item && item.url)
                .map((item, index) => ({
                    key: `existing-${index}-${item.url}`,
                    name: item.name || item.fileName || 'ดาวน์โหลดเอกสาร',
                    fileName: item.fileName || item.name || 'ไฟล์เดิม',
                    url: item.url,
                    file: null,
                }))
        },
        asEditableFaq(value) {
            if (!Array.isArray(value)) return []
            return value.map((item) => ({
                question: item?.question || '',
                answer: item?.answer || '',
            }))
        },
        asEditableHashtags(value) {
            if (!Array.isArray(value)) return []
            return value
                .map((item) => String(item || '').replace(/^#+/, '').trim())
                .filter(Boolean)
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
        onDocumentsChange(event) {
            const files = Array.from(event.target.files || [])
            files.forEach((file) => {
                this.form.documents.push({
                    key: `new-${Date.now()}-${Math.random().toString(36).slice(2)}`,
                    name: file.name.replace(/\.[^.]+$/, ''),
                    fileName: file.name,
                    url: '',
                    file,
                })
            })
            event.target.value = ''
        },
        removeDocument(index) {
            this.form.documents.splice(index, 1)
        },
        addFaq() {
            this.form.faq.push({ question: '', answer: '' })
        },
        removeFaq(index) {
            this.form.faq.splice(index, 1)
        },
        addHashtags() {
            const hashtags = this.hashtagInput
                .split(/[,，\n]+/)
                .map((item) => item.replace(/^#+/, '').trim())
                .filter(Boolean)
            hashtags.forEach((hashtag) => {
                const exists = this.form.hashtags.some(
                    (item) => String(item).toLocaleLowerCase() === hashtag.toLocaleLowerCase(),
                )
                if (!exists) this.form.hashtags.push(hashtag)
            })
            this.hashtagInput = ''
        },
        removeHashtag(index) {
            this.form.hashtags.splice(index, 1)
        },
        parseFaq() {
            const lines = this.faqRawInput.split('\n').map((line) => line.trim()).filter(Boolean)
            const pairs = []
            let current = null
            for (const line of lines) {
                if (/^Q:/i.test(line)) {
                    if (current) pairs.push(current)
                    current = { question: line.replace(/^Q:\s*/i, '').trim(), answer: '' }
                } else if (/^A:/i.test(line) && current) {
                    current.answer = line.replace(/^A:\s*/i, '').trim()
                }
            }
            if (current) pairs.push(current)
            this.form.faq.push(...pairs)
            this.faqRawInput = ''
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
                suitable: [''],
                documents: [],
                faq: [],
                hashtags: [],
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
            this.faqRawInput = ''
            this.hashtagInput = ''
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

.list-group { gap: 7px; }
.list-header { align-items: center; display: flex; justify-content: space-between; }
.list-row { display: flex; gap: 8px; }
.btn-add {
    align-self: flex-start;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 999px;
    color: #3b82f6;
    cursor: pointer;
    font-size: 0.8rem;
    font-weight: 600;
    padding: 4px 12px;
    transition: all 0.2s;
}
.btn-add:hover { background: #eff6ff; border-color: #3b82f6; }
.btn-add:disabled { cursor: not-allowed; opacity: 0.45; }
.btn-remove {
    background: #fee2e2;
    border: 0;
    border-radius: 6px;
    color: #b91c1c;
    cursor: pointer;
    flex: 0 0 34px;
    font-size: 1.2rem;
}

.document-group { gap: 8px; }
.document-row {
    align-items: stretch;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 7px;
    display: flex;
    gap: 8px;
    padding: 9px;
}
.document-fields { flex: 1; min-width: 0; }
.document-fields small {
    color: #64748b;
    display: block;
    margin-top: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.faq-group { gap: 8px; }
.faq-header { align-items: center; display: flex; justify-content: space-between; }
.faq-paste-area {
    background: #f8fafc;
    border: 1px dashed #cbd5e1;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 7px;
    padding: 10px;
}
.btn-parse {
    align-self: flex-start;
    background: #eff6ff;
    border: 1px solid #3b82f6;
    border-radius: 999px;
    color: #2563eb;
    cursor: pointer;
    font-size: 0.8rem;
    font-weight: 600;
    padding: 5px 14px;
    transition: all 0.2s;
}
.btn-parse:hover:not(:disabled) { background: #dbeafe; }
.btn-parse:disabled { cursor: not-allowed; opacity: 0.45; }
.empty-faq { color: #64748b; font-size: 0.85rem; }
.faq-row {
    align-items: stretch;
    background: #f8fafc;
    border-radius: 8px;
    display: flex;
    gap: 8px;
    padding: 10px;
}
.faq-inputs { display: flex; flex: 1; flex-direction: column; gap: 6px; min-width: 0; }
.hashtag-admin-list { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 3px; }
.hashtag-admin-chip {
    align-items: center;
    background: #a0805b;
    border-radius: 999px;
    color: #fff;
    display: inline-flex;
    font-size: 0.82rem;
    font-weight: 600;
    gap: 7px;
    padding: 6px 7px 6px 12px;
}
.hashtag-admin-chip button {
    align-items: center;
    background: rgba(255, 255, 255, 0.22);
    border: 0;
    border-radius: 50%;
    color: #fff;
    cursor: pointer;
    display: inline-flex;
    font-size: 1rem;
    height: 20px;
    justify-content: center;
    line-height: 1;
    padding: 0;
    width: 20px;
}
.hashtag-admin-chip button:hover { background: rgba(255, 255, 255, 0.38); }

</style>
