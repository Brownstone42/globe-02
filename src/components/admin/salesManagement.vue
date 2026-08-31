<template>
    <div class="sales-management">
        <div class="management-header">
            <div><h1>Sales Management</h1><p>จัดการข้อมูลและรูปภาพทีมฝ่ายขายที่แสดงในหน้า Contact Us</p></div>
            <button type="button" class="new-btn" @click="resetForm">สร้างฝ่ายขายใหม่</button>
        </div>

        <div class="management-layout">
            <form class="sales-form" @submit.prevent="saveSales">
                <h2>{{ editingId ? 'แก้ไขข้อมูลฝ่ายขาย' : 'เพิ่มข้อมูลฝ่ายขาย' }}</h2>
                <div class="field-grid">
                    <label><span>ชื่อฝ่ายขาย *</span><input v-model.trim="form.name" required placeholder="ชื่อ - นามสกุล" /></label>
                    <label><span>ตำแหน่ง</span><input v-model.trim="form.position" placeholder="Sales Representative" /></label>
                    <label><span>เบอร์โทร</span><input v-model.trim="form.phone" type="tel" placeholder="097-000-0000" /></label>
                    <label><span>Line ID</span><input v-model.trim="form.lineId" placeholder="@idealglobe" /></label>
                    <label><span>อีเมล</span><input v-model.trim="form.email" type="email" placeholder="sales@idealglobe.com" /></label>
                    <label><span>ลำดับการแสดง</span><input v-model.number="form.order" type="number" min="0" /></label>
                </div>

                <div class="upload-grid">
                    <label class="upload-field"><span>รูปฝ่ายขาย</span><input ref="imageInput" type="file" accept="image/*" @change="selectImage($event, 'image')" /><img v-if="imagePreview" :src="imagePreview" alt="ตัวอย่างรูปฝ่ายขาย" /></label>
                    <label class="upload-field"><span>QR Code</span><input ref="qrInput" type="file" accept="image/*" @change="selectImage($event, 'qrCode')" /><img v-if="qrPreview" :src="qrPreview" alt="ตัวอย่าง QR Code" /></label>
                </div>

                <label class="visibility"><input v-model="form.visibility" type="checkbox" /><span>แสดงในหน้าบ้าน</span></label>
                <p v-if="salesStore.error" class="error-message">{{ salesStore.error }}</p>
                <div class="form-actions"><button type="button" class="cancel-btn" @click="resetForm">ล้างค่า</button><button type="submit" class="save-btn" :disabled="salesStore.loading">{{ salesStore.loading ? 'กำลังบันทึก...' : editingId ? 'อัปเดตข้อมูล' : 'บันทึกข้อมูล' }}</button></div>
            </form>

            <section class="sales-list">
                <h2>รายการฝ่ายขาย</h2>
                <p v-if="salesStore.loading && !salesStore.sales.length" class="empty-state">กำลังโหลด...</p>
                <p v-else-if="!salesStore.sales.length" class="empty-state">ยังไม่มีข้อมูลฝ่ายขาย</p>
                <div v-else class="sales-table-wrap">
                    <table><thead><tr><th>รูป</th><th>ข้อมูล</th><th>QR Code</th><th>สถานะ</th><th></th></tr></thead>
                        <tbody><tr v-for="person in salesStore.sortedSales" :key="person.id">
                            <td><img v-if="person.imageUrl" class="person-thumb" :src="person.imageUrl" :alt="person.name" /><span v-else class="no-image"><i class="fa-solid fa-user"></i></span></td>
                            <td><strong>{{ person.name }}</strong><small>{{ person.position || '-' }}</small><small>{{ person.phone || '-' }}</small><small>{{ person.lineId || '-' }}</small></td>
                            <td><img v-if="person.qrCodeUrl" class="qr-thumb" :src="person.qrCodeUrl" alt="QR Code" /><span v-else>-</span></td>
                            <td><span class="status" :class="person.visibility !== false ? 'active' : 'hidden'">{{ person.visibility !== false ? 'แสดง' : 'ซ่อน' }}</span></td>
                            <td><div class="row-actions"><button type="button" @click="editSales(person)">แก้ไข</button><button type="button" class="delete-btn" @click="removeSales(person)"><i class="fa-regular fa-trash-can"></i></button></div></td>
                        </tr></tbody>
                    </table>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
import { mapStores } from 'pinia'
import { useSalesStore } from '@/stores/salesStore'

const emptyForm = () => ({ name: '', position: '', phone: '', lineId: '', email: '', order: 0, visibility: true, imageFile: null, qrCodeFile: null })

export default {
    name: 'SalesManagement',
    data: () => ({ editingId: null, form: emptyForm(), imagePreview: '', qrPreview: '', previewUrls: [] }),
    computed: { ...mapStores(useSalesStore) },
    created() { this.salesStore.loadSales() },
    beforeUnmount() { this.clearObjectUrls() },
    methods: {
        selectImage(event, type) {
            const file = event.target.files?.[0] || null
            if (!file) return
            this.form[`${type}File`] = file
            const url = URL.createObjectURL(file); this.previewUrls.push(url)
            if (type === 'image') this.imagePreview = url
            else this.qrPreview = url
        },
        clearObjectUrls() { this.previewUrls.forEach((url) => URL.revokeObjectURL(url)); this.previewUrls = [] },
        resetForm() {
            this.clearObjectUrls(); this.editingId = null; this.form = emptyForm(); this.imagePreview = ''; this.qrPreview = ''
            this.$nextTick(() => { if (this.$refs.imageInput) this.$refs.imageInput.value = ''; if (this.$refs.qrInput) this.$refs.qrInput.value = '' })
        },
        editSales(person) {
            this.clearObjectUrls(); this.editingId = person.id
            this.form = { name: person.name || '', position: person.position || '', phone: person.phone || '', lineId: person.lineId || '', email: person.email || '', order: person.order || 0, visibility: person.visibility !== false, imageFile: null, qrCodeFile: null }
            this.imagePreview = person.imageUrl || ''; this.qrPreview = person.qrCodeUrl || ''
        },
        async saveSales() {
            try {
                if (this.editingId) await this.salesStore.updateSales(this.editingId, this.form)
                else await this.salesStore.createSales(this.form)
                alert(this.editingId ? 'อัปเดตข้อมูลฝ่ายขายแล้ว' : 'เพิ่มข้อมูลฝ่ายขายแล้ว'); this.resetForm()
            } catch (_) { /* store displays the error */ }
        },
        async removeSales(person) {
            if (!confirm(`ต้องการลบข้อมูล ${person.name} หรือไม่?`)) return
            await this.salesStore.deleteSales(person.id)
            if (this.editingId === person.id) this.resetForm()
        },
    },
}
</script>

<style scoped>
.sales-management {
    box-sizing: border-box;
    padding: 0 6px 12px;
}
.sales-management{height:100%;overflow:auto;padding-right:5px}.management-header{align-items:center;display:flex;justify-content:space-between;margin-bottom:20px}.management-header h1{color:#1f2937;font-size:1.5rem;margin:0}.management-header p{color:#64748b;margin:3px 0 0}.new-btn,.save-btn{background:#2563eb;border:0;border-radius:7px;color:#fff;cursor:pointer;font:inherit;padding:10px 16px}.management-layout{display:grid;gap:22px;grid-template-columns:minmax(360px,.85fr) minmax(520px,1.4fr)}.sales-form,.sales-list{background:#fff;border-radius:10px;box-shadow:0 2px 8px rgba(15,23,42,.08);padding:20px}.sales-form h2,.sales-list h2{font-size:1.05rem;margin:0 0 18px}.field-grid{display:grid;gap:14px;grid-template-columns:repeat(2,minmax(0,1fr))}.field-grid label,.upload-field{display:flex;flex-direction:column;gap:6px}.field-grid span,.upload-field>span{color:#374151;font-size:.82rem;font-weight:600}.field-grid input{border:1px solid #d1d5db;border-radius:6px;font:inherit;padding:9px}.upload-grid{display:grid;gap:16px;grid-template-columns:1fr 1fr;margin-top:18px}.upload-field input{font-size:.78rem}.upload-field img{background:#f5f6f7;border:1px solid #e5e7eb;border-radius:7px;height:150px;margin-top:5px;object-fit:contain;width:100%}.visibility{align-items:center;display:flex;gap:8px;margin-top:18px}.visibility input{accent-color:#2563eb}.form-actions{display:flex;gap:10px;justify-content:flex-end;margin-top:18px}.cancel-btn{background:#fff;border:1px solid #d1d5db;border-radius:7px;cursor:pointer;padding:9px 16px}.save-btn:disabled{opacity:.6}.error-message{color:#b91c1c}.sales-table-wrap{overflow:auto}table{border-collapse:collapse;width:100%}th,td{border-bottom:1px solid #e5e7eb;padding:10px;text-align:left;vertical-align:middle}th{color:#64748b;font-size:.75rem}td{font-size:.8rem}td:nth-child(2){display:flex;flex-direction:column}.person-thumb,.no-image{border-radius:7px;height:58px;object-fit:cover;width:52px}.no-image{align-items:center;background:#eef1f4;color:#94a3b8;display:flex;font-size:1.4rem;justify-content:center}.qr-thumb{height:52px;object-fit:contain;width:52px}.status{border-radius:999px;font-size:.7rem;padding:4px 8px}.status.active{background:#dcfce7;color:#166534}.status.hidden{background:#f1f5f9;color:#64748b}.row-actions{display:flex;gap:7px}.row-actions button{background:#eff6ff;border:0;border-radius:5px;color:#2563eb;cursor:pointer;padding:6px 9px}.row-actions .delete-btn{background:#fef2f2;color:#dc2626}.empty-state{color:#94a3b8;text-align:center}@media(max-width:1100px){.management-layout{grid-template-columns:1fr}}@media(max-width:650px){.management-header{align-items:flex-start;gap:12px}.field-grid,.upload-grid{grid-template-columns:1fr}.management-layout{grid-template-columns:minmax(0,1fr)}}
</style>
