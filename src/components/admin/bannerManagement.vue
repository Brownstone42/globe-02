<template>
    <div class="banner-management">
        <div class="panel-header">
            <div>
                <h2>Banner Management</h2>
                <p>จัดการรูปแบนเนอร์ขนาดใหญ่ที่แสดงด้านบนของหน้าแรก</p>
            </div>
            <button class="refresh-btn" :disabled="bannerStore.loading" @click="reload">
                โหลดใหม่
            </button>
        </div>

        <section class="banner-panel">
            <div class="form-group add-banner-form">
                <label>เพิ่มรูปแบนเนอร์หน้าแรก</label>
                <input
                    id="banner-file"
                    ref="fileInput"
                    class="native-file-input"
                    type="file"
                    accept="image/*"
                    @change="onFileChange"
                />
                <div class="upload-row">
                    <button class="upload-btn" type="button" @click="chooseFile">
                        <i class="fa-solid fa-arrow-up-from-bracket"></i>
                        อัปโหลดรูป
                    </button>
                    <span class="file-name">
                        {{ selectedFile ? selectedFile.name : 'ยังไม่ได้เลือกไฟล์' }}
                    </span>
                    <button
                        class="save-btn"
                        type="button"
                        :disabled="!selectedFile || bannerStore.saving"
                        @click="save"
                    >
                        {{ bannerStore.saving ? 'กำลังอัปโหลด...' : 'เพิ่มและเผยแพร่แบนเนอร์' }}
                    </button>
                </div>
                <small>แนะนำขนาด 1920 × 640 px หรือสัดส่วน 3:1</small>
            </div>

            <section v-if="editingBanner" ref="overlayEditor" class="overlay-settings">
                <div class="settings-heading">
                    <div>
                        <h3>แก้ไขข้อมูล Banner {{ editingBannerIndex + 1 }}</h3>
                        <small>ข้อความและปุ่มชุดนี้จะแสดงเฉพาะเมื่อ Banner รูปนี้กำลังทำงาน</small>
                    </div>
                    <button type="button" :disabled="bannerStore.saving" @click="saveOverlaySettings">
                        บันทึกข้อความและปุ่ม
                    </button>
                </div>

                <label class="banner-name-field">
                    ชื่อ Banner
                    <input v-model.trim="bannerName" type="text" placeholder="เช่น Banner Cleanroom" />
                </label>

                <div class="text-setting-grid">
                    <div class="setting-card">
                        <h4>Title</h4>
                        <label>ข้อความ<textarea v-model="overlaySettings.title.text" rows="3"></textarea></label>
                        <div class="inline-settings">
                            <label>สี<input v-model="overlaySettings.title.color" type="color" /></label>
                            <label>ขนาดฟอนต์<input v-model.number="overlaySettings.title.fontSize" type="number" min="10" max="72" /></label>
                        </div>
                    </div>
                    <div class="setting-card">
                        <h4>Subtitle</h4>
                        <label>ข้อความ<input v-model="overlaySettings.subtitle.text" type="text" /></label>
                        <div class="inline-settings">
                            <label>สี<input v-model="overlaySettings.subtitle.color" type="color" /></label>
                            <label>ขนาดฟอนต์<input v-model.number="overlaySettings.subtitle.fontSize" type="number" min="10" max="72" /></label>
                        </div>
                    </div>
                    <div class="setting-card">
                        <h4>คำลงท้าย</h4>
                        <label>ข้อความ<input v-model="overlaySettings.ending.text" type="text" /></label>
                        <div class="inline-settings">
                            <label>สี<input v-model="overlaySettings.ending.color" type="color" /></label>
                            <label>ขนาดฟอนต์<input v-model.number="overlaySettings.ending.fontSize" type="number" min="10" max="72" /></label>
                        </div>
                    </div>
                </div>

                <div class="button-settings">
                    <div class="button-settings-heading">
                        <div>
                            <h4>ปุ่ม Call to Action</h4>
                            <small>เพิ่มได้สูงสุด 3 ปุ่ม หากไม่เพิ่มปุ่ม ส่วน CTA จะไม่แสดง</small>
                        </div>
                        <button
                            class="add-cta-btn"
                            type="button"
                            :disabled="overlaySettings.buttons.length >= 3"
                            @click="addCtaButton"
                        >
                            <i class="fa-solid fa-plus"></i>
                            {{ overlaySettings.buttons.length >= 3 ? 'ครบ 3 ปุ่มแล้ว' : 'เพิ่มปุ่ม CTA' }}
                        </button>
                    </div>
                    <div v-if="!overlaySettings.buttons.length" class="empty-cta">
                        ยังไม่มีปุ่ม CTA — กด “เพิ่มปุ่ม CTA” เพื่อเริ่มตั้งค่า
                    </div>
                    <article v-for="(button, index) in overlaySettings.buttons" :key="index" class="button-setting-card">
                        <div class="button-setting-title">
                            <strong>ปุ่มที่ {{ index + 1 }}</strong>
                            <div class="button-setting-controls">
                                <label class="visibility-toggle"><input v-model="button.visible" type="checkbox" /> แสดงปุ่ม</label>
                                <button type="button" title="ลบปุ่ม CTA" @click="removeCtaButton(index)">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div class="button-setting-fields">
                            <label>ข้อความ<input v-model="button.text" type="text" /></label>
                            <label>ลิงก์<input v-model="button.link" type="text" placeholder="/product หรือ https://..." /></label>
                            <label>ไอคอน
                                <select v-model="button.icon">
                                    <option v-for="option in iconOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
                                </select>
                            </label>
                            <label>สีปุ่ม<input v-model="button.backgroundColor" type="color" /></label>
                            <label>สีข้อความ<input v-model="button.textColor" type="color" /></label>
                        </div>
                    </article>
                </div>
            </section>

            <div class="preview-section">
                <div class="preview-heading">ตัวอย่างการแสดงผล</div>
                <div class="preview-card desktop-preview">
                    <div v-if="bannerStore.loading" class="preview-placeholder">
                        กำลังโหลด...
                    </div>
                    <div v-else class="banner-full-preview">
                        <img :src="previewUrl" alt="ตัวอย่างแบนเนอร์บนเดสก์ท็อป" />
                        <div class="preview-shade"></div>
                        <div v-if="editingBanner" class="preview-overlay">
                            <h4 :style="previewTextStyle(overlaySettings.title, 0.38)">{{ overlaySettings.title.text }}</h4>
                            <p :style="previewTextStyle(overlaySettings.subtitle, 0.48)">{{ overlaySettings.subtitle.text }}</p>
                            <div v-if="previewButtons.length" class="preview-actions">
                                <button
                                    v-for="(button, index) in previewButtons"
                                    :key="index"
                                    type="button"
                                    tabindex="-1"
                                    :style="{ backgroundColor: button.backgroundColor, color: button.textColor }"
                                    @click.prevent
                                >
                                    <i v-if="button.icon" :class="button.icon"></i>
                                    {{ button.text }}
                                </button>
                            </div>
                            <small :style="previewTextStyle(overlaySettings.ending, 0.52)">{{ overlaySettings.ending.text }}</small>
                        </div>
                    </div>
                </div>
            </div>

            <p v-if="bannerStore.error" class="error-text">{{ bannerStore.error }}</p>
            <p v-if="successMessage" class="success-text">{{ successMessage }}</p>

            <div class="banner-list-heading">
                <div>
                    <h3>ลำดับแบนเนอร์</h3>
                    <small>ภาพจะแสดงจากบนลงล่าง สามารถเปิด–ปิดหรือจัดลำดับได้</small>
                </div>
                <span>{{ sortedBanners.length }} รูป</span>
            </div>

            <div v-if="!sortedBanners.length" class="empty-banner-list">ยังไม่มีแบนเนอร์ที่อัปโหลด</div>
            <div v-else class="banner-list">
                <article
                    v-for="(banner, index) in sortedBanners"
                    :key="banner.id"
                    class="banner-item"
                    :class="{ 'is-editing': banner.id === editingBannerId }"
                    role="button"
                    tabindex="0"
                    @click="editBanner(banner)"
                    @keydown.enter.prevent="editBanner(banner)"
                >
                    <img :src="banner.imageUrl" :alt="`แบนเนอร์ลำดับ ${index + 1}`" />
                    <div class="banner-item-info">
                        <strong>{{ banner.name || `Banner ${index + 1}` }}</strong>
                        <small>คลิกแถวนี้เพื่อแก้ไขข้อความและปุ่ม CTA</small>
                    </div>
                    <div class="banner-item-actions">
                        <button type="button" title="เลื่อนขึ้น" :disabled="index === 0 || bannerStore.saving" @click.stop="move(banner.id, -1)">
                            <i class="fa-solid fa-arrow-up"></i>
                        </button>
                        <button type="button" title="เลื่อนลง" :disabled="index === sortedBanners.length - 1 || bannerStore.saving" @click.stop="move(banner.id, 1)">
                            <i class="fa-solid fa-arrow-down"></i>
                        </button>
                        <button
                            class="visibility-btn"
                            :class="{ 'is-banner-hidden': banner.visible === false }"
                            type="button"
                            :title="banner.visible === false ? 'แสดง Banner บนหน้าเว็บ' : 'ซ่อน Banner จากหน้าเว็บ'"
                            :aria-label="banner.visible === false ? 'แสดง Banner บนหน้าเว็บ' : 'ซ่อน Banner จากหน้าเว็บ'"
                            :disabled="bannerStore.saving"
                            @click.stop="toggleVisible(banner)"
                        >
                            <i :class="banner.visible === false ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                        </button>
                        <button class="delete-banner-btn" type="button" title="ลบแบนเนอร์" :disabled="bannerStore.saving" @click.stop="remove(banner)">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </article>
            </div>
        </section>
    </div>
</template>

<script>
import { useBannerStore } from '@/stores/bannerStore'
import fallbackBanner from '@/assets/images/home/banner.png'

const FALLBACK_BANNER = fallbackBanner

export default {
    name: 'BannerManagement',
    data() {
        return {
            selectedFile: null,
            localPreviewUrl: '',
            successMessage: '',
            editingBannerId: '',
            bannerName: '',
            overlaySettings: {
                title: { text: '', color: '#23272d', fontSize: 38 },
                subtitle: { text: '', color: '#a0805b', fontSize: 21 },
                ending: { text: '', color: '#205b6c', fontSize: 16 },
                buttons: [],
            },
            iconOptions: [
                { label: 'ไม่ใช้ไอคอน', value: '' },
                { label: 'LINE', value: 'fa-brands fa-line' },
                { label: 'โทรศัพท์', value: 'fa-solid fa-phone' },
                { label: 'เอกสาร', value: 'fa-regular fa-file-lines' },
                { label: 'สินค้า', value: 'fa-solid fa-box' },
                { label: 'ลูกศร', value: 'fa-solid fa-arrow-right' },
                { label: 'อีเมล', value: 'fa-solid fa-envelope' },
            ],
        }
    },
    computed: {
        bannerStore() {
            return useBannerStore()
        },
        previewUrl() {
            return (
                this.localPreviewUrl ||
                this.editingBanner?.imageUrl ||
                this.bannerStore.imageUrl ||
                FALLBACK_BANNER
            )
        },
        sortedBanners() {
            return [...this.bannerStore.banners].sort((a, b) => a.order - b.order)
        },
        editingBanner() {
            return this.sortedBanners.find((banner) => banner.id === this.editingBannerId) || null
        },
        editingBannerIndex() {
            return this.sortedBanners.findIndex((banner) => banner.id === this.editingBannerId)
        },
        previewButtons() {
            return (this.overlaySettings.buttons || []).filter(
                (button) => button.visible !== false && button.text,
            )
        },
    },
    async mounted() {
        await this.bannerStore.loadBanner()
        try {
            const applied = await this.bannerStore.applyInitialOverlayDefaults()
            if (applied) {
                this.successMessage = 'ใส่ข้อมูลเริ่มต้นให้ Banner 2 รูปแรกเรียบร้อยแล้ว'
            }
        } catch {
            this.successMessage = ''
        }
    },
    beforeUnmount() {
        this.releasePreview()
    },
    methods: {
        chooseFile() {
            this.$refs.fileInput?.click()
        },
        releasePreview() {
            if (this.localPreviewUrl) URL.revokeObjectURL(this.localPreviewUrl)
            this.localPreviewUrl = ''
        },
        onFileChange(event) {
            const file = event.target.files?.[0]
            if (!file) return

            this.releasePreview()
            this.selectedFile = file
            this.localPreviewUrl = URL.createObjectURL(file)
            this.successMessage = ''
        },
        async reload() {
            await this.bannerStore.loadBanner(true)
            this.editingBannerId = ''
        },
        editBanner(banner) {
            this.editingBannerId = banner.id
            this.bannerName = banner.name || `Banner ${this.editingBannerIndex + 1}`
            this.overlaySettings = JSON.parse(
                JSON.stringify(banner.overlaySettings || this.bannerStore.overlaySettings),
            )
            this.successMessage = ''
            this.$nextTick(() => {
                this.$refs.overlayEditor?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            })
        },
        async saveOverlaySettings() {
            if (!this.editingBanner) return
            try {
                await this.bannerStore.updateBanner(this.editingBanner.id, {
                    name: this.bannerName || `Banner ${this.editingBannerIndex + 1}`,
                    overlaySettings: JSON.parse(JSON.stringify(this.overlaySettings)),
                })
                this.editBanner(this.editingBanner)
                this.successMessage = 'บันทึกข้อมูล Banner เรียบร้อยแล้ว'
            } catch {
                this.successMessage = ''
            }
        },
        addCtaButton() {
            if (this.overlaySettings.buttons.length >= 3) return
            const index = this.overlaySettings.buttons.length
            const defaults = [
                { text: 'ดูสินค้าทั้งหมด', backgroundColor: '#23272d', textColor: '#ffffff', link: '/product' },
                { text: 'ขอใบเสนอราคา', backgroundColor: '#a38c67', textColor: '#ffffff', link: '/quotation' },
                { text: 'ติดต่อเรา', backgroundColor: '#ffffff', textColor: '#a0805b', link: 'https://line.me/R/ti/p/%40idealglobe' },
            ]
            this.overlaySettings.buttons.push({
                visible: true,
                icon: '',
                ...defaults[index],
            })
        },
        removeCtaButton(index) {
            this.overlaySettings.buttons.splice(index, 1)
        },
        async toggleVisible(banner) {
            const nextVisible = banner.visible === false
            try {
                await this.bannerStore.updateBanner(banner.id, { visible: nextVisible })
                this.successMessage = 'อัปเดตสถานะแบนเนอร์เรียบร้อยแล้ว'
            } catch {}
        },
        previewTextStyle(setting, scale) {
            return {
                color: setting.color,
                fontSize: `${Math.max(8, Number(setting.fontSize || 16) * scale)}px`,
            }
        },
        async move(id, direction) {
            await this.bannerStore.moveBanner(id, direction)
            this.successMessage = 'อัปเดตลำดับแบนเนอร์เรียบร้อยแล้ว'
        },
        async remove(banner) {
            if (!window.confirm('ยืนยันการลบแบนเนอร์นี้?')) return
            await this.bannerStore.removeBanner(banner.id)
            if (this.editingBannerId === banner.id) this.editingBannerId = ''
            this.successMessage = 'ลบแบนเนอร์เรียบร้อยแล้ว'
        },
        async save() {
            if (!this.selectedFile) return

            try {
                const newBanner = await this.bannerStore.saveBanner(this.selectedFile)
                this.releasePreview()
                this.selectedFile = null
                if (this.$refs.fileInput) this.$refs.fileInput.value = ''
                if (newBanner) this.editBanner(newBanner)
                this.successMessage = 'เผยแพร่แบนเนอร์ใหม่เรียบร้อยแล้ว'
            } catch {
                this.successMessage = ''
            }
        },
    },
}
</script>

<style scoped>
.banner-management {
    box-sizing: border-box;
    height: 100%;
    overflow-y: auto;
    padding: 0 6px 12px;
}

.panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
}

.panel-header h2 {
    color: #1e293b;
    font-size: 1.25rem;
    font-weight: 700;
}

.panel-header p {
    color: #64748b;
    font-size: 0.9rem;
    margin-top: 4px;
}

.banner-panel {
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
    display: flex;
    flex-direction: column;
    padding: 24px;
}

.overlay-settings { border-top: 1px solid #e2e8f0; margin-top: 24px; order: 5; padding-top: 24px; }
.add-banner-form { border-bottom: 1px solid #e2e8f0; margin-bottom: 24px; order: 1; padding-bottom: 22px; }
.add-banner-form .save-btn { margin-top: 0; }
.settings-heading { align-items: center; display: flex; gap: 20px; justify-content: space-between; margin-bottom: 18px; }
.settings-heading h3, .button-settings h4 { color: #1e293b; font-size: 1.05rem; font-weight: 700; margin: 0; }
.settings-heading small { color: #64748b; }
.settings-heading button { background: #2563eb; border: 0; border-radius: 8px; color: #fff; cursor: pointer; font-weight: 600; padding: 10px 16px; white-space: nowrap; }
.text-setting-grid { display: grid; gap: 12px; grid-template-columns: repeat(3, minmax(0, 1fr)); }
.setting-card, .button-setting-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; }
.setting-card h4 { color: #334155; font-weight: 700; margin: 0 0 10px; }
.setting-card label, .button-setting-fields label { color: #475569; display: flex; flex-direction: column; font-size: .82rem; gap: 5px; }
.setting-card input[type='text'], .setting-card input[type='number'], .setting-card textarea, .button-setting-fields input[type='text'], .button-setting-fields select { border: 1px solid #cbd5e1; border-radius: 7px; font: inherit; padding: 8px 9px; width: 100%; }
.setting-card textarea { resize: vertical; }
.inline-settings { display: grid; gap: 10px; grid-template-columns: 1fr 1fr; margin-top: 10px; }
.inline-settings input[type='color'], .button-setting-fields input[type='color'] { background: #fff; border: 1px solid #cbd5e1; border-radius: 7px; height: 38px; padding: 3px; width: 100%; }
.button-settings { margin-top: 18px; }
.button-settings-heading { align-items: center; display: flex; gap: 16px; justify-content: space-between; margin-bottom: 10px; }
.button-settings-heading small { color: #64748b; }
.add-cta-btn { align-items: center; background: #2563eb; border: 0; border-radius: 8px; color: #fff; cursor: pointer; display: inline-flex; font-weight: 600; gap: 7px; padding: 9px 14px; white-space: nowrap; }
.add-cta-btn:disabled { cursor: not-allowed; opacity: .5; }
.empty-cta { background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 9px; color: #64748b; font-size: .85rem; padding: 18px; text-align: center; }
.button-setting-card + .button-setting-card { margin-top: 10px; }
.button-setting-title { align-items: center; display: flex; justify-content: space-between; margin-bottom: 10px; }
.button-setting-controls { align-items: center; display: flex; gap: 12px; }
.button-setting-controls > button { align-items: center; background: #fee2e2; border: 0; border-radius: 7px; color: #dc2626; cursor: pointer; display: flex; height: 32px; justify-content: center; width: 32px; }
.button-setting-fields { display: grid; gap: 10px; grid-template-columns: 1fr 1.4fr 1fr .65fr .65fr; }
.banner-name-field { color: #334155; display: flex; flex-direction: column; font-size: .85rem; font-weight: 700; gap: 6px; margin-bottom: 14px; max-width: 460px; }
.banner-name-field input { border: 1px solid #cbd5e1; border-radius: 8px; font: inherit; font-weight: 400; padding: 9px 11px; }


.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-group label {
    color: #334155;
    font-weight: 700;
}

.form-group small,
.file-name {
    color: #64748b;
    font-size: 0.85rem;
}

.native-file-input {
    display: none;
}

.upload-row {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
}

.upload-btn {
    align-items: center;
    background: #0f766e;
    border: 0;
    border-radius: 8px;
    color: #fff;
    cursor: pointer;
    display: inline-flex;
    font-weight: 700;
    gap: 8px;
    padding: 10px 18px;
}

.upload-btn:hover {
    background: #115e59;
}

.preview-section {
    margin: 24px 0 16px;
    order: 4;
}

.preview-heading {
    color: #334155;
    font-weight: 700;
    margin-bottom: 12px;
}

.preview-card {
    min-width: 0;
}

.preview-label {
    align-items: center;
    color: #475569;
    display: flex;
    gap: 7px;
    font-size: 0.85rem;
    font-weight: 600;
    margin-bottom: 8px;
}

.preview-card img,
.preview-card .preview-placeholder {
    aspect-ratio: 3 / 1;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    display: block;
    max-height: 460px;
    object-fit: cover;
    width: 100%;
}

.preview-placeholder {
    align-items: center;
    color: #64748b;
    display: flex;
    justify-content: center;
}

.banner-full-preview { aspect-ratio: 3 / 1; border-radius: 12px; overflow: hidden; position: relative; }
.banner-full-preview > img { border: 0; border-radius: 0; height: 100%; inset: 0; max-height: none; position: absolute; width: 100%; }
.preview-shade { background: linear-gradient(90deg, rgba(248,252,255,.96), rgba(248,252,255,.76) 38%, rgba(248,252,255,0) 76%); inset: 0; position: absolute; }
.preview-overlay { display: flex; flex-direction: column; justify-content: center; left: 7%; max-width: 56%; position: absolute; top: 50%; transform: translateY(-50%); }
.preview-overlay h4 { font-weight: 700; line-height: 1.18; margin: 0 0 5px; white-space: pre-line; }
.preview-overlay > p { line-height: 1.3; margin: 0; }
.preview-overlay > small { font-weight: 700; line-height: 1.25; margin-top: 6px; }
.preview-actions { display: flex; gap: 5px; margin-top: 8px; pointer-events: none; }
.preview-actions button { align-items: center; border: 0; border-radius: 5px; display: inline-flex; font-family: inherit; font-size: 8px; gap: 4px; justify-content: center; min-height: 23px; padding: 4px 8px; }

.save-btn,
.refresh-btn {
    border: 0;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    padding: 10px 16px;
}

.save-btn {
    background: #2563eb;
    color: #fff;
    margin-top: 20px;
}

.refresh-btn {
    background: #e2e8f0;
    color: #334155;
}

.save-btn:disabled,
.refresh-btn:disabled {
    cursor: not-allowed;
    opacity: 0.55;
}

.error-text,
.success-text {
    border-radius: 8px;
    font-size: 0.9rem;
    margin-top: 12px;
    padding: 10px 12px;
    order: 6;
}

.error-text {
    background: #fef2f2;
    color: #dc2626;
}

.success-text {
    background: #f0fdf4;
    color: #15803d;
}

.banner-list-heading { align-items: center; display: flex; justify-content: space-between; order: 2; }
.banner-list-heading h3 { color: #1e293b; font-size: 1.05rem; font-weight: 700; margin: 0; }
.banner-list-heading small { color: #64748b; }
.banner-list-heading > span { background: #e2e8f0; border-radius: 999px; color: #475569; font-size: .8rem; padding: 5px 10px; }
.banner-list { display: grid; gap: 12px; margin-top: 16px; order: 3; }
.banner-item { align-items: center; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; cursor: pointer; display: grid; gap: 16px; grid-template-columns: 190px minmax(0, 1fr) auto; padding: 10px; transition: border-color .18s ease, box-shadow .18s ease; }
.banner-item:hover, .banner-item.is-editing { border-color: #2563eb; box-shadow: 0 0 0 2px rgba(37, 99, 235, .12); }
.banner-item > img { aspect-ratio: 3 / 1; border-radius: 8px; display: block; object-fit: cover; width: 100%; }
.banner-item-info { display: flex; flex-direction: column; gap: 7px; }
.banner-item-info strong { color: #1e293b; }
.banner-item-info > small { color: #64748b; font-size: .76rem; }
.visibility-toggle { align-items: center; color: #475569; cursor: pointer; display: flex; gap: 7px; font-size: .85rem; }
.banner-item-actions { display: flex; gap: 6px; }
.banner-item-actions button { align-items: center; background: #e2e8f0; border: 0; border-radius: 7px; color: #334155; cursor: pointer; display: flex; height: 34px; justify-content: center; width: 34px; }
.banner-item-actions button:disabled { cursor: not-allowed; opacity: .4; }
.banner-item-actions .delete-banner-btn { background: #fee2e2; color: #dc2626; }
.banner-item-actions .visibility-btn { background: #dcfce7; color: #15803d; }
.banner-item-actions .visibility-btn.is-banner-hidden { background: #e2e8f0; color: #64748b; }
.empty-banner-list { color: #64748b; order: 3; padding: 28px 0 8px; text-align: center; }

@media (max-width: 700px) {
    .settings-heading { align-items: stretch; flex-direction: column; }
    .button-settings-heading { align-items: stretch; flex-direction: column; }
    .add-cta-btn { justify-content: center; }
    .text-setting-grid { grid-template-columns: 1fr; }
    .button-setting-fields { grid-template-columns: 1fr 1fr; }
    .banner-item { grid-template-columns: 110px minmax(0, 1fr); }
    .banner-item-actions { grid-column: 1 / -1; justify-content: flex-end; }
}

</style>
