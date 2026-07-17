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

const newsCol = collection(db, 'news')
const storage = getStorage(app)

async function uploadImage(file, folder) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const fileRef = storageRef(storage, `${folder}/${Date.now()}-${safeName}`)
    const snap = await uploadBytes(fileRef, file)
    return getDownloadURL(snap.ref)
}

export const useNewsStore = defineStore('news', {
    state: () => ({
        news: [],
        loading: false,
        error: null,
    }),

    getters: {
        publishedNews: (state) => state.news.filter((item) => item.status === 'published'),
    },

    actions: {
        async fetchNews() {
            this.loading = true
            this.error = null
            try {
                const snapshot = await getDocs(newsCol)
                const items = []
                snapshot.forEach((docSnap) => {
                    items.push({ id: docSnap.id, ...docSnap.data() })
                })
                this.news = items
            } catch (err) {
                console.error('fetchNews error:', err)
                this.error = 'โหลดข่าวสารล้มเหลว'
            } finally {
                this.loading = false
            }
        },

        async saveNews(form) {
            this.loading = true
            this.error = null
            try {
                let featuredImageUrl = null
                if (form.featuredImageFile) {
                    featuredImageUrl = await uploadImage(form.featuredImageFile, 'news')
                }

                let coverImageUrl = null
                if (form.coverImageFile) {
                    coverImageUrl = await uploadImage(form.coverImageFile, 'news/cover')
                }

                const data = {
                    title: form.title || '',
                    slug: form.slug || '',
                    content: form.content || '',
                    faq: form.faq || [],
                    tags: form.tags || [],
                    category: form.category || '',
                    metaDescription: form.metaDescription || '',
                    status: form.status || 'draft',
                    featuredImageUrl,
                    coverImageUrl,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                }

                const docRef = await addDoc(newsCol, data)
                this.news.push({ id: docRef.id, ...data })
            } catch (err) {
                console.error('saveNews error:', err)
                this.error = 'บันทึกข่าวสารล้มเหลว'
            } finally {
                this.loading = false
            }
        },

        async updateNews(id, form) {
            this.loading = true
            this.error = null
            try {
                const existing = this.news.find((item) => item.id === id) || {}
                let featuredImageUrl = existing.featuredImageUrl || null
                if (form.featuredImageFile) {
                    featuredImageUrl = await uploadImage(form.featuredImageFile, 'news')
                }

                let coverImageUrl = existing.coverImageUrl || null
                if (form.coverImageFile) {
                    coverImageUrl = await uploadImage(form.coverImageFile, 'news/cover')
                }

                const data = {
                    title: form.title || '',
                    slug: form.slug || '',
                    content: form.content || '',
                    faq: form.faq || [],
                    tags: form.tags || [],
                    category: form.category || '',
                    metaDescription: form.metaDescription || '',
                    status: form.status || 'draft',
                    featuredImageUrl,
                    coverImageUrl,
                    updatedAt: serverTimestamp(),
                }

                await updateDoc(doc(db, 'news', id), data)
                this.news = this.news.map((item) =>
                    item.id === id ? { ...item, ...data } : item,
                )
            } catch (err) {
                console.error('updateNews error:', err)
                this.error = 'อัปเดตข่าวสารล้มเหลว'
            } finally {
                this.loading = false
            }
        },

        async deleteNews(id) {
            try {
                await deleteDoc(doc(db, 'news', id))
                this.news = this.news.filter((item) => item.id !== id)
            } catch (err) {
                console.error('deleteNews error:', err)
            }
        },
    },
})
