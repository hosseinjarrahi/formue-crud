import { useLangsStore } from './stores/langStore'

export default (app) => {
  const store = useLangsStore()
  
  app.config.globalProperties.$fcTr = (key) => {
    return store.translate(key)
  }
}
