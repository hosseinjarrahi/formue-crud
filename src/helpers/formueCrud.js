import { has, get as getSafe } from 'lodash'
import { emitter } from 'formue'
import { useDynamicStore } from '@/composables/useDynamicStore'
import { usePermission } from '@/composables/usePermission'
import { markRaw } from 'vue'
import { pascalCase } from '@/helpers/common'
import useFields from '@/helpers/fields'
import axios from 'axios'

let registeredFields = {}

function isFieldArrayOfObj({ form, fieldName, field }) {
  return Array.isArray(getSafe(form, fieldName)) && has(field, 'valueProp')
}

export function convertToSendForm(form, fields) {
  let out = {}

  let hasOneField = false

  for (let fieldName in form) {
    let field = getField(fieldName, fields)

    if (!field) continue

    hasOneField = true

    let key = getSendKey(field)

    let formKey = fieldName

    const valueProp = getSafe(field, 'valueProp', false)

    if (valueProp) formKey += '.' + valueProp

    if (
      isFieldArrayOfObj({
        form,
        fieldName,
        field
      })
    ) {
      out[key] = getSafe(form, fieldName).map((i) => getSafe(i, valueProp))

      continue
    }

    out[key] = getSafe(form, formKey, getSafe(form, fieldName))
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
  let activeHeaders = flatFields.filter((schema) => schema.isHeader && schema.field !== '_actions_')

  const hasAction = flatFields.find((f) => f.field === '_actions_')

  let actionField = {
    title: '',
    value: '_actions_',
    field: '_actions_',
    type: 'text',
    align: 'left',
    headerSort: false,
    hozAlign: 'left',
    headerHozAlign: 'left'
  }

  if (hasAction) {
    actionField = { ...actionField, ...hasAction }
  }

  activeHeaders.push(actionField)

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
    { url, key, foreignKey, dataKey, change } = {
      url: false,
      key: false,
      foreignKey: false,
      dataKey: false,
      change: (items) => items
    }
  ) =>
  async (...args) => {
    let search = args[0]

    let urlFetch = url

    if (foreignKey && dataKey) {
      urlFetch += urlFetch.includes('?') ? '&' : '?'
      const splitForeignKey = foreignKey.split('.')
      let filters = 'filters'
      for (const key of splitForeignKey) filters += `[${key.replace('|', '.')}]`
      urlFetch += `${filters}[$eq]={${dataKey}}`
    }

    const getModelKey = (route) => {
      const lastSlashIndex = route.lastIndexOf('/')
      let key

      if (route.includes('?')) key = route.substring(lastSlashIndex + 1, route.indexOf('?'))
      else key = route.substring(lastSlashIndex + 1)

      return pascalCase(key)
    }

    if (!key && typeof urlFetch === 'string') {
      key = getModelKey(urlFetch)
    }

    const matches = urlFetch.match(/\{(.*?)\}/g) || []

    matches.forEach((placeholder) => {
      const field = placeholder.replace(/[{}]/g, '')
      urlFetch = urlFetch.replace(placeholder, getSafe(store.form, field, ''))
    })

    const sign = urlFetch.includes('?') ? '&' : '?'

    search = typeof search === 'string' ? search : ''

    const res = await axios.get(urlFetch + sign + 'search=' + search)

    // store.setPagination(key, res)
    // store.setData(key, res.data)
    if (!change) change = (items) => items

    return change(getSafe(res, 'data.data', []))
  }

export const defineFields = (fn, store) => {
  return fn({ getRegisterField, axios, get: get(store), getSafe, useFields })
}

export const registerFields = (fields) => {
  registeredFields = fields
}

export function init({ fields, hiddenActions, options, route, structure }) {
  const { setPermissions } = usePermission()

  const store = useDynamicStore('Store-' + parseInt(Math.random() * 10000000))

  store.fields = defineFields(fields, store)

  // clearEventListeners()

  emitter.event('beforeFormueInit')

  const key = store.getModelKey(route)

  const routes = {
    create: typeof route == 'string' ? route : route.create,
    update: typeof route == 'string' ? route : route.update,
    delete: typeof route == 'string' ? route : route.delete,
    index: typeof route == 'string' ? route : route.index
  }

  store.routes[key] = routes

  store.loadItems()

  store.options = options

  setPermissions(hiddenActions)

  store.structure = structure

  initFields(store.flatFields)

  return store
}
