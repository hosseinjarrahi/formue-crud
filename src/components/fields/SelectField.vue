<template>
  <vSelect
    v-bind="{ ...defaultProps, ...getFromSchema('props', {}) }"
    v-on="{ ...defaultEvents, ...getFromSchema('events', {}) }"
    :options="options"
  />
</template>

<script setup>
import { get as getSafe, every, isType } from 'lodash'
import { defineProps, computed, inject } from 'vue'
import { propsField } from 'formue'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

const store = inject('store')
const props = defineProps(propsField)
const { getFromSchema, updateField, getProp } = props

function checkGetIsArray() {
  const get = getFromSchema('rel.get')
  if (Array.isArray(Object.getPrototypeOf(get))) return true
  return false
}

function areAllItemsOfType(array, type) {
  if (!Array.isArray(array)) return false

  return every(array, (item) => isType(item, type))
}

function getValues(values) {
  if (areAllItemsOfType(values, 'object')) {
    return values.map((value) => value[getProp('valueKey', 'value')])
  }
  return values
}

function loadData() {
  if (checkGetIsArray()) return

  if (!getFromSchema('rel.get')) return

  const key = store.addRoute(getFromSchema('rel.get'))
  store.loadItems(key)
  return key
}

const key = loadData()

const options = computed(() => {
  const get = getFromSchema('rel.get')
  let items = []
  const withChange = getFromSchema('rel.withChange')

  if (checkGetIsArray()) {
    items = get
  } else if (getFromSchema('rel')) {
    // if (getFromSchema('needFilter')) {
    //   return props.filters[props.field.rel.model]
    // }
    items = store.getItems(key)
  }

  return withChange ? withChange(items) : items
})

let defaultProps = {
  class: 'w-full',
  label: getFromSchema('rel.textKey', 'text'),
  modelValue: getValues(props.value),
  reduce: (item) => getSafe(item, getFromSchema('rel.valueKey', 'value'))
}

let defaultEvents = {
  'update:modelValue': updateField
}
</script>
