import { has, get as getSafe } from 'lodash'
import { emitter } from '@/helpers/emitter'
import { useDynamicStore } from '@/composables/useDynamicStore'
import { usePermission } from '@/composables/usePermission'
import { markRaw } from 'vue'
import { pascalCase } from '@/helpers/common'
import useFields from '@/helpers/fields'
import axios from 'axios'

let registeredFields = {}

function isFieldArrayOfObj({ form, fieldName, field }) {
  const value = getSafe(form, fieldName)
  const isArray = Array.isArray(value)
  const hasValueProp = has(field, 'valueProp')

  if (!isArray) return false

  // If field declares a valueProp, we expect array of objects.
  if (hasValueProp) {
    const firstItem = value[0]
    const isObjectArray = firstItem && typeof firstItem === 'object' && !Array.isArray(firstItem)
    return isObjectArray
  }

  return false
}

export function convertToSendForm(form, fields) {
  // Remove console logs for memory efficiency
  // console.log('convertToSendForm START')
  // console.log('Input form:', JSON.stringify(form, null, 2))
  // console.log('Input fields:', JSON.stringify(fields, null, 2))

  let out = {}
  // console.log('Initialized output object:', out)

  let hasOneField = false
  // console.log('Initialized hasOneField:', hasOneField)

  for (let fieldName in form) {
    // console.log('\n--- Processing field:', fieldName, '---')
    let field = getField(fieldName, fields)
    // console.log('Retrieved field definition:', field)

    if (!field) {
      // console.log('⚠️ Field not found, skipping:', fieldName)
      continue
    }

    hasOneField = true
    // console.log('Set hasOneField = true')

    let key = getSendKey(field)
    // console.log('Computed send key:', key)

    let formKey = fieldName
    // console.log('Base formKey:', formKey)

    const valueProp = getSafe(field, 'valueProp', false)
    // console.log('ValueProp:', valueProp)

    if (valueProp) {
      formKey += '.' + valueProp
      // console.log('Adjusted formKey with valueProp:', formKey)
    }

    const isArrayOfObj = isFieldArrayOfObj({ form, fieldName, field })
    // console.log('Is field array of objects?', isArrayOfObj)

    if (isArrayOfObj) {
      out[key] = getSafe(form, fieldName).map((i, idx) => {
        const mappedValue = getSafe(i, valueProp)
        // console.log(`  Mapping array item [${idx}]:`, i, '→', mappedValue)
        return mappedValue
      })

      // console.log('Added array field to output:', key, out[key])
      continue
    }

    const safeValue = getSafe(form, formKey, getSafe(form, fieldName))
    // console.log('Resolved safe value:', safeValue)

    out[key] = safeValue
    // console.log('Added field to output:', key, safeValue)
  }

  // console.log('\nHas at least one field?', hasOneField)
  if (!hasOneField) {
    // console.log('Returning original form (no valid fields found).')
    return form
  }

  // console.log('Final output:', JSON.stringify(out, null, 2))
  // console.log('convertToSendForm END\n')
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
    maxWidth: '100px',
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

export function init({ fields, hiddenActions, options, route, structure, query }) {
  const { setPermissions } = usePermission()

  const store = useDynamicStore('Store-' + parseInt(Math.random() * 10000000))

  store.query = query || ''

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
