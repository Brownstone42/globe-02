// src/stores/productStore.js
import { defineStore } from 'pinia'
import {
    collection,
    addDoc,
    getDocs,
    doc,
    setDoc,
    deleteDoc,
    deleteField,
    serverTimestamp,
    writeBatch,
} from 'firebase/firestore'
import { db, app } from '@/firebase'
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { uniqueProductSlug } from '@/utils/productSlug'

const productsCol = collection(db, 'products')
const storage = getStorage(app)

const PRODUCT_FIELDS = new Set([
    'name',
    'slug',
    'shortDescription',
    'description',
    'highlights',
    'properties',
    'specifications',
    'standards',
    'suitable',
    'documents',
    'faq',
    'hashtags',
    'brand',
    'sku',
    'categories',
    'packing',
    'mainImageUrl',
    'galleryImageUrls',
    'createdAt',
    'updatedAt',
])

function toItemList(value) {
    if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean)
    if (typeof value !== 'string' || !value.trim()) return []
    return value
        .split(/\r?\n/)
        .map((item) => item.replace(/^[-•]\s*/, '').trim())
        .filter(Boolean)
}

function normalizeDocuments(value) {
    if (!Array.isArray(value)) return []
    return value
        .map((item) => ({
            name: String(item?.name || item?.fileName || '').trim(),
            url: String(item?.url || '').trim(),
        }))
        .filter((item) => item.url)
}

function normalizeFaq(value) {
    if (!Array.isArray(value)) return []
    return value
        .map((item) => ({
            question: String(item?.question || '').trim(),
            answer: String(item?.answer || '').trim(),
        }))
        .filter((item) => item.question || item.answer)
}

function normalizeHashtags(value) {
    return toItemList(value)
        .map((item) => item.replace(/^#+/, '').trim())
        .filter(Boolean)
}

function normalizeCategories(value, legacyCategory = '') {
    const values = Array.isArray(value) ? value : []
    return [
        ...new Set(
            [...values, legacyCategory].map((item) => String(item || '').trim()).filter(Boolean),
        ),
    ]
}

async function uploadProductDocuments(items) {
    const documents = []
    for (const item of Array.isArray(items) ? items : []) {
        if (item?.file) {
            const file = item.file
            const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}-${file.name}`
            const fileRef = storageRef(storage, `products/documents/${uniqueName}`)
            const snapshot = await uploadBytes(fileRef, file, {
                contentDisposition: 'attachment',
                contentType: file.type || 'application/octet-stream',
            })
            documents.push({
                name: String(item.name || file.name).trim() || file.name,
                url: await getDownloadURL(snapshot.ref),
            })
        } else if (item?.url) {
            documents.push({
                name: String(item.name || item.fileName || 'ดาวน์โหลดเอกสาร').trim(),
                url: item.url,
            })
        }
    }
    return documents
}

export const useProductStore = defineStore('product', {
    state: () => ({
        products: [],
        loading: false,
        error: null,
    }),

    getters: {
        productsByCategory: (state) => (category) => {
            if (!category || category === 'all') {
                return state.products
            }
            return state.products.filter((item) =>
                normalizeCategories(item.categories, item.category).includes(category),
            )
        },
    },

    actions: {
        async fetchProducts() {
            this.loading = true
            this.error = null
            try {
                const snapshot = await getDocs(productsCol)
                const items = []
                snapshot.forEach((docSnap) => {
                    const data = docSnap.data()
                    items.push({
                        id: docSnap.id,
                        ...data,
                    })
                })
                this.products = items
            } catch (err) {
                console.error('fetchProducts error:', err)
                this.error = 'โหลดสินค้าล้มเหลว'
            } finally {
                this.loading = false
            }
        },

        async saveProduct(form) {
            this.loading = true
            this.error = null

            try {
                let mainImageUrl = null
                const galleryImageUrls = []

                // 1) upload main image
                if (form.mainImageFile) {
                    const file = form.mainImageFile
                    const filePath = `products/main/${file.name}`
                    const fileRef = storageRef(storage, filePath)

                    const snapshot = await uploadBytes(fileRef, file)
                    mainImageUrl = await getDownloadURL(snapshot.ref)
                }

                // 2) upload gallery images
                if (form.galleryImageFiles && form.galleryImageFiles.length) {
                    for (let i = 0; i < form.galleryImageFiles.length; i++) {
                        const file = form.galleryImageFiles[i]
                        const filePath = `products/gallery/${file.name}`
                        const fileRef = storageRef(storage, filePath)

                        const snapshot = await uploadBytes(fileRef, file)
                        const url = await getDownloadURL(snapshot.ref)
                        galleryImageUrls.push(url)
                    }
                }

                // 3) save to Firestore
                const documents = await uploadProductDocuments(form.documents)
                const productData = {
                    name: form.name || '',
                    slug: uniqueProductSlug(form.name, this.products),
                    shortDescription: form.shortDescription || '',
                    description: form.description || '',
                    highlights: toItemList(form.highlights),
                    properties: toItemList(form.properties),
                    specifications: toItemList(form.specifications),
                    standards: toItemList(form.standards),
                    suitable: toItemList(form.suitable),
                    documents,
                    faq: normalizeFaq(form.faq),
                    hashtags: normalizeHashtags(form.hashtags),
                    brand: form.brand || '',
                    sku: form.sku || '',
                    packing: form.packing || '',
                    mainImageUrl: mainImageUrl,
                    galleryImageUrls: galleryImageUrls,
                    categories: normalizeCategories(form.categories),
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                }

                const docRef = await addDoc(productsCol, productData)

                this.products.push({
                    id: docRef.id,
                    ...productData,
                })
            } catch (err) {
                console.error('saveProduct error:', err)
                this.error = 'บันทึกสินค้าล้มเหลว'
            } finally {
                this.loading = false
            }
        },

        async updateProduct(id, form) {
            this.loading = true
            this.error = null

            try {
                const existing = this.products.find((item) => item.id === id) || {}

                // เอาค่าเดิมเป็น base
                let mainImageUrl = existing.mainImageUrl || null
                let galleryImageUrls = Array.isArray(form.existingGalleryImageUrls)
                    ? [...form.existingGalleryImageUrls].slice(0, 4)
                    : []

                // ถ้ามีการเลือก mainImage ใหม่ → อัปใหม่ทับ
                if (form.mainImageFile) {
                    const file = form.mainImageFile
                    const filePath = `products/main/${file.name}`
                    const fileRef = storageRef(storage, filePath)

                    const snapshot = await uploadBytes(fileRef, file)
                    mainImageUrl = await getDownloadURL(snapshot.ref)
                }

                // เพิ่มรูปใหม่ต่อจากรูปเดิมที่ผู้ใช้ยังไม่ได้ลบ
                if (form.galleryImageFiles && form.galleryImageFiles.length) {
                    const files = form.galleryImageFiles.slice(0, 4 - galleryImageUrls.length)
                    for (let i = 0; i < files.length; i++) {
                        const file = files[i]
                        const filePath = `products/gallery/${file.name}`
                        const fileRef = storageRef(storage, filePath)

                        const snapshot = await uploadBytes(fileRef, file)
                        const url = await getDownloadURL(snapshot.ref)
                        galleryImageUrls.push(url)
                    }
                }

                const documents = await uploadProductDocuments(form.documents)
                const updateData = {
                    name: form.name || '',
                    slug: existing.slug || uniqueProductSlug(form.name, this.products, id),
                    shortDescription: form.shortDescription || '',
                    description: form.description || '',
                    highlights: toItemList(form.highlights),
                    properties: toItemList(form.properties),
                    specifications: toItemList(form.specifications),
                    standards: toItemList(form.standards),
                    suitable: toItemList(form.suitable),
                    documents,
                    faq: normalizeFaq(form.faq),
                    hashtags: normalizeHashtags(form.hashtags),
                    brand: form.brand || '',
                    sku: form.sku || '',
                    packing: form.packing || '',
                    categories: normalizeCategories(form.categories),
                    mainImageUrl,
                    galleryImageUrls,
                    createdAt: existing.createdAt || serverTimestamp(),
                    updatedAt: serverTimestamp(),
                }

                const docRef = doc(db, 'products', id)
                // เขียนทับด้วย schema ปัจจุบันทั้งชุด เพื่อไม่ให้ field เก่าหลงเหลือ
                await setDoc(docRef, updateData)

                // โหลดกลับจาก Firestore เพื่อไม่เก็บ FieldValue สำหรับลบไว้ใน state
                await this.fetchProducts()
            } catch (err) {
                console.error('updateProduct error:', err)
                this.error = 'อัปเดตสินค้าล้มเหลว'
            } finally {
                this.loading = false
            }
        },

        async migrateProductSchema() {
            const productsToMigrate = this.products.filter((product) => {
                const hasUnknownField = Object.keys(product).some(
                    (key) => key !== 'id' && !PRODUCT_FIELDS.has(key),
                )
                return (
                    hasUnknownField ||
                    !product.slug ||
                    !Array.isArray(product.highlights) ||
                    !Array.isArray(product.properties) ||
                    !Array.isArray(product.specifications) ||
                    !Array.isArray(product.standards) ||
                    !Array.isArray(product.suitable) ||
                    !Array.isArray(product.documents) ||
                    !Array.isArray(product.faq) ||
                    !Array.isArray(product.hashtags) ||
                    !Array.isArray(product.categories) ||
                    !Array.isArray(product.galleryImageUrls) ||
                    product.galleryImageUrls.length > 4
                )
            })

            if (!productsToMigrate.length) return

            try {
                const batch = writeBatch(db)
                const assignedSlugs = this.products
                    .filter((product) => product.slug)
                    .map((product) => ({ id: product.id, slug: product.slug }))
                productsToMigrate.forEach((product) => {
                    const slug =
                        product.slug || uniqueProductSlug(product.name, assignedSlugs, product.id)
                    assignedSlugs.push({ id: product.id, slug })
                    const migrated = {
                        slug,
                        highlights: toItemList(product.highlights),
                        properties: toItemList(product.properties),
                        specifications: toItemList(product.specifications).length
                            ? toItemList(product.specifications)
                            : toItemList(product.spec),
                        standards: toItemList(product.standards),
                        suitable: toItemList(product.suitable),
                        documents: normalizeDocuments(product.documents),
                        faq: normalizeFaq(product.faq),
                        hashtags: normalizeHashtags(product.hashtags),
                        categories: normalizeCategories(product.categories, product.category),
                        galleryImageUrls: Array.isArray(product.galleryImageUrls)
                            ? product.galleryImageUrls.slice(0, 4)
                            : [],
                        updatedAt: serverTimestamp(),
                    }
                    Object.keys(product).forEach((key) => {
                        if (key !== 'id' && !PRODUCT_FIELDS.has(key)) migrated[key] = deleteField()
                    })
                    batch.update(doc(db, 'products', product.id), migrated)
                })
                await batch.commit()
                await this.fetchProducts()
            } catch (err) {
                console.error('migrateProductSchema error:', err)
                this.error = 'ปรับโครงสร้างข้อมูลสินค้าล้มเหลว'
            }
        },

        async duplicateProduct(id) {
            const source = this.products.find((item) => item.id === id)
            if (!source) {
                this.error = 'ไม่พบสินค้าที่ต้องการคัดลอก'
                return null
            }

            this.loading = true
            this.error = null

            try {
                const productData = {
                    name: `${source.name || 'สินค้า'} - copy`,
                    slug: uniqueProductSlug(`${source.name || 'สินค้า'} - copy`, this.products),
                    shortDescription: source.shortDescription || '',
                    description: source.description || '',
                    highlights: toItemList(source.highlights),
                    properties: toItemList(source.properties),
                    specifications: toItemList(source.specifications),
                    standards: toItemList(source.standards),
                    suitable: toItemList(source.suitable),
                    documents: normalizeDocuments(source.documents),
                    faq: normalizeFaq(source.faq),
                    hashtags: normalizeHashtags(source.hashtags),
                    brand: source.brand || '',
                    sku: source.sku || '',
                    packing: source.packing || '',
                    categories: normalizeCategories(source.categories, source.category),
                    mainImageUrl: source.mainImageUrl || null,
                    galleryImageUrls: Array.isArray(source.galleryImageUrls)
                        ? [...source.galleryImageUrls].slice(0, 4)
                        : [],
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                }

                const docRef = await addDoc(productsCol, productData)
                const duplicated = { id: docRef.id, ...productData }
                this.products.push(duplicated)
                return duplicated
            } catch (err) {
                console.error('duplicateProduct error:', err)
                this.error = 'คัดลอกสินค้าไม่สำเร็จ'
                return null
            } finally {
                this.loading = false
            }
        },

        async deleteProduct(id) {
            try {
                const docRef = doc(db, 'products', id)
                await deleteDoc(docRef)
                this.products = this.products.filter((item) => item.id !== id)
            } catch (err) {
                console.error('deleteProduct error:', err)
            }
        },
    },
})
