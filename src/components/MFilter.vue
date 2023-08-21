<template>
  <template v-if="showFilter">
    <div
      class="w-full bg-[#f9fafb] border border-[rgba(34,36,38,.1)] rounded p-2 flex align-center mt-2"
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
    <div class="flex" v-if="selectedFilter">
      <div
        class="flex flex-auto mr-1 bg-[#f9fafb] border border-[rgba(34,36,38,.1)] rounded p-2 flex align-center mt-2"
      >
        <component v-model="filters[selectedFilter.field]" :is="getComponent(selectedFilter)" />
      </div>
      <div
        class="flex bg-[#f9fafb] border border-[rgba(34,36,38,.1)] rounded p-2 flex align-center mt-2"
      >
        <button
          class="text-white font-bold py-1 px-2 rounded ml-2 bg-blue-500 hover:bg-blue-700"
          @click="makeFilters"
        >
          filter
        </button>
        <button
          class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-2"
          @click="clearFilters"
        >
          clear all
        </button>
        <!-- <button
          class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded ml-2"
          @click="clearFilters"
        >
          save
        </button> -->
        <!-- <button
          class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded ml-2"
          @click="clearFilters"
        >
          chart
        </button> -->
      </div>
    </div>
  </template>
</template>

<script setup>
import { emitter } from 'formue'
import { get as getSafe } from 'lodash'
import { inject, ref, defineAsyncComponent } from 'vue'

const { listen } = emitter

const showFilter = ref(false)

listen('showFilter', () => {
  showFilter.value = !showFilter.value
  selectedFilter.value = false
})

const store = inject('store')
const filters = store.filters

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

  const registerComponent = async (filePath) => {
    const componentName = filePath
      .split('/')
      .pop()
      .replace(/\.\w+$/, '')

    components[componentName] = defineAsyncComponent(() => import(filePath))
  }

  const componentsEntry = import.meta.globEager('./filters/*.vue')

  for (const filePath in componentsEntry) {
    registerComponent(filePath)
  }

  return components
}

const components = registering()

function getComponent() {
  let component

  if (typeof selectedFilter.value.filter == 'string')
    component = getSafe(components, selectedFilter.value.filter + 'Filter')
  else component = selectedFilter.value.filter

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
</script>
