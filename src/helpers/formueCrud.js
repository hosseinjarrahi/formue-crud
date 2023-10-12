import { has, get as getSafe } from 'lodash'
import { emitter } from 'formue'
import { useDynamicStore } from '@/composables/useDynamicStore'
import { markRaw } from 'vue'

export function convertToSendForm(form, fields) {
  let out = {}
  let hasOneField = false
  for (let fieldName in form.value) {
    let field = getField(fieldName, fields)
    if (!field) continue
    hasOneField = true
    let key = getSendKey(field)
    out[key] = form.value[fieldName]
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

export function hasChild(field) {
  return has(field, 'rel.child.model')
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

export function init({ fields, hiddenActions, options, route }) {
  const store = useDynamicStore()

  store.fields = fields

  // clearEventListeners()

  emitter.event('beforeFormueInit')

  store.addRoute(route)

  store.loadItems()

  // loadRelations(getSafe(payload, 'relations', []))

  store.options = options

  store.hiddenActions = hiddenActions

  initFields(store.flatFields)

  return store
}

let registeredFields = {}

export const registerFields = (fields) => {
  registeredFields = fields
}

const getRegisterField = (field) => {
  return markRaw(getSafe(registeredFields, field))
}

export function defineFields(fn) {
  return fn(getRegisterField)
}
