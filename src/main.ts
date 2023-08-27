import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import install from './install'

import { createVuetify } from 'vuetify'

const vuetify = createVuetify({})

const pinia = createPinia()
const app = createApp(App)
app.use(vuetify)
app.use(pinia)
app.use(install)
app.mount('#app')
