import { setDefaults } from './helpers/axios'
import { setEmitter } from './helpers/emitter'
import { useLangsStore } from './stores/langStore'
import { registerFields } from './helpers/formueCrud'

export default (
  app,
  { fields = {}, axiosConfig = {}, dir = 'rtl', emitter = false } = {}
) => {
  setDefaults(axiosConfig)

  const store = useLangsStore()

  // `dir` already defaults to 'rtl', so `|| 'rtl'` is optional.
  store.dir = dir

  if (emitter) {
    setEmitter(emitter)
  }

  app.config.globalProperties.$fcTr = (key) => {
    return store.translate(key)
  }

  registerFields(fields)
}
