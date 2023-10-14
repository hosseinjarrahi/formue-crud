import { defineStore } from 'pinia'
import { get as getSafe } from 'lodash'
import langs from '@/languages/index'

export const useLangsStore = defineStore('formuCrudLangs', {
  state: () => ({
    lang: 'en',
    langs
  }),

  getters: {
    currentLang(state) {
      return getSafe(state.langs, state.lang, 'fa')
    }
  },

  actions: {
    translate(key) {
      return getSafe(this.currentLang, key, key)
    }
  }
})
