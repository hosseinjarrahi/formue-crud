// src/install.ts
import { setDefaults } from './helpers/axios'
import { setEmitter } from './helpers/emitter'
import { useLangsStore } from './stores/langStore'
import { registerFields } from './helpers/formueCrud'

const FormueCrudPlugin = {
  install(app, { fields = {}, axiosConfig = {}, dir = 'rtl', emitter } = {}) {
    setDefaults(axiosConfig)

    const store = useLangsStore()
    store.dir = dir

    if (emitter) setEmitter(emitter)

    app.config.globalProperties.$fcTr = (key) => store.translate(key)

    registerFields(fields)
  }
}

export default FormueCrudPlugin
