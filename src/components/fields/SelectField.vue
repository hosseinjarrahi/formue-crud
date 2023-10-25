<template>
  <VAutocomplete
    variant="outlined"
    density="compact"
    hide-details="auto"
    :label="getFromSchema('rel.textKey', 'text')"
    :items="items"
    :model-value="getValues(value)"
    v-bind="{ ...defaultProps, ...getFromSchema('props', {}) }"
    v-on="getFromSchema('events', {})"
    :item-title="getFromSchema('rel.textKey')"
    :item-value="getFromSchema('rel.valueKey')"
    @update:modelValue="updateField"
  />
</template>

<script setup>
import { get as getSafe, every, isType } from 'lodash'
import { defineProps, computed, inject } from 'vue'
import { propsField } from 'formue'
import { VAutocomplete } from 'vuetify/components/VAutocomplete'
// import 'vuetify/styles'

const page = 1
const store = inject('store')
const props = defineProps(propsField)
const { getFromSchema, updateField, getProp } = props
const get = getFromSchema('rel.get')

function checkIsArray(get) {
  return Array.isArray(Object.getPrototypeOf(get))
}

function areAllItemsOfType(array, type) {
  if (!Array.isArray(array)) return false

  return every(array, (item) => isType(item, type))
}

function getValues(values) {
  if (areAllItemsOfType(values, 'object')) {
    return values.map((value) => value[getFromSchema('rel.valueKey', 'value')])
  }
  return values
}

function getKey(get) {
  if (getFromSchema('rel.key', false)) {
    return getFromSchema('rel.key')
  }

  if (typeof get == 'string') {
    return store.getModelKey(get)
  }

  return 'model-' + parseInt(Math.random(10000) * Math.random(10000) * 1000)
}

const initialLoad = (key, get, page) => {
  if (get === null) return;

  if (checkIsArray(get)) {
    store.items[key] = get
  } else if (typeof get == 'function') {
    store.customLoadItems(key, page, get)
  } else if (typeof get == 'object' && get.route) {
    store.routes[key] = get.route
    store.getItems(key)
  } else if (typeof get == 'string') {
    store.routes[key] = get
    store.getItems(key)
  }
}

const key = getKey(get)

initialLoad(key, get, page)

const withChange = (items) =>
  getFromSchema('rel.withChange') ? getFromSchema('rel.withChange')(items) : items

const items = computed(() => {
  return withChange(store.items[key])
})

const defaultProps = {}
</script>
