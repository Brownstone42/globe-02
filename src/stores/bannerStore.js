import { defineStore } from 'pinia'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import {
    deleteObject,
    getDownloadURL,
    getStorage,
    ref as storageRef,
    uploadBytes,
} from 'firebase/storage'
import { app, db } from '@/firebase'

const bannerDoc = doc(db, 'siteSettings', 'homeBanner')
const storage = getStorage(app)

const defaultOverlaySettings = () => ({
    title: {
        text: 'อุปกรณ์คลีนรูม อุปกรณ์ป้องกันไฟฟ้าสถิต\nและอุปกรณ์เพื่อความปลอดภัย',
        color: '#23272d',
        fontSize: 38,
    },
    subtitle: { text: 'คุณภาพมาตรฐานสากล', color: '#a0805b', fontSize: 21 },
    ending: { text: 'มาตรฐานที่ภาคอุตสาหกรรมไว้วางใจ', color: '#205b6c', fontSize: 16 },
    buttons: [
        { visible: true, text: 'ดูสินค้าทั้งหมด', backgroundColor: '#23272d', textColor: '#ffffff', icon: '', link: '/product' },
        { visible: true, text: 'ขอใบเสนอราคา', backgroundColor: '#a38c67', textColor: '#ffffff', icon: '', link: '/quotation' },
        { visible: true, text: 'ติดต่อเรา', backgroundColor: '#ffffff', textColor: '#a0805b', icon: 'fa-brands fa-line', link: 'https://line.me/R/ti/p/%40idealglobe' },
    ],
})

const normalizeOverlaySettings = (value = {}) => {
    const defaults = defaultOverlaySettings()
    const normalizeText = (section, fallback) => ({
        text: typeof section?.text === 'string' ? section.text : fallback.text,
        color: section?.color || fallback.color,
        fontSize: Math.min(72, Math.max(10, Number(section?.fontSize) || fallback.fontSize)),
    })
    return {
        title: normalizeText(value.title, defaults.title),
        subtitle: normalizeText(value.subtitle, defaults.subtitle),
        ending: normalizeText(value.ending, defaults.ending),
        buttons: (Array.isArray(value.buttons) ? value.buttons.slice(0, 3) : defaults.buttons).map((button, index) => {
            const fallback = defaults.buttons[index] || {
                visible: true,
                text: `ปุ่ม ${index + 1}`,
                backgroundColor: '#a38c67',
                textColor: '#ffffff',
                icon: '',
                link: '',
            }
            return {
                visible: button.visible !== false,
                text: typeof button.text === 'string' ? button.text : fallback.text,
                backgroundColor: button.backgroundColor || fallback.backgroundColor,
                textColor: button.textColor || fallback.textColor,
                icon: typeof button.icon === 'string' ? button.icon : fallback.icon,
                link: typeof button.link === 'string' ? button.link : fallback.link,
            }
        }),
    }
}

export const useBannerStore = defineStore('banner', {
    state: () => ({
        imageUrl: '',
        banners: [],
        intervalSeconds: 5,
        overlaySettings: defaultOverlaySettings(),
        overlayDefaultsVersion: 0,
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
                const data = snapshot.exists() ? snapshot.data() : {}
                const storedBanners = Array.isArray(data.banners) ? data.banners : null
                this.banners = storedBanners
                    ? storedBanners.map((banner, index) => ({
                          id: banner.id || `banner-${index}`,
                          name: banner.name || `Banner ${index + 1}`,
                          imageUrl: banner.imageUrl || '',
                          storagePath: banner.storagePath || '',
                          visible: banner.visible !== false,
                          order: Number.isFinite(Number(banner.order)) ? Number(banner.order) : index,
                          overlaySettings: normalizeOverlaySettings(
                              banner.overlaySettings || data.overlaySettings,
                          ),
                      }))
                    : data.imageUrl
                      ? [{
                            id: 'legacy-banner',
                            name: 'Banner 1',
                            imageUrl: data.imageUrl,
                            storagePath: data.storagePath || '',
                            visible: true,
                            order: 0,
                            overlaySettings: normalizeOverlaySettings(data.overlaySettings),
                        }]
                      : []
                this.intervalSeconds = Math.min(60, Math.max(2, Number(data.intervalSeconds) || 5))
                this.overlaySettings = normalizeOverlaySettings(data.overlaySettings)
                this.overlayDefaultsVersion = Number(data.overlayDefaultsVersion) || 0
                this.syncLegacyImageUrl()
                this.loaded = true
            } catch (err) {
                console.error('loadBanner error:', err)
                this.error = 'โหลดข้อมูลแบนเนอร์ไม่สำเร็จ'
                this.loaded = true
            } finally {
                this.loading = false
            }
        },

        async addBanner(file) {
            if (!file) return

            this.saving = true
            this.error = null
            try {
                const extension = file.name.includes('.') ? file.name.split('.').pop() : 'jpg'
                const fileRef = storageRef(storage, `banners/home-${Date.now()}.${extension}`)
                const upload = await uploadBytes(fileRef, file)
                const imageUrl = await getDownloadURL(upload.ref)

                const newBannerOverlay = defaultOverlaySettings()
                newBannerOverlay.buttons = []
                const newBanner = {
                    id: `banner-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                    name: `Banner ${this.banners.length + 1}`,
                    imageUrl,
                    storagePath: upload.ref.fullPath,
                    visible: true,
                    order: this.banners.length,
                    overlaySettings: newBannerOverlay,
                }
                this.banners.push(newBanner)
                await this.persistBanners()
                this.loaded = true
                return newBanner
            } catch (err) {
                console.error('saveBanner error:', err)
                this.error = 'บันทึกแบนเนอร์ไม่สำเร็จ'
                throw err
            } finally {
                this.saving = false
            }
        },

        async saveBanner(file) {
            return this.addBanner(file)
        },

        async updateInterval(seconds) {
            this.intervalSeconds = Math.min(60, Math.max(2, Number(seconds) || 5))
            await this.persistBanners()
        },

        async updateOverlaySettings(settings) {
            this.overlaySettings = normalizeOverlaySettings(settings)
            await this.persistBanners()
        },

        async applyInitialOverlayDefaults() {
            if (this.overlayDefaultsVersion >= 1 || !this.banners.length) return false
            const sorted = [...this.banners].sort((a, b) => a.order - b.order)
            sorted.slice(0, 2).forEach((banner) => {
                banner.overlaySettings = defaultOverlaySettings()
            })
            this.banners = sorted
            this.overlayDefaultsVersion = 1
            await this.persistBanners()
            return true
        },

        async updateBanner(id, updates) {
            const banner = this.banners.find((item) => item.id === id)
            if (!banner) return
            Object.assign(banner, updates)
            await this.persistBanners()
        },

        async moveBanner(id, direction) {
            const sorted = [...this.banners].sort((a, b) => a.order - b.order)
            const index = sorted.findIndex((item) => item.id === id)
            const targetIndex = index + direction
            if (index < 0 || targetIndex < 0 || targetIndex >= sorted.length) return
            ;[sorted[index], sorted[targetIndex]] = [sorted[targetIndex], sorted[index]]
            sorted.forEach((item, order) => { item.order = order })
            this.banners = sorted
            await this.persistBanners()
        },

        async removeBanner(id) {
            const banner = this.banners.find((item) => item.id === id)
            if (!banner) return
            this.saving = true
            this.error = null
            try {
                this.banners = this.banners
                    .filter((item) => item.id !== id)
                    .sort((a, b) => a.order - b.order)
                    .map((item, order) => ({ ...item, order }))
                await this.persistBanners()
                if (banner.storagePath) {
                    try {
                        await deleteObject(storageRef(storage, banner.storagePath))
                    } catch (error) {
                        console.warn('remove banner file error:', error)
                    }
                }
            } finally {
                this.saving = false
            }
        },

        syncLegacyImageUrl() {
            const firstVisible = [...this.banners]
                .sort((a, b) => a.order - b.order)
                .find((banner) => banner.visible !== false && banner.imageUrl)
            this.imageUrl = firstVisible?.imageUrl || ''
        },

        async persistBanners() {
            this.banners = [...this.banners]
                .sort((a, b) => a.order - b.order)
                .map((banner, order) => ({ ...banner, order }))
            this.syncLegacyImageUrl()
            await setDoc(
                bannerDoc,
                {
                    banners: this.banners.map((banner) => ({
                        id: banner.id,
                        name: banner.name || `Banner ${banner.order + 1}`,
                        imageUrl: banner.imageUrl,
                        storagePath: banner.storagePath || '',
                        visible: banner.visible !== false,
                        order: banner.order,
                        overlaySettings: normalizeOverlaySettings(banner.overlaySettings),
                    })),
                    intervalSeconds: this.intervalSeconds,
                    overlaySettings: this.overlaySettings,
                    overlayDefaultsVersion: this.overlayDefaultsVersion,
                    imageUrl: this.imageUrl,
                    updatedAt: serverTimestamp(),
                },
                { merge: true },
            )
        },
    },
})
