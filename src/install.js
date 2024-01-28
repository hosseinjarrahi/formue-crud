import { useLangsStore } from './stores/langStore'
import { createVuetify } from 'vuetify'
import { registerFields } from './helpers/formueCrud'
import { setDefaults } from './helpers/axios'

export default (
  app,
  { fields, axiosConfig, dir } = { fields: {}, axiosConfig: {}, dir: 'rtl' }
) => {
  setDefaults(axiosConfig)

  const vuetify = createVuetify({
    locale: {
      locale: 'customLocale',
      rtl: {
        customLocale: true
      }
    }
  })
  app.use(vuetify)

  const store = useLangsStore()

  store.dir = dir || 'rtl'

  app.config.globalProperties.$fcTr = (key) => {
    return store.translate(key)
  }

  registerFields(fields)
}
