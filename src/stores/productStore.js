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

const productsCol = collection(db, 'products')
const storage = getStorage(app)

const PRODUCT_FIELDS = new Set([
    'name', 'shortDescription', 'description', 'highlights', 'properties',
    'specifications', 'standards', 'brand', 'sku', 'category', 'packing',
    'mainImageUrl', 'galleryImageUrls', 'createdAt', 'updatedAt',
])

function toItemList(value) {
    if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean)
    if (typeof value !== 'string' || !value.trim()) return []
    return value.split(/\r?\n/).map((item) => item.replace(/^[-•]\s*/, '').trim()).filter(Boolean)
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
            return state.products.filter((item) => item.category === category)
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
                const productData = {
                    name: form.name || '',
                    shortDescription: form.shortDescription || '',
                    description: form.description || '',
                    highlights: toItemList(form.highlights),
                    properties: toItemList(form.properties),
                    specifications: toItemList(form.specifications),
                    standards: toItemList(form.standards),
                    brand: form.brand || '',
                    sku: form.sku || '',
                    packing: form.packing || '',
                    mainImageUrl: mainImageUrl,
                    galleryImageUrls: galleryImageUrls,
                    category: form.category || '',
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

                const updateData = {
                    name: form.name || '',
                    shortDescription: form.shortDescription || '',
                    description: form.description || '',
                    highlights: toItemList(form.highlights),
                    properties: toItemList(form.properties),
                    specifications: toItemList(form.specifications),
                    standards: toItemList(form.standards),
                    brand: form.brand || '',
                    sku: form.sku || '',
                    packing: form.packing || '',
                    category: form.category || '',
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
                return hasUnknownField ||
                    !Array.isArray(product.highlights) ||
                    !Array.isArray(product.properties) ||
                    !Array.isArray(product.specifications) ||
                    !Array.isArray(product.standards) ||
                    !Array.isArray(product.galleryImageUrls) ||
                    product.galleryImageUrls.length > 4
            })

            if (!productsToMigrate.length) return

            try {
                const batch = writeBatch(db)
                productsToMigrate.forEach((product) => {
                    const migrated = {
                        highlights: toItemList(product.highlights),
                        properties: toItemList(product.properties),
                        specifications: toItemList(product.specifications).length
                            ? toItemList(product.specifications)
                            : toItemList(product.spec),
                        standards: toItemList(product.standards),
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
