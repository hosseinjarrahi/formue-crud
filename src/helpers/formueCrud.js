import { has, get as getSafe } from 'lodash'
import { emitter } from 'formue'
import { useDynamicStore } from '@/composables/useDynamicStore'
import { markRaw } from 'vue'
import { pascalCase } from '@/helpers/common'
import axios from 'axios'

let registeredFields = {}

export function convertToSendForm(form, fields) {
  let out = {}
  let hasOneField = false
  for (let fieldName in form) {
    let field = getField(fieldName, fields)
    if (!field) continue
    hasOneField = true
    let key = getSendKey(field)

    let formKey = fieldName
    if (has(field, 'valueProp')) formKey += '.' + getSafe(field, 'valueProp', '')

    out[key] = getSafe(form, formKey)
  }

  if (!hasOneField) return form

  return out
}

export function getSendKey(field) {
  return 'sendKey' in field ? field.sendKey : field.field
}

export function getField(key, fields) {
  return fields.find((schema) => schema.field == key)
}

export function filterFieldsByShow(fields, mode = 'create') {
  return fields.filter((field) => {
    if ('showIn' in field) {
      return field.showIn.indexOf(mode) > -1
    }
    return true
  })
}

export function makeHeaders(flatFields) {
  let activeHeaders = flatFields.filter((schema) => schema.isHeader)

  activeHeaders.push({
    title: '',
    value: '_actions_',
    field: '_actions_',
    type: 'text',
    align: 'left',
    headerSort: false,
    hozAlign: 'left',
    headerHozAlign: 'left'
  })

  let indexToPush = 0
  if (flatFields.find((i) => i.field === '_select_' && i.isHeader)) indexToPush = 1

  activeHeaders.splice(indexToPush, 0, {
    title: '#',
    type: 'text',
    value: '_index_',
    field: '_index_',
    align: 'center',
    headerSort: false
  })

  return activeHeaders
}

export function filteredFields(fields, isEditing) {
  return filterFieldsByShow(fields, isEditing.value ? 'edit' : 'create')
}

export function initFields(fields) {
  for (const field of fields) {
    if ('init' in field) {
      field.init()
    }
  }
}

const getRegisterField = (field) => {
  const comp = getSafe(registeredFields, field)

  if (!comp) return ''

  return markRaw(comp)
}

const get =
  (store) =>
  (
    { url, key, foreignKey, dataKey } = {
      url: false,
      key: false,
      foreignKey: false,
      dataKey: false
    }
  ) =>
  async (...args) => {
    let search = args[0]

    let urlFetch = url

    if (foreignKey && dataKey) {
      urlFetch += urlFetch.includes('?') ? '&' : '?'
      urlFetch += `filters[${foreignKey}][$eq]={${dataKey}}`
    }

    const getModelKey = (route) => {
      let key = route.substr(route.lastIndexOf('/') + 1)
      return pascalCase(key)
    }

    if ((!key, typeof route === 'string')) {
      key = getModelKey(urlFetch)
    }

    const matches = urlFetch.match(/\{(.*?)\}/g) || []

    matches.forEach((placeholder) => {
      const field = placeholder.replace(/[{}]/g, '')
      urlFetch = urlFetch.replace(placeholder, getSafe(store.form, field, ''))
    })

    const sign = urlFetch.includes('?') ? '&' : '?'

    const res = await axios.get(urlFetch + sign + 'search=' + (search || ''))

    // store.setPagination(key, res)
    // store.setData(key, res.data)

    return getSafe(res, 'data.data', [])
  }

export const defineFields = (fn, store) => {
  return fn({ getRegisterField, axios, get: get(store), getSafe })
}

export const registerFields = (fields) => {
  registeredFields = fields
}

export function init({ fields, hiddenActions, options, route }) {
  const store = useDynamicStore('Store-' + parseInt(Math.random() * 10000000))

  store.fields = defineFields(fields, store)

  // clearEventListeners()

  emitter.event('beforeFormueInit')

  const key = store.getModelKey(route)

  store.routes[key] = typeof route == 'string' ? route : route?.route

  store.loadItems()

  store.options = options

  store.hiddenActions = hiddenActions

  initFields(store.flatFields)

  return store
}
