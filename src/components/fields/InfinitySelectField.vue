<template>
  <VAutocomplete variant="outlined" density="compact" rounded :label="getFromSchema('rel.textKey', 'text')" :items="items"
    :model-value="getValues(value)" :item-title="getFromSchema('rel.textKey')" :item-value="getFromSchema('rel.valueKey')"
    :loading="loading" v-bind="{ ...defaultProps, ...getFromSchema('props', {}) }" v-on="getFromSchema('events', {})"
    single-line @update:modelValue="updateField">
    <template #append-item>
      <div v-if="hasNextPage" v-intersect="endIntersect">{{ $fcTr('loading...') }}</div>
    </template>
  </VAutocomplete>
</template>

<script setup>
import { every, isType } from 'lodash'
import { defineProps, computed, inject } from 'vue'
import { propsField } from 'formue'
import { Intersect as VIntersect } from 'vuetify/directives'
import { VAutocomplete } from 'vuetify/components/VAutocomplete'
import 'vuetify/styles'

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

const items = computed(() => {
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
// load first
const model = store.addRoute(getFromSchema('rel.get'))
// store.loadItems(model)

const pagination = computed(() => {
  return store.paginations[model] || { lastPage: 0, currentPage: 0 }
})

const hasNextPage = computed(() => {
  return pagination.value.lastPage > pagination.value.currentPage
})

function paginate() {
  const query = ''
  store.loadItemsPlus(model, pagination.value.currentPage + 1, query)
}

const loading = computed(() => {
  return store.loadings[model]
})

function endIntersect(isIntersecting, entries, observer) {
  if (isIntersecting) {
    paginate()
  }
}

const defaultProps = {}
</script>
