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
import { db } from '@/firebase'

export const useCategoryStore = defineStore('category', {
    state: () => ({
        categories: [],
        loading: false,
        error: null,
    }),

    getters: {
        // ถ้าอยากได้ category เรียงตาม order อยู่แล้ว
        sortedCategories(state) {
            return [...state.categories].sort((a, b) => (a.order || 0) - (b.order || 0))
        },
    },

    actions: {
        async loadCategories() {
            this.loading = true
            this.error = null

            try {
                const q = query(collection(db, 'categories'), orderBy('order', 'asc'))
                const snap = await getDocs(q)

                this.categories = snap.docs.map((d) => ({
                    id: d.id,
                    ...d.data(),
                }))
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

                // เพิ่มเข้า state ให้ด้วย จะได้ไม่ต้อง reload
                this.categories.push({
                    id: ref.id,
                    ...payload,
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

                // อัปเดตใน state
                const idx = this.categories.findIndex((c) => c.id === id)
                if (idx !== -1) {
                    this.categories[idx] = {
                        id,
                        ...payload,
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
            // ถ้าคุณไม่อยากลบจริง ๆ อาจไม่ใช้ method นี้ก็ได้ ใช้แค่ visibility แทน
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
