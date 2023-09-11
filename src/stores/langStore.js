import { defineStore } from 'pinia'
import { get as getSafe } from 'lodash'
import langs from '@/languages/index'

export const useLangsStore = defineStore('formuCrudLangs', {
  state: () => ({
    lang: 'fa',
    langs
  }),

  getters: {
    currentLang(state) {
      return getSafe(state.langs, state.lang, 'en')
    }
  },

  actions: {
    translate(key) {
      return getSafe(this.currentLang, key, key)
    }
  }
})
