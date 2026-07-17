<template>
    <div class="news-wrap">
        <div class="layout">
            <!-- Form panel -->
            <div class="col">
                <h2 class="panel-title">{{ editingId ? 'Edit Article' : 'New Article' }}</h2>
                <section class="form-panel">
                    <form @submit.prevent="onSubmit">
                        <div class="form-group">
                            <label>Title <span class="required">*</span></label>
                            <input
                                v-model="form.title"
                                type="text"
                                required
                                @input="autoSlug"
                            />
                        </div>

                        <div class="form-group">
                            <label>Slug</label>
                            <input v-model="form.slug" type="text" placeholder="auto from title" />
                            <small class="hint">ถ้าไม่ใส่ จะแปลงจาก title ให้อัตโนมัติ</small>
                        </div>

                        <div class="form-group">
                            <label>Category</label>
                            <input v-model="form.category" type="text" placeholder="e.g. Cleanroom, ESD" />
                        </div>

                        <div class="form-group">
                            <label>Meta Description <small class="hint">(~160 chars)</small></label>
                            <textarea
                                v-model="form.metaDescription"
                                rows="2"
                                maxlength="160"
                                placeholder="Brief summary for SEO"
                            ></textarea>
                            <small class="hint">{{ form.metaDescription.length }} / 160</small>
                        </div>

                        <div class="form-group inline">
                            <div style="flex:1">
                                <label>Status</label>
                                <select v-model="form.status">
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Cover Image <small class="hint">(รูปบนการ์ดหน้าแรก / หน้า Blogs)</small></label>
                            <input ref="coverInput" type="file" accept="image/*" @change="onCoverChange" />

                            <ImageCropper
                                v-if="coverSourceFile"
                                ref="coverCropper"
                                :file="coverSourceFile"
                                :aspect="16 / 9"
                            />

                            <template v-else>
                                <div v-if="currentCoverUrl" class="cover-preview">
                                    <img :src="currentCoverUrl" alt="cover preview" />
                                </div>
                                <small v-else class="hint">ถ้าไม่ใส่ การ์ดจะใช้ Featured Image แทน</small>
                            </template>
                        </div>

                        <div class="form-group">
                            <label>Featured Image <small class="hint">(รูปใหญ่ในหน้าบทความ)</small></label>
                            <input type="file" accept="image/*" @change="onImageChange" />
                            <div v-if="imagePreview || (editingId && currentImageUrl)" class="image-preview">
                                <img :src="imagePreview || currentImageUrl" alt="preview" />
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Content</label>
                            <textarea
                                v-model="form.content"
                                rows="8"
                                placeholder="Article body..."
                            ></textarea>
                        </div>

                        <!-- FAQ -->
                        <div class="form-group">
                            <div class="sub-header">
                                <label>FAQ</label>
                                <button type="button" @click="addFaq">+ Add Q&amp;A</button>
                            </div>

                            <div class="faq-paste-area">
                                <textarea
                                    v-model="faqRawInput"
                                    rows="4"
                                    placeholder="Paste Q: ... A: ... block from Facebook then click Parse"
                                ></textarea>
                                <button type="button" class="btn-parse" @click="parseFaq" :disabled="!faqRawInput.trim()">
                                    Parse &amp; Add
                                </button>
                            </div>

                            <div v-if="form.faq.length === 0" class="empty-sub">
                                No FAQ items yet.
                            </div>

                            <div
                                v-for="(item, index) in form.faq"
                                :key="index"
                                class="faq-row"
                            >
                                <div class="faq-inputs">
                                    <input
                                        v-model="item.question"
                                        type="text"
                                        placeholder="Question"
                                    />
                                    <textarea
                                        v-model="item.answer"
                                        rows="2"
                                        placeholder="Answer"
                                    ></textarea>
                                </div>
                                <button
                                    type="button"
                                    class="remove-btn"
                                    @click="removeFaq(index)"
                                >✕</button>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Tags <small class="hint">(paste Facebook hashtags directly)</small></label>
                            <textarea
                                v-model="tagsInput"
                                rows="3"
                                placeholder="#Cleanroom #ESD #ถุงมือ"
                            ></textarea>
                        </div>

                        <div class="form-actions">
                            <button type="submit" class="btn-primary" :disabled="newsStore.loading">
                                {{ editingId ? 'Update' : 'Create' }}
                            </button>
                            <button
                                v-if="editingId"
                                type="button"
                                class="btn-secondary"
                                @click="resetForm"
                            >
                                Cancel
                            </button>
                        </div>

                        <p v-if="newsStore.error" class="error-msg">{{ newsStore.error }}</p>
                    </form>
                </section>
            </div>

            <!-- Table panel -->
            <div class="col">
                <div class="table-header-row">
                    <h2 class="panel-title">All Articles</h2>
                    <button class="refresh-btn" @click="newsStore.fetchNews()" :disabled="newsStore.loading">
                        Reload
                    </button>
                </div>

                <section class="table-panel">
                    <div v-if="newsStore.loading" class="info-text">Loading...</div>
                    <div v-else-if="newsStore.news.length === 0" class="info-text">
                        No articles yet. Create one using the form on the left.
                    </div>

                    <div v-else class="table-wrapper">
                        <table class="news-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Title</th>
                                    <th>Category</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(article, index) in newsStore.news" :key="article.id">
                                    <td>{{ index + 1 }}</td>
                                    <td>{{ article.title }}</td>
                                    <td>{{ article.category || '—' }}</td>
                                    <td>
                                        <span
                                            class="pill"
                                            :class="article.status === 'published' ? 'pill-on' : 'pill-off'"
                                        >
                                            {{ article.status === 'published' ? 'Published' : 'Draft' }}
                                        </span>
                                    </td>
                                    <td>
                                        <button class="link-btn" @click="startEdit(article)">Edit</button>
                                        <button class="link-btn danger" @click="onDelete(article)">Delete</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>

<script>
import { mapStores } from 'pinia'
import { useNewsStore } from '@/stores/newsStore'
import ImageCropper from '@/components/admin/imageCropper.vue'

export default {
    name: 'newsManagement',
    components: { ImageCropper },
    data() {
        return {
            editingId: null,
            slugTouched: false,
            tagsInput: '',
            faqRawInput: '',
            imagePreview: null,
            currentImageUrl: null,
            coverSourceFile: null,
            currentCoverUrl: null,
            form: {
                title: '',
                slug: '',
                category: '',
                metaDescription: '',
                status: 'draft',
                featuredImageFile: null,
                coverImageFile: null,
                content: '',
                faq: [],
            },
        }
    },
    computed: {
        ...mapStores(useNewsStore),
    },
    created() {
        if (!this.newsStore.news.length) {
            this.newsStore.fetchNews()
        }
    },
    methods: {
        autoSlug() {
            if (!this.slugTouched) {
                this.form.slug = this.form.title
                    .toLowerCase()
                    .replace(/[^a-z0-9฀-๿\s-]/g, '')
                    .trim()
                    .replace(/\s+/g, '-')
            }
        },

        onImageChange(e) {
            const file = e.target.files[0]
            if (!file) return
            this.form.featuredImageFile = file
            this.imagePreview = URL.createObjectURL(file)
        },

        // The raw pick only feeds the cropper; the upload file is produced on submit.
        onCoverChange(e) {
            const file = e.target.files[0]
            if (!file) return
            this.coverSourceFile = file
        },

        addFaq() {
            this.form.faq.push({ question: '', answer: '' })
        },

        removeFaq(index) {
            this.form.faq.splice(index, 1)
        },

        parseFaq() {
            const lines = this.faqRawInput.split('\n').map((l) => l.trim()).filter(Boolean)
            const pairs = []
            let current = null
            for (const line of lines) {
                if (line.startsWith('Q:')) {
                    if (current) pairs.push(current)
                    current = { question: line.replace(/^Q:\s*/, '').trim(), answer: '' }
                } else if (line.startsWith('A:') && current) {
                    current.answer = line.replace(/^A:\s*/, '').trim()
                }
            }
            if (current) pairs.push(current)
            this.form.faq.push(...pairs)
            this.faqRawInput = ''
        },

        resetForm() {
            this.editingId = null
            this.slugTouched = false
            this.tagsInput = ''
            this.faqRawInput = ''
            this.imagePreview = null
            this.currentImageUrl = null
            this.coverSourceFile = null
            this.currentCoverUrl = null
            // Clear the native input too, so re-picking the same file still fires change.
            if (this.$refs.coverInput) this.$refs.coverInput.value = ''
            this.form = {
                title: '',
                slug: '',
                category: '',
                metaDescription: '',
                status: 'draft',
                featuredImageFile: null,
                coverImageFile: null,
                content: '',
                faq: [],
            }
        },

        startEdit(article) {
            this.editingId = article.id
            this.slugTouched = true
            this.tagsInput = (article.tags || []).map((t) => `#${t}`).join(' ')
            this.imagePreview = null
            this.currentImageUrl = article.featuredImageUrl || null
            this.coverSourceFile = null
            this.currentCoverUrl = article.coverImageUrl || null
            this.form = {
                title: article.title || '',
                slug: article.slug || '',
                category: article.category || '',
                metaDescription: article.metaDescription || '',
                status: article.status || 'draft',
                featuredImageFile: null,
                coverImageFile: null,
                content: article.content || '',
                faq: (article.faq || []).map((f) => ({ ...f })),
            }
        },

        async onSubmit() {
            const tags = this.tagsInput
                .split(/\s+/)
                .map((t) => t.replace(/^#/, '').trim())
                .filter(Boolean)

            const coverImageFile = this.coverSourceFile
                ? await this.$refs.coverCropper.getCroppedFile(
                      `${this.form.slug || 'cover'}.jpg`,
                  )
                : null

            const payload = {
                ...this.form,
                coverImageFile,
                slug:
                    this.form.slug.trim() ||
                    this.form.title.trim().toLowerCase().replace(/\s+/g, '-'),
                tags,
            }

            if (this.editingId) {
                await this.newsStore.updateNews(this.editingId, payload)
            } else {
                await this.newsStore.saveNews(payload)
            }

            if (!this.newsStore.error) {
                this.resetForm()
            }
        },

        async onDelete(article) {
            if (!confirm(`Delete article "${article.title}"?`)) return
            await this.newsStore.deleteNews(article.id)
        },
    },
}
</script>

<style scoped>
.news-wrap {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
}

.layout {
    display: grid;
    grid-template-columns: minmax(320px, 420px) 1fr;
    gap: 32px;
    align-items: stretch;
    flex: 1;
    min-height: 0;
}

.col {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
}

.form-panel,
.table-panel {
    background: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow:
        0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
}

.form-panel::-webkit-scrollbar,
.table-panel::-webkit-scrollbar {
    width: 6px;
}
.form-panel::-webkit-scrollbar-track,
.table-panel::-webkit-scrollbar-track {
    background: transparent;
}
.form-panel::-webkit-scrollbar-thumb,
.table-panel::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}
.form-panel::-webkit-scrollbar-thumb:hover,
.table-panel::-webkit-scrollbar-thumb:hover {
    background: #cbd5e1;
}

.panel-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 16px;
    flex-shrink: 0;
}

.table-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    height: 30px;
}
.table-header-row h2 {
    margin-bottom: 0;
}

.form-group {
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.form-group.inline {
    flex-direction: row;
    gap: 16px;
    align-items: flex-end;
}

.form-group label {
    font-size: 0.9rem;
    font-weight: 600;
    color: #475569;
}

.required {
    color: #ef4444;
}

input[type='text'],
input[type='file'],
select,
textarea {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 0.9rem;
    width: 100%;
    transition: border-color 0.2s;
    font-family: inherit;
}

input:focus,
select:focus,
textarea:focus {
    outline: none;
    border-color: #3b82f6;
}

input[type='file'] {
    padding: 6px;
}

textarea {
    resize: vertical;
}

.hint {
    font-size: 0.75rem;
    color: #64748b;
}

.image-preview {
    margin-top: 8px;
}

.image-preview img {
    max-width: 100%;
    max-height: 160px;
    border-radius: 8px;
    object-fit: cover;
    border: 1px solid #e2e8f0;
}

.cover-preview {
    margin-top: 8px;
    width: 100%;
    max-width: 320px;
    aspect-ratio: 16 / 9;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    overflow: hidden;
    background: #f1f5f9;
}

.cover-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.sub-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.sub-header button {
    font-size: 0.8rem;
    padding: 4px 12px;
    border-radius: 999px;
    border: 1px solid #e2e8f0;
    background: #f8fafc;
    color: #3b82f6;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.sub-header button:hover {
    background: #eff6ff;
    border-color: #3b82f6;
}

.faq-paste-area {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 10px;
    padding: 10px;
    background: #f8fafc;
    border: 1px dashed #cbd5e1;
    border-radius: 8px;
}

.btn-parse {
    align-self: flex-start;
    font-size: 0.8rem;
    padding: 5px 14px;
    border-radius: 999px;
    border: 1px solid #3b82f6;
    background: #eff6ff;
    color: #2563eb;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-parse:hover:not(:disabled) {
    background: #dbeafe;
}

.btn-parse:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.faq-row {
    display: flex;
    gap: 8px;
    margin-top: 8px;
    align-items: flex-start;
    padding: 10px;
    background: #f8fafc;
    border-radius: 8px;
}

.faq-inputs {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.empty-sub {
    font-size: 0.85rem;
    color: #94a3b8;
    padding: 20px;
    text-align: center;
    background: #f8fafc;
    border: 1px dashed #e2e8f0;
    border-radius: 8px;
}

.remove-btn {
    border: none;
    background: transparent;
    color: #ef4444;
    cursor: pointer;
    font-size: 1.1rem;
    padding: 4px;
    flex-shrink: 0;
}

.form-actions {
    display: flex;
    gap: 12px;
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid #f1f5f9;
}

.btn-primary {
    background: #2563eb;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 8px 20px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 600;
    transition: background 0.2s;
}

.btn-primary:hover:not(:disabled) {
    background: #1d4ed8;
}

.btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-secondary {
    background: #f1f5f9;
    color: #475569;
    border: none;
    border-radius: 8px;
    padding: 8px 20px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 600;
}

.error-msg {
    color: #ef4444;
    font-size: 0.85rem;
    margin-top: 8px;
}

.refresh-btn {
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    background: white;
    padding: 6px 16px;
    font-size: 0.85rem;
    font-weight: 600;
    color: #475569;
    cursor: pointer;
    transition: all 0.2s;
}

.refresh-btn:hover:not(:disabled) {
    background: #f8fafc;
    border-color: #cbd5e1;
}

.info-text {
    font-size: 0.9rem;
    color: #64748b;
    padding: 40px;
    text-align: center;
}

.table-wrapper {
    flex: 1;
    overflow-x: auto;
}

.news-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    font-size: 0.9rem;
}

.news-table th,
.news-table td {
    padding: 12px 16px;
    border-bottom: 1px solid #f1f5f9;
    text-align: left;
}

.news-table th {
    background: #f8fafc;
    font-weight: 600;
    color: #475569;
    position: sticky;
    top: 0;
    z-index: 10;
    box-shadow: 0 1px 0 #e2e8f0;
}

.pill {
    font-size: 0.75rem;
    font-weight: 600;
    border-radius: 999px;
    padding: 4px 12px;
    display: inline-block;
}

.pill-on {
    background: #dcfce7;
    color: #15803d;
}

.pill-off {
    background: #f1f5f9;
    color: #64748b;
}

.link-btn {
    border: none;
    background: transparent;
    color: #2563eb;
    font-weight: 600;
    cursor: pointer;
    font-size: 0.85rem;
    padding: 4px 8px;
    border-radius: 6px;
    transition: background 0.2s;
}

.link-btn:hover {
    background: #eff6ff;
}

.link-btn.danger {
    color: #ef4444;
}

.link-btn.danger:hover {
    background: #fef2f2;
}
</style>
