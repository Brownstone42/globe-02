import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './firebase'

import 'bulma/css/bulma.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
// Styles the ql-align/ql-indent/ql-size/ql-font classes that Quill writes into
// article HTML, so the public blog pages render it the same way the editor did.
import 'quill/dist/quill.core.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
