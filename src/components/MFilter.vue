<template>
  <div :class="store.panel === 'filters' ? 'accordion-content' : 'x'">
    <div
      class="border-muted-200 dark:border-muted-700 dark:bg-muted-800 relative mb-4 w-full rounded-md border bg-white p-6 transition-all duration-300"
    >
      <div class="flex flex-col ml-1 border-b border-[rgba(0,0,0,.1)] pb-4">
        <div class="flex flex-row justify-between mb-4 items-center">
          <h3
            class="font-heading text-base font-semibold leading-tight text-muted-800 dark:text-white"
          >
            {{ $fcTr('filter_data') }}
          </h3>
          <div class="flex items-center">
            <button
              class="transitionX-inp is-button rounded is-button-default"
              :class="{ '!pr-0': showChooseFilter }"
              @click="showChooseFilter = !showChooseFilter"
            >
              <span v-if="showChooseFilter">
                {{ $fcTr('close_filter') }}
              </span>
              <span v-else>
                {{ $fcTr('choose_filter') }}
              </span>
              <div
                class="transitionX-inp"
                :class="showChooseFilter ? 'opacity-1  w-auto ml-3 flex' : 'hidden opacity-0 w-[0px]'"
              >
                <span
                  v-for="(filter, key) in localFilters"
                  :key="key"
                  class="border-l border-1 px-2 py-2 transition ease-in-out hover:bg-blue-100"
                  @click.stop="store.filters = Object.values(filter)"
                >
                  {{ key }}
                </span>
              </div>
            </button>
          </div>
        </div>
        <div class="flex w-full justify-between">
          <MForm class="w-[75%] justify-between" :fields="fields" v-model="form" />
          <div class="w-[23%] flex justify-center items-center">
            <button
              v-if="!isEditing"
              class="!border-dashed !h-[86%] is-button-default is-button w-full rounded-full font-bold py-1 px-2 !border-green-400 !text-green-400 hover:!bg-green-50"
              @click="addFilter"
            >
              {{ $fcTr('add_filter') }}
              <svg class="icon h-4 w-4" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-width="2" d="M5 12h14m-7-7v14"></path>
              </svg>
            </button>
            <button
              v-else
              class="!border-dashed is-button-default is-button w-full rounded-full font-bold py-1 px-2 !border-green-400 !text-green-400 hover:!bg-green-50"
              @click="editFilter"
            >
              {{ $fcTr('edit_filter') }}
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
          <template v-for="(filter, index) in store.filters" :key="index">
            <div class="flex">
              <span
                class="flex px-3 font-sans transition-shadow duration-300 py-1 text-[0.75rem] rounded-full bg-primary-100 text-primary-500 border-primary-100 dark:border-primary-500 dark:text-primary-500 border dark:bg-transparent"
                @click="fillForm(filter, index)"
              >
                <span class="mb-[2px]"> {{ getSafe(filter, 'field.title') }} </span>
                <button
                  class="text-white font-bold rounded px-1"
                  @click.stop="removeFilter(filter)"
                >
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

            <span
              v-if="store.filters.length - 1 !== index"
              class="flex items-center mx-2 text-[0.75rem]"
              >{{ $fcTr('&') }}</span
            >
          </template>
        </div>
      </div>

      <div class="flex w-full gap-x-2 justify-between !items-end">
        <button
          @click="store.panel = ''"
          class="is-button text-muted-500 rounded hover:text-red-500 !underline focus-within:!outline-none"
        >
          {{ $fcTr('cancel') }}
        </button>
        <div class="pt-4 md:pt-6">
          <div class="flex gap-x-2">
            <button
              @click.self="saveFilter"
              :class="showSaveFilter ? '!bg-muted-100 ltr:pr-1' : ''"
              class="transitionX-inp is-button rounded is-button-default"
            >
              <span
                @click.self="saveFilter"
                :class="showSaveFilter ? ' bg-green-500 px-2 py-1 rounded text-muted-50' : ''"
              >
                {{ $fcTr('save') }}
              </span>
              <span
                class="transitionX-inp overflow-hidden flex items-center"
                :class="showSaveFilter ? 'w-[221px] opacity-1 pl-3' : 'opacity-0 w-[0px]'"
              >
                <input
                  v-model="filterName"
                  class="fc-focus py-1 rounded px-2"
                  :class="showSaveFilter ? ' border border-1' : 'flex  '"
                  :placeholder="$fcTr('filter_save_placeholder')"
                  ref="filterNameInp"
                />
                <span class="px-2" @click="showSaveFilter = false">
                  <svg
                    data-v-74b3417a=""
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    class="h-4 w-4 text-primary-500"
                  >
                    <path
                      data-v-74b3417a=""
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M18 6 6 18M6 6l12 12"
                    ></path>
                  </svg>
                </span>
              </span>
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
    </div>
  </div>
</template>

<script setup>
import MForm from 'formue'
import { get as getSafe, capitalize } from 'lodash'
import { inject, ref, markRaw, watch, nextTick } from 'vue'
import SelectField from '@/components/fields/SelectField.vue'
import filterComps from './filters/index.js'
import { useStorage } from '@vueuse/core'

const store = inject('store')

let indexToEdit = -1
const isEditing = ref(false)
const form = ref({})
const showSaveFilter = ref(false)
const filterName = ref('')
const localFilters = getLocalFilters()
const filterNameInp = ref(null)
const showChooseFilter = ref(false)

function getFilterFields(name) {
  let component

  const filter = capitalize(name)

  const fn = getSafe(filterComps, filter + 'Filter')

  const field = store.flatFields.find((field) => field.filter === name)

  if (typeof fn === 'function') return getSafe(filterComps, filter + 'Filter')(field)

  return false

  // if (typeof selectedFilter.value.filter == 'string')
  //   component = getSafe(components, filter + 'Filter')
  // else component = filter

  // return component
}

const fields = ref([
  {
    title: 'field',
    field: 'field',
    isHeader: true,
    groupAttr: { class: 'w-[32.5%]' },
    // parentAttr: { class: 'change-input-forst' },
    rel: {
      get: store.headersWithoutActions,
      textKey: 'title',
      valueKey: 'filter'
    },
    props: {
      'return-object': true
    },
    component: markRaw(SelectField)
  }
])

watch(
  () => form.value.field,
  (filter) => {
    fields.value.length = 1
    const filterFields = getFilterFields(getSafe(filter, 'filter')) || []
    for (const key in form.value) {
      if (key !== 'field') form.value[key] = ''
    }
    nextTick(() => {
      for (const field of filterFields) fields.value.push(field)
    })
  }
)

function getLocalFilters() {
  const storeName = window.location.pathname.replace(/^\/|\/$/g, '') + '-filters'

  return useStorage(storeName, {}, localStorage, { mergeDefaults: true })
}

function addFilter() {
  store.filters.push(form.value)
  form.value = {}
}

function editFilter() {
  if (indexToEdit !== -1) {
    store.filters.splice(indexToEdit, 1, form.value)
  }
  isEditing.value = false
  form.value = {}
}

function fillForm(filter, index) {
  form.value.field = filter.field
  isEditing.value = true
  indexToEdit = index
  nextTick(() => {
    form.value = { ...filter }
  })
}

function removeFilter(filter) {
  store.filters = store.filters.filter((f) => f !== filter)
}

function clearFilters() {
  store.filters = []
}

function saveFilter() {
  if (!showSaveFilter.value) {
    showSaveFilter.value = true
    return filterNameInp.value.focus()
  }
  if (!filterName.value) return

  localFilters.value[filterName.value] = { ...store.filters }

  showSaveFilter.value = false
  filterName.value = ''
  filterNameInp.value.blur()
}

function makeFilters() {
  store.isFiltering = true
  store.getWithFilter()
}
</script>

<style scoped>
.accordion-content {
  max-height: 600px;
  overflow: hidden;

  transition: max-height 1s;
}
.x {
  max-height: 0;
  overflow: hidden;
  transition: max-height 1s;
}

.transitionX-inp {
  transition: all 1s ease-in-out;
}
</style>
