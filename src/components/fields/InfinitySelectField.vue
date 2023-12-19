<template>
  <VAutocomplete
    variant="outlined"
    density="compact"
    :label="getFromSchema('rel.textKey', 'text')"
    :items="items"
    :model-value="getValues(value)"
    :item-title="getFromSchema('rel.textKey')"
    :item-value="getFromSchema('rel.valueKey')"
    :loading="loading"
    v-bind="{ ...defaultProps, ...getFromSchema('props', {}) }"
    v-on="getFromSchema('events', {})"
    single-line
    @update:modelValue="updateField"
  >
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
    return values.map((value) => value[getProp('rel.valueKey', 'value')])
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

  return 'model-' + parseInt(Math.random() * Math.random() * 1000)
}

const initialLoad = (key, get, page) => {
  if (get === null) return;

  if (checkIsArray(get)) {
    store.items[key] = get
  } else if (typeof get == 'function') {
    store.customLoadItems(key, page, get)
  } else if (typeof get == 'object' && get.route) {
    store.routes[key] = get.route
    store.loadItems(key)
  } else if (typeof get == 'string') {
    store.routes[key] = get
    store.loadItems(key)
  }
}

const key = getKey(get)

initialLoad(key, get, page)

const withChange = (items) =>
  getFromSchema('rel.withChange') ? getFromSchema('rel.withChange')(items) : items

const items = computed(() => {
  return withChange(store.items[key])
})

const pagination = computed(() => {
  return store.paginations[key] || { lastPage: 0, currentPage: 0 }
})

const hasNextPage = computed(() => {
  return pagination.value.lastPage > pagination.value.currentPage
})

function paginate() {
  const query = ''
  store.loadItemsPlus(key, pagination.value.currentPage + 1, query)
}

const loading = computed(() => {
  return store.loadings[key]
})

function endIntersect(isIntersecting, entries, observer) {
  if (isIntersecting) {
    paginate()
  }
}

const defaultProps = {}
</script>
