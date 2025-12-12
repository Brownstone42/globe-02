// src/stores/categoryStore.js
import { defineStore } from 'pinia'
import {
    collection,
    doc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    serverTimestamp,
} from 'firebase/firestore'
import { db, app } from '@/firebase'
import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage'

export const useCategoryStore = defineStore('category', {
    state: () => ({
        categories: [],
        loading: false,
        error: null,
    }),

    getters: {
        // ใช้ใน admin (เหมือนเดิม)
        sortedCategories(state) {
            return [...state.categories].sort((a, b) => (a.order || 0) - (b.order || 0))
        },
        // ใช้ในหน้า Home (โชว์เฉพาะที่ visibility = true)
        visibleCategories(state) {
            return state.categories.filter((c) => c.visibility !== false)
        },
    },

    actions: {
        async loadCategories() {
            this.loading = true
            this.error = null

            try {
                const q = query(collection(db, 'categories'), orderBy('order', 'asc'))
                const snap = await getDocs(q)

                const storage = getStorage(app)
                const result = []

                for (const d of snap.docs) {
                    const data = d.data()

                    const item = {
                        id: d.id,
                        ...data,
                        imageUrl: '', // เพิ่ม field ใช้กับหน้า Home
                    }

                    // ถ้ามี path รูปใน Storage → ดึง URL มาเก็บใน imageUrl
                    if (item.image) {
                        try {
                            item.imageUrl = await getDownloadURL(storageRef(storage, item.image))
                        } catch (e) {
                            console.warn('getDownloadURL error for category image:', item.image, e)
                        }
                    }

                    result.push(item)
                }

                this.categories = result
            } catch (err) {
                console.error('loadCategories error:', err)
                this.error = err.message || 'Failed to load categories'
            } finally {
                this.loading = false
            }
        },
        async createCategory(payload) {
            // payload คาดหวัง: { name, slug, description, image, order, visibility, subcategories }
            try {
                const ref = await addDoc(collection(db, 'categories'), {
                    name: payload.name || '',
                    slug: payload.slug || '',
                    description: payload.description || '',
                    image: payload.image || '',
                    order: Number(payload.order) || 0,
                    visibility: payload.visibility ?? true,
                    subcategories: payload.subcategories || [],
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                })

                // push เข้าสตอร์แบบเดิม + imageUrl ว่างไปก่อน
                this.categories.push({
                    id: ref.id,
                    ...payload,
                    imageUrl: '',
                })
            } catch (err) {
                console.error('createCategory error:', err)
                throw err
            }
        },
        async updateCategory(id, payload) {
            try {
                const ref = doc(db, 'categories', id)
                await updateDoc(ref, {
                    name: payload.name,
                    slug: payload.slug,
                    description: payload.description,
                    image: payload.image,
                    order: Number(payload.order) || 0,
                    visibility: payload.visibility,
                    subcategories: payload.subcategories || [],
                    updatedAt: serverTimestamp(),
                })

                // อัปเดตใน state (ยังไม่ยุ่ง imageUrl – ให้ reload ตอนหน้าอื่นเรียก loadCategories)
                const idx = this.categories.findIndex((c) => c.id === id)
                if (idx !== -1) {
                    this.categories[idx] = {
                        id,
                        ...payload,
                        imageUrl: this.categories[idx].imageUrl || '',
                    }
                }
            } catch (err) {
                console.error('updateCategory error:', err)
                throw err
            }
        },
        async toggleVisibility(id) {
            const category = this.categories.find((c) => c.id === id)
            if (!category) return

            const newVisibility = !category.visibility

            try {
                const ref = doc(db, 'categories', id)
                await updateDoc(ref, {
                    visibility: newVisibility,
                    updatedAt: serverTimestamp(),
                })

                category.visibility = newVisibility
            } catch (err) {
                console.error('toggleVisibility error:', err)
                throw err
            }
        },
        async deleteCategory(id) {
            try {
                const ref = doc(db, 'categories', id)
                await deleteDoc(ref)
                this.categories = this.categories.filter((c) => c.id !== id)
            } catch (err) {
                console.error('deleteCategory error:', err)
                throw err
            }
        },
    },
})
