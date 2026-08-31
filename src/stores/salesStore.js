import { defineStore } from 'pinia'
import { addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp, updateDoc } from 'firebase/firestore'
import { getDownloadURL, getStorage, ref as storageRef, uploadBytes } from 'firebase/storage'
import { app, db } from '@/firebase'

const storage = getStorage(app)

async function uploadSalesImage(file, type) {
    if (!file) return null
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
    const uniqueName = `${Date.now()}-${crypto.randomUUID()}-${safeName}`
    const snapshot = await uploadBytes(storageRef(storage, `sales/${type}/${uniqueName}`), file)
    return { path: snapshot.ref.fullPath, url: await getDownloadURL(snapshot.ref) }
}

async function resolveImage(path) {
    if (!path) return ''
    try { return await getDownloadURL(storageRef(storage, path)) }
    catch (error) { console.warn('Sales image unavailable:', path, error); return '' }
}

export const useSalesStore = defineStore('sales', {
    state: () => ({ sales: [], loading: false, error: null }),
    getters: {
        sortedSales: (state) => [...state.sales].sort((a, b) => (a.order || 0) - (b.order || 0)),
        visibleSales() { return this.sortedSales.filter((item) => item.visibility !== false) },
    },
    actions: {
        async loadSales() {
            this.loading = true; this.error = null
            try {
                const snapshot = await getDocs(collection(db, 'salesTeam'))
                this.sales = await Promise.all(snapshot.docs.map(async (item) => {
                    const data = item.data()
                    return { id: item.id, ...data, imageUrl: await resolveImage(data.image), qrCodeUrl: await resolveImage(data.qrCode) }
                }))
            } catch (error) {
                console.error('loadSales error:', error); this.error = 'โหลดข้อมูลฝ่ายขายไม่สำเร็จ'
            } finally { this.loading = false }
        },
        async createSales(payload) {
            this.loading = true; this.error = null
            try {
                const [image, qrCode] = await Promise.all([
                    uploadSalesImage(payload.imageFile, 'people'), uploadSalesImage(payload.qrCodeFile, 'qr'),
                ])
                const data = {
                    name: payload.name || '', position: payload.position || '', phone: payload.phone || '',
                    lineId: payload.lineId || '', email: payload.email || '', order: Number(payload.order) || 0,
                    visibility: payload.visibility ?? true, image: image?.path || '', qrCode: qrCode?.path || '',
                    createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
                }
                const saved = await addDoc(collection(db, 'salesTeam'), data)
                this.sales.push({ id: saved.id, ...data, imageUrl: image?.url || '', qrCodeUrl: qrCode?.url || '' })
            } catch (error) {
                console.error('createSales error:', error); this.error = 'บันทึกข้อมูลฝ่ายขายไม่สำเร็จ'; throw error
            } finally { this.loading = false }
        },
        async updateSales(id, payload) {
            this.loading = true; this.error = null
            try {
                const current = this.sales.find((item) => item.id === id) || {}
                const [image, qrCode] = await Promise.all([
                    uploadSalesImage(payload.imageFile, 'people'), uploadSalesImage(payload.qrCodeFile, 'qr'),
                ])
                const data = {
                    name: payload.name || '', position: payload.position || '', phone: payload.phone || '',
                    lineId: payload.lineId || '', email: payload.email || '', order: Number(payload.order) || 0,
                    visibility: payload.visibility ?? true, image: image?.path || current.image || '',
                    qrCode: qrCode?.path || current.qrCode || '', updatedAt: serverTimestamp(),
                }
                await updateDoc(doc(db, 'salesTeam', id), data)
                const index = this.sales.findIndex((item) => item.id === id)
                if (index !== -1) this.sales[index] = { id, ...current, ...data, imageUrl: image?.url || current.imageUrl || '', qrCodeUrl: qrCode?.url || current.qrCodeUrl || '' }
            } catch (error) {
                console.error('updateSales error:', error); this.error = 'อัปเดตข้อมูลฝ่ายขายไม่สำเร็จ'; throw error
            } finally { this.loading = false }
        },
        async deleteSales(id) {
            await deleteDoc(doc(db, 'salesTeam', id))
            this.sales = this.sales.filter((item) => item.id !== id)
        },
    },
})
