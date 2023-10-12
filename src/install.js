import { useLangsStore } from './stores/langStore'
import { createVuetify } from 'vuetify'
import { registerFields } from './helpers/formueCrud'

export default (app, { fields } = { fields: {} }) => {
  const vuetify = createVuetify({})
  app.use(vuetify)

  const store = useLangsStore()

  app.config.globalProperties.$fcTr = (key) => {
    return store.translate(key)
  }

  registerFields(fields)
}
