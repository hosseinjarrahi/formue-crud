import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import install from './install'
import TextField from '@/components/fields/TextField.vue'

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
app.use(install, { fields: { text: TextField } })
app.mount('#app')
