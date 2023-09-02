<template>
  <transition name="scale">
    <div
      class="border-muted-200 dark:border-muted-700 dark:bg-muted-800 relative mb-4 w-full rounded-md border bg-white p-6 transition-all duration-300 z-[0]"
      v-if="store.panel === 'filters'"
    >
      <div class="flex flex-col ml-1 align-center border-b border-[rgba(0,0,0,.1)] pb-4">
        <!-- <div
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
          </div> -->
        <div class="flex justify-between mb-4 items-center">
          <h3
            class="font-heading text-base font-semibold leading-tight text-muted-800 dark:text-white"
          >
            {{ $fcTr('filter_data') }}
          </h3>
          <div class="flex items-center">
            <button
              @click=";[(chooseFilter = true), (selectedFilter = false)]"
              class="is-button rounded is-button-default"
            >
              {{ $fcTr('choose_filter') }}
            </button>
            <!-- <button @click="choose('filters')" class="ml-3 rtl:ml-0 rtl:mr-3">
              <svg width="1rem" viewBox="0 0 384 512">
                <path
                  class="fill-muted-500"
                  d="M192 233.4L59.5 100.9 36.9 123.5 169.4 256 36.9 388.5l22.6 22.6L192 278.6 324.5 411.1l22.6-22.6L214.6 256 347.1 123.5l-22.6-22.6L192 233.4z"
                />
              </svg>
            </button> -->
          </div>
        </div>
        <div class="flex w-full justify-between">
          <MForm
            class="w-[75%] justify-between"
            :fields="fields"
            v-model="form"
            :form-data="formData"
          />
          <div class="w-[24%]">
            <button
              class="!border-dashed is-button-default is-button w-full rounded-full font-bold py-1 px-2 !border-green-400 !text-green-400 hover:!bg-green-50"
              @click="addFilter"
            >
              {{ $fcTr('add_filter') }}
              <svg class="icon h-4 w-4" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-width="2" d="M5 12h14m-7-7v14"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div class="flex flex-col p-2 mt-2">
        <div class="flex items-center">
          <h3
            class="font-heading text-base font-semibold leading-tight text-muted-800 dark:text-white"
          >
            {{ $fcTr('active_filter') }}
          </h3>
          <button
            @click="clearFilters"
            class="is-button group hover:text-red-500 hover:border-red-500 w-fit text-muted-500 !text-xs border !px-3 !py-0 !h-[1.5rem] mx-2 !rounded-full"
          >
            <span class="group-hover:text-red-500">
              {{ $fcTr('clear_all') }}
            </span>
            <svg
              stroke="currentColor"
              width="1em"
              height="1em"
              class="ml-1 rtl:ml-1 rtl:mr-1 group-hover:fill-red-500"
              viewBox="0 0 512 512"
            >
              <path
                d="M340 148L488 0l24 24L364 172l52 52L257.2 483.9 240 512l-23.3-23.3L23.3 295.3 0 272l28.1-17.2L288 96l52 52zM51.4 278.1l47.9 47.9 33.4-33.4L144 281.4 166.6 304l-11.3 11.3-33.4 33.4L233.9 460.6l89.6-146.6L197.9 188.6 51.4 278.1zM340.6 286l34.9-57.2-92.4-92.4L226 171.4 340.6 286z"
              />
            </svg>
          </button>
        </div>
        <div class="my-2 flex">
          <template v-for="(filter, key, index) in filters" :key="index">
            <div class="flex">
              <span
                class="flex px-3 font-sans transition-shadow duration-300 py-1 text-[0.75rem] rounded-full bg-primary-100 text-primary-500 border-primary-100 dark:border-primary-500 dark:text-primary-500 border dark:bg-transparent"
              >
                <span class="mb-[2px]"> {{ key }} </span>
                <button class="text-white font-bold rounded px-1">
                  <svg aria-hidden="true" viewBox="0 0 24 24" class="h-4 w-4 text-primary-500">
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M18 6 6 18M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </span>
            </div>
            <span class="flex items-center mx-2 text-[0.75rem]">{{ $fcTr('&') }}</span>
          </template>
        </div>
      </div>

      <div class="flex w-full gap-x-2 justify-between !items-end">
        <button
          @click="choose('filters')"
          class="is-button text-muted-500 rounded hover:text-red-500 !underline focus-within:!outline-none"
        >
          {{ $fcTr('cancel') }}
        </button>
        <div class="pt-4 md:pt-6">
          <div class="flex gap-x-2">
            <button @click="saveFilter" class="is-button rounded is-button-default">
              {{ $fcTr('save') }}
            </button>
            <button
              @click="makeFilters"
              class="is-button rounded bg-primary-500 dark:bg-primary-500 hover:enabled:bg-primary-400 dark:hover:enabled:bg-primary-400 text-white hover:enabled:shadow-lg hover:enabled:shadow-primary-500/50 dark:hover:enabled:shadow-primary-800/20 focus-visible:outline-primary-400/70 focus-within:outline-primary-400/70 focus-visible:bg-primary-500 active:enabled:bg-primary-500 dark:focus-visible:outline-primary-400 dark:focus-within:outline-primary-400 dark:focus-visible:bg-primary-500 dark:active:enabled:bg-primary-500"
            >
              {{ $fcTr('filter') }}
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="selectedFilter"
        class="flex-auto bg-[#f9fafb] border border-[rgba(34,36,38,.1)] rounded p-2 flex align-center mt-2"
      >
        <component
          v-model="filters[selectedFilter.field]"
          :is="getComponent(selectedFilter)"
          :field="selectedFilter"
        />
      </div>

      <div
        v-else-if="chooseFilter"
        class="flex-auto bg-[#f9fafb] border border-[rgba(34,36,38,.1)] rounded p-2 flex align-center mt-2"
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
    </div>
  </transition>
</template>

<script setup>
import { get as getSafe, capitalize } from 'lodash'
import { inject, ref, markRaw } from 'vue'
import { useStorage } from '@vueuse/core'
import TextField from '@/components/fields/TextField.vue'
import SelectField from '@/components/fields/SelectField.vue'

const chooseFilter = ref(false)

const store = inject('store')
const filters = store.filters
const localFilters = getLocalFilters()

const selectedFilter = ref(false)

import MForm from 'formue'
const form = ref({})
const formData = ref({})

const fields = ref([
  {
    title: 'field',
    field: 'field',
    filter: 'select',
    isHeader: true,
    groupAttr: { class: 'w-[32.5%]' },
    // parentAttr: { class: 'change-input-forst' },
    items: store.headersWithoutActions,
    props: {
      textKey: 'title',
      valueKey: 'field'
    },
    component: markRaw(SelectField)
  }
])

// const selectFilter = (filter) => {
//   if (selectedFilter.value.field === filter.field) {
//     selectedFilter.value = false
//   } else {
//     selectedFilter.value = filter
//   }
// }

// function registering() {
//   const components = {}

//   const registerComponent = async (filePath, comp) => {
//     const componentName = filePath
//       .split('/')
//       .pop()
//       .replace(/\.\w+$/, '')

//     components[componentName] = comp.default
//   }

//   const componentsEntry = import.meta.globEager('./filters/*.vue')

//   for (const filePath in componentsEntry) {
//     registerComponent(filePath, componentsEntry[filePath])
//   }

//   return components
// }

// const components = registering()

// function getComponent() {
//   let component

//   const filter = capitalize(selectedFilter.value.filter)

//   if (typeof selectedFilter.value.filter == 'string')
//     component = getSafe(components, filter + 'Filter')
//   else component = filter

//   return component
// }

// function clearFilters() {
//   store.isFiltering = false
//   for (const key in filters) {
//     filters[key] = {}
//   }
//   store.reloadData()
// }

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
  delete localFilters.value[filterName]
}

function addFilter() {
  filters.push(form)
  Object.assign(form, {})
}

function choose(panel) {
  if (panel === store.panel) store.panel = ''
  else store.panel = panel
}
</script>

<style scoped>
.scale-enter-active,
.scale-leave-active {
  transition: transform 0.3s cubic-bezier(0.5, 0, 0.5, 1), opacity 0.3s linear;
}
.scale-enter-from,
.scale-enter,
.scale-leave-to {
  opacity: 0;
  transform: translate(0px, -50%) scale(0.001);
  /* transform: scale(0.5);
  transform: translate(0px, -100%); */
}
</style>
