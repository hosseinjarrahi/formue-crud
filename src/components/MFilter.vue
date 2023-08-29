<template>
  <template v-if="store.panel === 'filters'">
    <div class="flex">
      <div
        class="flex items-center flex-auto ltr:mr-1 bg-[#f9fafb] border border-[rgba(34,36,38,.1)] rounded p-2 flex align-center mt-2"
      >
        <div
          v-for="header in store.headersWithoutActions"
          :key="header.field"
          class="px-1 cursor-pointer divide-y rounded"
          :class="{
            underline: getSafe(filters, header.field + '.value'),
            'bg-red-600 text-white': header.field === selectedFilter.field
          }"
          @click="selectFilter(header)"
        >
          {{ header.title }}
        </div>
      </div>
      <div
        class="flex bg-[#f9fafb] border border-[rgba(34,36,38,.1)] rounded p-2 flex align-center mt-2"
      >
        <button
          class="text-white font-bold py-1 px-2 rounded ml-2 bg-blue-500 hover:bg-blue-700"
          @click="makeFilters"
        >
          {{ $fcTr('Filter') }}
        </button>
        <button
          class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-2"
          @click="clearFilters"
        >
          {{ $fcTr('Clear all') }}
        </button>
        <button
          class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded ml-2"
          @click="saveFilter"
        >
          {{ $fcTr('Save') }}
        </button>
        <button
          class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded ml-2"
          @click=";[(chooseFilter = true), (selectedFilter = false)]"
        >
          {{ $fcTr('choose filter') }}
        </button>
      </div>
    </div>

    <div
      v-if="selectedFilter"
      class="flex flex-auto bg-[#f9fafb] border border-[rgba(34,36,38,.1)] rounded p-2 flex align-center mt-2"
    >
      <component
        v-model="filters[selectedFilter.field]"
        :is="getComponent(selectedFilter)"
        :field="selectedFilter"
      />
    </div>

    <div
      v-else-if="chooseFilter"
      class="flex flex-auto bg-[#f9fafb] border border-[rgba(34,36,38,.1)] rounded p-2 flex align-center mt-2"
    >
      <div
        v-for="(LFilters, filterName) in localFilters"
        :key="filterName"
        class="px-1 cursor-pointer divide-y rounded bg-blue-600 mx-1 text-white flex align-items-center"
      >
        <span class="px-4">{{ filterName }}</span>
        <button class="mx-2 bg-green-600 px-3" @click="loadFilter(LFilters)">LOAD</button>
        <button class="mx-2 bg-red-600 px-3" @click.stop="removeFilter(filterName)">DEL</button>
      </div>
    </div>
  </template>
</template>

<script setup>
import { get as getSafe, capitalize } from 'lodash'
import { inject, ref } from 'vue'
import { useStorage } from '@vueuse/core'

const chooseFilter = ref(false)

const store = inject('store')
const filters = store.filters
const localFilters = getLocalFilters()

const selectedFilter = ref(false)

const selectFilter = (filter) => {
  if (selectedFilter.value.field === filter.field) {
    selectedFilter.value = false
  } else {
    selectedFilter.value = filter
  }
}

function registering() {
  const components = {}

  const registerComponent = async (filePath, comp) => {
    const componentName = filePath
      .split('/')
      .pop()
      .replace(/\.\w+$/, '')

    components[componentName] = comp.default
  }

  const componentsEntry = import.meta.globEager('./filters/*.vue')

  for (const filePath in componentsEntry) {
    registerComponent(filePath, componentsEntry[filePath])
  }

  return components
}

const components = registering()

function getComponent() {
  let component

  const filter = capitalize(selectedFilter.value.filter)

  if (typeof selectedFilter.value.filter == 'string')
    component = getSafe(components, filter + 'Filter')
  else component = filter

  return component
}

function clearFilters() {
  store.isFiltering = false
  for (const key in filters) {
    filters[key] = {}
  }
  store.reloadData()
}

function makeFilters() {
  store.isFiltering = true
  store.getWithFilter()
}

function saveFilter() {
  let filterName = prompt('نام فیتر')

  if (filterName) localFilters.value[filterName] = { ...filters }
}

function getLocalFilters() {
  const storeName = window.location.pathname.replace(/^\/|\/$/g, '') + '-filters'

  return useStorage(storeName, {}, localStorage, { mergeDefaults: true })
}

function loadFilter(LFilters) {
  for (const key in filters) delete filters[key]
  Object.assign(filters, { ...LFilters })
  makeFilters()
}

function removeFilter(filterName) {
  console.log(filterName)
  delete localFilters.value[filterName]
}
</script>
