import MCrud from './components/MCrud.vue'
import './assets/main.css'

export function install(app) {
  app.config.globalProperties.$fcTr = () => {
    
  }
}

export { MCrud }
