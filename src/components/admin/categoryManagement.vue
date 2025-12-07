<template>
    <div class="category-wrap">
        <h1 class="title">Category Management</h1>

        <div class="layout">
            <!-- ฟอร์ม Add / Edit Category -->
            <section class="form-panel">
                <h2 class="panel-title">
                    {{ editingId ? 'Edit Category' : 'Add New Category' }}
                </h2>

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
                            <input v-model="sub.name" type="text" placeholder="Sub-category name" />
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

            <!-- ตาราง Category -->
            <section class="table-panel">
                <div class="table-header">
                    <h2>All Categories</h2>
                    <button class="refresh-btn" @click="reload" :disabled="loading">Reload</button>
                </div>

                <div v-if="loading" class="info-text">Loading categories...</div>
                <div v-else-if="sortedCategories.length === 0" class="info-text">
                    No categories yet. Create one using the form on the left.
                </div>

                <table v-else class="cat-table">
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
                                <button class="link-btn" @click="startEdit(cat)">Edit</button>
                                <!-- ถ้าไม่อยากให้ลบจริงๆ อาจไม่ใช้ปุ่มนี้ -->
                                <!--
                                <button
                                    class="link-btn danger"
                                    @click="onDelete(cat)"
                                >
                                    Delete
                                </button>
                                -->
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
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
    gap: 16px;
}

.title {
    font-size: 1.4rem;
    font-weight: 600;
    margin-bottom: 8px;
}

.layout {
    display: grid;
    grid-template-columns: minmax(320px, 380px) 1fr;
    gap: 20px;
    align-items: flex-start;
}

.form-panel,
.table-panel {
    background: white;
    border-radius: 10px;
    padding: 16px 20px;
    box-shadow: 0 4px 10px rgba(15, 23, 42, 0.05);
}

.panel-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 12px;
}

.form-group {
    margin-bottom: 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.form-group.inline {
    flex-direction: row;
    justify-content: space-between;
    gap: 12px;
    align-items: flex-end;
}

.form-group label {
    font-size: 0.85rem;
    font-weight: 500;
    color: #374151;
}

input[type='text'],
input[type='number'],
textarea {
    border: 1px solid #d1d5db;
    border-radius: 6px;
    padding: 6px 8px;
    font-size: 0.9rem;
    width: 100%;
}

textarea {
    resize: vertical;
}

.hint {
    font-size: 0.75rem;
    color: #6b7280;
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
    gap: 6px;
    font-size: 0.85rem;
    cursor: pointer;
}

.sub-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.sub-header button {
    font-size: 0.8rem;
    padding: 4px 8px;
    border-radius: 999px;
    border: 1px solid #d1d5db;
    background: #f9fafb;
    cursor: pointer;
}

.sub-row {
    display: grid;
    grid-template-columns: 2fr 1.5fr 0.8fr auto auto;
    gap: 6px;
    margin-top: 6px;
    align-items: center;
}

.order-input {
    max-width: 70px;
}

.remove-btn {
    border: none;
    background: transparent;
    color: #ef4444;
    cursor: pointer;
    font-size: 1rem;
}

.empty-sub {
    font-size: 0.8rem;
    color: #9ca3af;
    padding: 6px 0;
}

.form-actions {
    display: flex;
    gap: 8px;
    margin-top: 10px;
}

.btn-primary {
    background: #2563eb;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 6px 12px;
    cursor: pointer;
    font-size: 0.9rem;
}

.btn-secondary {
    background: #e5e7eb;
    color: #111827;
    border: none;
    border-radius: 6px;
    padding: 6px 12px;
    cursor: pointer;
    font-size: 0.9rem;
}

.table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.table-header h2 {
    font-size: 1rem;
    font-weight: 600;
}

.refresh-btn {
    border-radius: 999px;
    border: 1px solid #d1d5db;
    background: #f9fafb;
    padding: 4px 10px;
    font-size: 0.8rem;
    cursor: pointer;
}

.info-text {
    font-size: 0.85rem;
    color: #6b7280;
}

.cat-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.85rem;
    margin-top: 6px;
}

.cat-table th,
.cat-table td {
    padding: 6px 8px;
    border-bottom: 1px solid #e5e7eb;
    text-align: left;
}

.cat-table th {
    background: #f9fafb;
    font-weight: 500;
}

.pill {
    font-size: 0.75rem;
    border-radius: 999px;
    padding: 2px 8px;
    border: none;
    cursor: pointer;
}

.pill-on {
    background: #dcfce7;
    color: #166534;
}

.pill-off {
    background: #fee2e2;
    color: #b91c1c;
}

.link-btn {
    border: none;
    background: transparent;
    color: #2563eb;
    cursor: pointer;
    font-size: 0.8rem;
    padding: 0 4px;
}

.link-btn.danger {
    color: #ef4444;
}
</style>
