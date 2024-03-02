import './assets/main.css'

import './assets/tabulator.css'
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import install from './install'
import Vueform from '@vueform/vueform'
import vueformConfig from './../vueform.config'

window.logger = function (args, name = '*') {
  console.log(`**********Start__${name}**************`)
  console.info(args)
  console.log(`***********End__${name}*************`)
}

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
app.use(install, { fields: {} })
app.use(Vueform, vueformConfig)

app.mount('#app')
