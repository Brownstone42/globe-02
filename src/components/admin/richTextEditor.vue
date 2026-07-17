<template>
    <div class="rich-text">
        <div ref="editor"></div>
    </div>
</template>

<script>
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

const TOOLBAR = [
    ['undo', 'redo'],
    [{ font: [] }],
    [{ size: ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline'],
    [{ color: [] }],
    [{ align: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    ['clean'],
]

// Quill has no built-in undo/redo buttons, so register icons for the custom ones.
const icons = Quill.import('ui/icons')
icons.undo =
    '<svg viewbox="0 0 18 18"><polygon class="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10"/>' +
    '<path class="ql-stroke" d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9"/></svg>'
icons.redo =
    '<svg viewbox="0 0 18 18"><polygon class="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10"/>' +
    '<path class="ql-stroke" d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5"/></svg>'

export default {
    name: 'richTextEditor',
    props: {
        modelValue: { type: String, default: '' },
        placeholder: { type: String, default: '' },
    },
    emits: ['update:modelValue'],
    mounted() {
        // Not in data(): the Quill instance must stay non-reactive.
        this.quill = new Quill(this.$refs.editor, {
            theme: 'snow',
            placeholder: this.placeholder,
            modules: {
                toolbar: {
                    container: TOOLBAR,
                    handlers: {
                        undo: () => this.quill.history.undo(),
                        redo: () => this.quill.history.redo(),
                    },
                },
            },
        })

        if (this.modelValue) this.setHtml(this.modelValue)

        this.quill.on('text-change', () => {
            this.$emit('update:modelValue', this.readHtml())
        })
    },
    beforeUnmount() {
        this.quill = null
    },
    watch: {
        // Reflect external changes (edit / reset) without clobbering what's being typed.
        modelValue(value) {
            if (!this.quill || value === this.readHtml()) return
            this.setHtml(value || '')
        },
    },
    methods: {
        readHtml() {
            // Quill leaves this placeholder behind for an empty document.
            const html = this.quill.root.innerHTML
            return html === '<p><br></p>' ? '' : html
        },

        setHtml(html) {
            this.quill.clipboard.dangerouslyPasteHTML(html, 'silent')
        },
    },
}
</script>

<style scoped>
.rich-text :deep(.ql-container) {
    font-family: inherit;
    font-size: 0.95rem;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    border-color: #e2e8f0;
}

.rich-text :deep(.ql-toolbar) {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    border-color: #e2e8f0;
    background: #f8fafc;
}

.rich-text :deep(.ql-editor) {
    min-height: 220px;
    line-height: 1.7;
}
</style>
