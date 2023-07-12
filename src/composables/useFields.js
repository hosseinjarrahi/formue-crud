import { computed, shallowRef } from 'vue'
import { useStore } from './useStore'
import { has } from 'lodash'
import { updateRowNumber, actions } from './useTabulator'
import ActionButton from '@/components/ActionButton.vue'

let fields = shallowRef([])

const flatFields = computed(() => {
  if (!Array.isArray(fields.value)) {
    return []
  }
  return fields.value.map((field) => {
    if (has(field, 'groupLabel')) {
      return field.items
    }
    return field
  })
})

const headers = computed(() => {
  let temp = flatFields.value.filter((schema) => schema.isHeader)
  temp.push({
    title: 'Actions',
    sortable: false,
    value: '_actions_',
    type: 'text',
    align: 'left',
    formatter: actions,
    formatterParams: {
      component: ActionButton
    }
  })
  temp.unshift({
    title: '#',
    type: 'text',
    value: '_index_',
    field: '_index_',
    align: 'center',
    sortable: false,
    formatter: updateRowNumber
  })
  return temp
})

function reset() {
  Object.assign(fields, [])
}

function filteredFields(fields) {
  const { isEditing } = useStore()

  return filterFieldsByShow(fields.value, isEditing.value ? 'edit' : 'create')
}

function getSendKey(field) {
  return 'sendKey' in field ? field.sendKey : field.field
}

function initFields() {
  for (const field of fields.value) {
    if ('init' in field) {
      field.init()
    }
  }
}

function getField(key) {
  return flatFields.value.find((schema) => schema.field == key)
}

function filterFieldsByShow(fields, mode = 'create') {
  return fields.value.filter((field) => {
    if ('showIn' in field) {
      return field.showIn.indexOf(mode) > -1
    }
    return true
  })
}

function convertToSendForm(form, inpFields = false) {
  let finalFields = inpFields || flatFields.value
  let out = {}
  let hasOneField = false
  for (let fieldName in form.value) {
    let field = findField(fieldName, finalFields)
    if (!field) continue
    hasOneField = true
    let key = getSendKey(field)
    out[key] = form.value[fieldName]
  }
  if (!hasOneField) return form
  return out
}

function findField(field, fields = false) {
  if (fields.value) {
    return fields.value.find((f) => f.field === field)
  }
  return getField(field)
}

function hasChild(field) {
  return has(field, 'rel.child.model')
}

export const useFields = () => ({
  reset,
  fields,
  headers,
  hasChild,
  getField,
  findField,
  initFields,
  flatFields,
  getSendKey,
  filteredFields,
  convertToSendForm,
  filterFieldsByShow
})
