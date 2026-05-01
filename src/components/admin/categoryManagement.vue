<template>
    <div class="category-wrap">
        <div class="layout">
            <!-- ฟอร์ม Add / Edit Category -->
            <div class="cat-column">
                <h2 class="panel-title">
                    {{ editingId ? 'Edit Category' : 'Add New Category' }}
                </h2>
                <section class="form-panel">
                    <form @submit.prevent="onSubmit">
                        <div class="form-group">
                            <label>Category Name</label>
                            <input v-model="form.name" type="text" required />
                        </div>

                        <div class="form-group">
                            <label>Slug</label>
                            <input v-model="form.slug" type="text" placeholder="auto from name" />
                            <small class="hint"> ถ้าไม่ใส่ จะใช้ name แปลงเป็น slug ให้ </small>
                        </div>

                        <div class="form-group">
                            <label>Description</label>
                            <textarea
                                v-model="form.description"
                                rows="3"
                                placeholder="Description for this category"
                            ></textarea>
                        </div>

                        <div class="form-group">
                            <label>Image (URL or path)</label>
                            <input
                                v-model="form.image"
                                type="text"
                                placeholder="เช่น categories/gloves.png"
                            />
                        </div>

                        <div class="form-group inline">
                            <div>
                                <label>Order</label>
                                <input v-model.number="form.order" type="number" min="0" />
                            </div>

                            <div class="visibility">
                                <label>Visibility</label>
                                <label class="toggle">
                                    <input type="checkbox" v-model="form.visibility" />
                                    <span>{{ form.visibility ? 'Visible' : 'Hidden' }}</span>
                                </label>
                            </div>
                        </div>

                        <!-- Subcategories -->
                        <div class="form-group">
                            <div class="sub-header">
                                <label>Sub-Categories</label>
                                <button type="button" @click="addSubcategory">
                                    + Add Sub-Category
                                </button>
                            </div>

                            <div v-if="form.subcategories.length === 0" class="empty-sub">
                                This category has no sub-categories.
                            </div>

                            <div
                                v-for="(sub, index) in form.subcategories"
                                :key="index"
                                class="sub-row"
                            >
                                <input
                                    v-model="sub.name"
                                    type="text"
                                    placeholder="Sub-category name"
                                />
                                <input
                                    v-model="sub.id"
                                    type="text"
                                    placeholder="id/slug (e.g. nitrile)"
                                />
                                <input
                                    v-model.number="sub.order"
                                    type="number"
                                    min="0"
                                    class="order-input"
                                />
                                <label class="sub-toggle">
                                    <input type="checkbox" v-model="sub.visibility" />
                                    <span>Show</span>
                                </label>
                                <button
                                    type="button"
                                    class="remove-btn"
                                    @click="removeSubcategory(index)"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        <div class="form-actions">
                            <button type="submit" class="btn-primary">
                                {{ editingId ? 'Update Category' : 'Create Category' }}
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
                    </form>
                </section>
            </div>

            <!-- ตาราง Category -->
            <div class="cat-column">
                <div class="table-header-row">
                    <h2 class="panel-title">All Categories</h2>
                    <button class="refresh-btn" @click="reload" :disabled="loading">Reload</button>
                </div>

                <section class="table-panel">
                    <div v-if="loading" class="info-text">Loading categories...</div>
                    <div v-else-if="sortedCategories.length === 0" class="info-text">
                        No categories yet. Create one using the form on the left.
                    </div>

                    <div v-else class="cat-table-wrapper">
                        <table class="cat-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Slug</th>
                                    <th>Order</th>
                                    <th>Visible</th>
                                    <th>Sub-Count</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(cat, index) in sortedCategories" :key="cat.id">
                                    <td>{{ index + 1 }}</td>
                                    <td>{{ cat.name }}</td>
                                    <td>{{ cat.slug }}</td>
                                    <td>{{ cat.order }}</td>
                                    <td>
                                        <button
                                            class="pill"
                                            :class="cat.visibility ? 'pill-on' : 'pill-off'"
                                            @click="onToggleVisibility(cat)"
                                        >
                                            {{ cat.visibility ? 'Visible' : 'Hidden' }}
                                        </button>
                                    </td>
                                    <td>{{ (cat.subcategories || []).length }}</td>
                                    <td>
                                        <button class="link-btn" @click="startEdit(cat)">
                                            Edit
                                        </button>
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
import { useCategoryStore } from '@/stores/categoryStore'

export default {
    name: 'categoryManagement',
    data() {
        return {
            editingId: null,
            form: {
                name: '',
                slug: '',
                description: '',
                image: '',
                order: 0,
                visibility: true,
                subcategories: [],
            },
        }
    },
    computed: {
        // ผูก Pinia store แบบ Options API
        ...mapStores(useCategoryStore),

        loading() {
            return this.categoryStore.loading
        },
        categories() {
            return this.categoryStore.categories
        },
        sortedCategories() {
            return this.categoryStore.sortedCategories
        },
    },
    created() {
        if (!this.categoryStore.categories.length) {
            this.categoryStore.loadCategories()
        }
    },
    methods: {
        resetForm() {
            this.editingId = null
            this.form = {
                name: '',
                slug: '',
                description: '',
                image: '',
                order: 0,
                visibility: true,
                subcategories: [],
            }
        },

        reload() {
            this.categoryStore.loadCategories()
        },

        startEdit(cat) {
            this.editingId = cat.id
            this.form = {
                name: cat.name || '',
                slug: cat.slug || '',
                description: cat.description || '',
                image: cat.image || '',
                order: cat.order || 0,
                visibility: cat.visibility ?? true,
                subcategories: (cat.subcategories || []).map((s) => ({ ...s })),
            }
        },

        async onSubmit() {
            const payload = {
                name: this.form.name.trim(),
                slug:
                    this.form.slug.trim() ||
                    this.form.name.trim().toLowerCase().replace(/\s+/g, '-'),
                description: this.form.description.trim(),
                image: this.form.image.trim(),
                order: this.form.order ?? 0,
                visibility: this.form.visibility,
                subcategories: this.form.subcategories.map((s, index) => ({
                    id: (s.id && s.id.trim()) || s.name.trim().toLowerCase().replace(/\s+/g, '-'),
                    name: s.name.trim(),
                    order: s.order ?? index,
                    visibility: s.visibility ?? true,
                })),
            }

            try {
                if (this.editingId) {
                    await this.categoryStore.updateCategory(this.editingId, payload)
                } else {
                    await this.categoryStore.createCategory(payload)
                }
                this.resetForm()
            } catch (err) {
                console.error('Save category error:', err)
                // ตรงนี้คุณอาจจะเอาไปแสดง error ใน UI ตาม style ของเว็บ
            }
        },

        addSubcategory() {
            this.form.subcategories.push({
                id: '',
                name: '',
                order: this.form.subcategories.length,
                visibility: true,
            })
        },

        removeSubcategory(index) {
            this.form.subcategories.splice(index, 1)
        },

        async onToggleVisibility(cat) {
            try {
                await this.categoryStore.toggleVisibility(cat.id)
            } catch (err) {
                console.error('toggle visibility error:', err)
            }
        },

        async onDelete(cat) {
            if (!confirm(`Delete category "${cat.name}"?`)) return
            try {
                await this.categoryStore.deleteCategory(cat.id)
            } catch (err) {
                console.error('delete category error:', err)
            }
        },
    },
}
</script>

<style scoped>
.category-wrap {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
}

.layout {
    display: grid;
    grid-template-columns: minmax(320px, 400px) 1fr;
    gap: 32px;
    align-items: stretch;
    flex: 1;
    min-height: 0;
}

.cat-column {
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

/* Custom Scrollbar Styles */
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
    height: 30px; /* Aligns with form-panel title */
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
    justify-content: space-between;
    gap: 16px;
    align-items: flex-end;
}

.form-group label {
    font-size: 0.9rem;
    font-weight: 600;
    color: #475569;
}

input[type='text'],
input[type='number'],
textarea {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 0.9rem;
    width: 100%;
    transition: border-color 0.2s;
}

input:focus,
textarea:focus {
    outline: none;
    border-color: #3b82f6;
}

textarea {
    resize: vertical;
}

.hint {
    font-size: 0.75rem;
    color: #64748b;
}

.visibility {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.toggle,
.sub-toggle {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 0.85rem;
    cursor: pointer;
    color: #475569;
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

.sub-row {
    display: grid;
    grid-template-columns: 2fr 1.5fr 0.8fr auto auto;
    gap: 8px;
    margin-top: 8px;
    align-items: center;
    padding: 8px;
    background: #f8fafc;
    border-radius: 8px;
}

.order-input {
    max-width: 70px;
}

.remove-btn {
    border: none;
    background: transparent;
    color: #ef4444;
    cursor: pointer;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    justify-content: center;
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

.btn-primary:hover {
    background: #1d4ed8;
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

.table-header {
    margin-bottom: 0;
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

.refresh-btn:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
}

.info-text {
    font-size: 0.9rem;
    color: #64748b;
    padding: 40px;
    text-align: center;
}

.cat-table-wrapper {
    flex: 1;
    overflow-x: auto;
}

.cat-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    font-size: 0.9rem;
}

.cat-table th,
.cat-table td {
    padding: 12px 16px;
    border-bottom: 1px solid #f1f5f9;
    text-align: left;
}

.cat-table th {
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
    border: none;
    cursor: pointer;
}

.pill-on {
    background: #dcfce7;
    color: #15803d;
}

.pill-off {
    background: #fee2e2;
    color: #b91c1c;
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
