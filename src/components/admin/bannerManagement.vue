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
            <div class="form-group">
                <label>รูปแบนเนอร์หน้าแรก</label>
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
                </div>
                <small>แนะนำขนาด 1920 × 640 px หรือสัดส่วน 3:1</small>
            </div>

            <div class="preview-section">
                <div class="preview-heading">ตัวอย่างการแสดงผล</div>
                <div class="preview-card desktop-preview">
                    <div class="preview-label">
                        <i class="fa-solid fa-desktop"></i>
                        Desktop
                    </div>
                    <div v-if="bannerStore.loading" class="preview-placeholder">
                        กำลังโหลด...
                    </div>
                    <img v-else :src="previewUrl" alt="ตัวอย่างแบนเนอร์บนเดสก์ท็อป" />
                </div>
            </div>

            <p v-if="bannerStore.error" class="error-text">{{ bannerStore.error }}</p>
            <p v-if="successMessage" class="success-text">{{ successMessage }}</p>

            <button
                class="save-btn"
                type="button"
                :disabled="!selectedFile || bannerStore.saving"
                @click="save"
            >
                {{ bannerStore.saving ? 'กำลังอัปโหลด...' : 'บันทึกและเผยแพร่แบนเนอร์' }}
            </button>
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
        }
    },
    computed: {
        bannerStore() {
            return useBannerStore()
        },
        previewUrl() {
            return this.localPreviewUrl || this.bannerStore.imageUrl || FALLBACK_BANNER
        },
    },
    mounted() {
        this.bannerStore.loadBanner()
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
        },
        async save() {
            if (!this.selectedFile) return

            try {
                await this.bannerStore.saveBanner(this.selectedFile)
                this.releasePreview()
                this.selectedFile = null
                if (this.$refs.fileInput) this.$refs.fileInput.value = ''
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
    padding: 24px;
}

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
}

.error-text {
    background: #fef2f2;
    color: #dc2626;
}

.success-text {
    background: #f0fdf4;
    color: #15803d;
}

</style>
