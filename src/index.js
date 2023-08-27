import MCrud from './components/MCrud.vue'
import './assets/main.css'

import { createVuetify } from 'vuetify'

const vuetify = createVuetify({})

export function install(app) {
  app.config.globalProperties.$fcTr = () => {
    
  }
}

export { MCrud, vuetify }
