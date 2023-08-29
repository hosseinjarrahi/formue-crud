import { useLangsStore } from './stores/langStore'
import { createVuetify } from 'vuetify'

export default (app) => {
  const vuetify = createVuetify({})
  app.use(vuetify)

  const store = useLangsStore()
  app.config.globalProperties.$fcTr = (key) => {
    return store.translate(key)
  }
}
