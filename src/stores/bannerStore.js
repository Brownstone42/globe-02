import { defineStore } from 'pinia'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { getDownloadURL, getStorage, ref as storageRef, uploadBytes } from 'firebase/storage'
import { app, db } from '@/firebase'

const bannerDoc = doc(db, 'siteSettings', 'homeBanner')
const storage = getStorage(app)

export const useBannerStore = defineStore('banner', {
    state: () => ({
        imageUrl: '',
        loading: false,
        saving: false,
        error: null,
        loaded: false,
    }),

    actions: {
        async loadBanner(force = false) {
            if (this.loaded && !force) return

            this.loading = true
            this.error = null
            try {
                const snapshot = await getDoc(bannerDoc)
                this.imageUrl = snapshot.exists() ? snapshot.data().imageUrl || '' : ''
                this.loaded = true
            } catch (err) {
                console.error('loadBanner error:', err)
                this.error = 'โหลดข้อมูลแบนเนอร์ไม่สำเร็จ'
            } finally {
                this.loading = false
            }
        },

        async saveBanner(file) {
            if (!file) return

            this.saving = true
            this.error = null
            try {
                const extension = file.name.includes('.') ? file.name.split('.').pop() : 'jpg'
                const fileRef = storageRef(storage, `banners/home-${Date.now()}.${extension}`)
                const upload = await uploadBytes(fileRef, file)
                const imageUrl = await getDownloadURL(upload.ref)

                await setDoc(
                    bannerDoc,
                    {
                        imageUrl,
                        storagePath: upload.ref.fullPath,
                        updatedAt: serverTimestamp(),
                    },
                    { merge: true },
                )

                this.imageUrl = imageUrl
                this.loaded = true
            } catch (err) {
                console.error('saveBanner error:', err)
                this.error = 'บันทึกแบนเนอร์ไม่สำเร็จ'
                throw err
            } finally {
                this.saving = false
            }
        },
    },
})
