// src/stores/productStore.js
import { defineStore } from 'pinia'
import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
} from 'firebase/firestore'
import { db, app } from '@/firebase'
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

const productsCol = collection(db, 'products')
const storage = getStorage(app)

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
                    description: form.description || '',
                    brand: form.brand || '',
                    sku: form.sku || '',
                    standards: form.standards || [],
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
                let galleryImageUrls = Array.isArray(existing.galleryImageUrls)
                    ? [...existing.galleryImageUrls]
                    : []

                // ถ้ามีการเลือก mainImage ใหม่ → อัปใหม่ทับ
                if (form.mainImageFile) {
                    const file = form.mainImageFile
                    const filePath = `products/main/${file.name}`
                    const fileRef = storageRef(storage, filePath)

                    const snapshot = await uploadBytes(fileRef, file)
                    mainImageUrl = await getDownloadURL(snapshot.ref)
                }

                // ถ้ามีการเลือก gallery ใหม่ (อย่างน้อย 1 รูป) → ลิสต์ใหม่ทั้งชุด
                if (form.galleryImageFiles && form.galleryImageFiles.length) {
                    galleryImageUrls = []

                    for (let i = 0; i < form.galleryImageFiles.length; i++) {
                        const file = form.galleryImageFiles[i]
                        const filePath = `products/gallery/${file.name}`
                        const fileRef = storageRef(storage, filePath)

                        const snapshot = await uploadBytes(fileRef, file)
                        const url = await getDownloadURL(snapshot.ref)
                        galleryImageUrls.push(url)
                    }
                }

                const updateData = {
                    name: form.name || '',
                    description: form.description || '',
                    brand: form.brand || '',
                    sku: form.sku || '',
                    standards: form.standards || [],
                    packing: form.packing || '',
                    category: form.category || '',
                    mainImageUrl,
                    galleryImageUrls,
                    updatedAt: serverTimestamp(),
                }

                const docRef = doc(db, 'products', id)
                await updateDoc(docRef, updateData)

                // อัปเดตใน state
                this.products = this.products.map((item) =>
                    item.id === id ? { ...item, ...updateData } : item,
                )
            } catch (err) {
                console.error('updateProduct error:', err)
                this.error = 'อัปเดตสินค้าล้มเหลว'
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
