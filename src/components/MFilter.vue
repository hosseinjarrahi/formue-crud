<template>
  <div
    v-show="store.panel === 'filters'"
    class="accordion-content"
    :class="{ hide: store.panel !== 'filters' }"
  >
    <div
      class="border-muted-200 dark:border-muted-700 dark:bg-muted-800 relative mb-4 w-full rounded-lg border bg-white p-6 transition-all duration-300"
    >
      <div class="flex flex-col ml-1 border-[rgba(0,0,0,.1)] pb-4">
        <div class="flex flex-row justify-between mb-4 items-center">
          <h3
            class="font-heading text-base font-semibold leading-tight text-muted-800 dark:text-white"
          >
            {{ $fcTr('filter_data') }}
          </h3>
          <div class="flex items-center">
            <v-menu transition="scale-transition">
              <template v-slot:activator="{ props }">
                <button
                  :class="!JSON.parse(props['aria-expanded']) ? 'before:hidden' : 'before:block'"
                  v-bind="props"
                  class="fc-filter-choose is-button rounded is-button-default min-w-[130px]"
                >
                  <span class="z-[1]"> {{ $fcTr('choose_filter') }}</span>
                </button>
              </template>
              <div class="fc-drop-down-content">
                <p class="p-2 text-center" v-if="Object.keys(localFilters).length === 0">
                  {{ $fcTr('not_filter_create_yes') }}
                </p>
                <a
                  class="group rounded flex w-full items-center py-3 text-sm duration-300 text-muted-500 hover:bg-muted-100 dark:hover:bg-muted-700 justify-between rtl:pl-4 rtl:pr-5"
                  v-for="(filter, key) in localFilters"
                  :key="key"
                  @click.stop="store.filters = Object.values(filter)"
                >
                  <p class="text-muted-400 font-sans text-sm">{{ key }}</p>
                  <svg
                    data-v-74b3417a=""
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    class="h-4 w-4 text-muted-500"
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
                </a>
              </div>
            </v-menu>
          </div>
        </div>
        <div class="flex w-full justify-between align-start">
          <Vueform
            v-model="form"
            :schema="fields"
            :sync="true"
            class="w-[100%] justify-between ml-4"
            :columns="{ label: 12 }"
          />

          <div class="w-[12%] flex justify-center items-center">
            <button
              :disabled="!form.field"
              v-if="!isEditing"
              class="disabled:cursor-not-allowed disabled:hover:bg-transparent !border-dashed !h-[86%] is-button-default is-button w-full rounded font-bold py-1 px-2 !border-green-400 !text-green-400 dark:active:hover:bg-muted-600 active:hover:!bg-green-50"
              @click="addFilter"
            >
              <svg class="icon h-4 ml-1 w-4" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-width="2" d="M5 12h14m-7-7v14"></path>
              </svg>
              {{ $fcTr('add_filter') }}
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
      <!-- :class="store.filters.length > 0 ? 'accordion-content' : 'show-active-filter'" -->
      <div
        class="flex border-t dark:border-muted-600 flex-col p-2 mt-2"
        v-show="store.filters.length > 0"
      >
        <div class="flex items-center">
          <h3
            class="font-heading text-base font-semibold leading-tight text-muted-800 dark:text-white"
          >
            {{ $fcTr('active_filter') }}
          </h3>
          <button
            @click="clearFilters"
            class="is-button group hover:text-red-500 hover:border-red-500 w-fit text-muted-600 dark:text-muted-400 !text-xs border !px-3 !py-0 !h-[1.5rem] mx-2 !rounded-full"
          >
            <span class="group-hover:text-red-500">
              {{ $fcTr('clear_all') }}
            </span>
            <svg
              stroke="currentColor"
              width="1em"
              height="1em"
              class="ml-1 rtl:ml-1 rtl:mr-1 group-hover:fill-red-500 dark:fill-muted-400 fill-muted-600"
              viewBox="0 0 512 512"
            >
              <path
                d="M340 148L488 0l24 24L364 172l52 52L257.2 483.9 240 512l-23.3-23.3L23.3 295.3 0 272l28.1-17.2L288 96l52 52zM51.4 278.1l47.9 47.9 33.4-33.4L144 281.4 166.6 304l-11.3 11.3-33.4 33.4L233.9 460.6l89.6-146.6L197.9 188.6 51.4 278.1zM340.6 286l34.9-57.2-92.4-92.4L226 171.4 340.6 286z"
              />
            </svg>
          </button>
        </div>
        <div class="my-2 flex overflow-x-auto slimscroll">
          <template v-for="(filter, index) in store.filters" :key="index">
            <div class="flex">
              <span
                class="flex px-3 font-sans transition-shadow duration-300 py-1 text-[0.75rem] cursor-pointer rounded-full bg-primary-100 text-primary-500 border-primary-100 dark:border-primary-500 dark:text-primary-500 border dark:bg-transparent"
                @click="fillForm(filter, index)"
              >
                <span class="mt-[0px]"> {{ getSafe(filter, 'field.title') }} </span>
                <button
                  class="text-white font-bold rounded px-1 hover:bg-primary-500 hover:text-black-500"
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
              @click.self="Object.keys(store.filters).length !== 0 ? saveFilter() : ''"
              :class="{
                '!bg-muted-100 dark:!bg-muted-700 ltr:pr-1': showSaveFilter,
                '  focus:outline-none !cursor-not-allowed': Object.keys(store.filters).length === 0
              }"
              class="transitionX-inp is-button rounded is-button-default"
            >
              <span
                @click.self="Object.keys(store.filters).length !== 0 ? saveFilter() : ''"
                :class="{
                  ' bg-green-500 px-2 py-1 rounded text-muted-50': showSaveFilter,
                  '  focus:outline-none !cursor-not-allowed':
                    Object.keys(store.filters).length === 0
                }"
              >
                {{ $fcTr('save') }}
              </span>
              <span
                class="transitionX-inp overflow-hidden flex items-center justify-between"
                :class="
                  showSaveFilter ? 'w-[221px] opacity-1 ltr:pl-3 rtl:mr-3' : 'opacity-0 w-[0px]'
                "
              >
                <input
                  v-model="filterName"
                  class="fc-focus py-1 rounded px-2 dark:bg-muted-800"
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
import { get as getSafe, cloneDeep } from 'lodash'
import { inject, ref, nextTick } from 'vue'
import filterComps from './filters/index.js'
import { useStorage } from '@vueuse/core'
// import { VMenu } from 'vuetify/components/VMenu'

const store = inject('store')

let indexToEdit = -1
const isEditing = ref(false)
const form = ref({ field: '' })
const showSaveFilter = ref(false)
const filterName = ref('')
const localFilters = getLocalFilters()
const filterNameInp = ref(null)

function getFilterFields(schema) {
  if (!schema) return false

  const map = {
    text: 'TextFilter',
    date: 'DateFilter',
    select: 'SelectFilter'
  }

  const filter = getSafe(map, schema.type)

  const fn = getSafe(filterComps, filter)

  if (typeof fn === 'function') return fn(schema)

  return false
}

const initialField = {
  field: {
    placeholder: 'field',
    type: 'select',
    native: false,
    items: store.headersWithoutActions,
    'label-prop': 'title',
    'value-prop': 'field',
    object: true,
    search: true,
    trackBy: ['title'],
    columns: 2,
    onChange(schema, _, $) {
      const filterFields = getFilterFields(schema) || []
      for (const key in form.value) {
        if (key !== 'field') delete form.value[key]
      }
      fields.value = { ...initialField, ...filterFields }
      nextTick(() => {
        const items = $.form$.el$('value')
        'clear' in items && items.clear()
        'updateItems' in items && items.updateItems()
      })
    }
  }
}

const fields = ref({
  ...initialField
})

function getLocalFilters() {
  const storeName = window.location.pathname.replace(/^\/|\/$/g, '') + '-filters'

  return useStorage(storeName, {}, localStorage, { mergeDefaults: true })
}

function addFilter() {
  store.filters.push(cloneDeep(form.value))
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
  isEditing.value = true
  indexToEdit = index
  form.value = filter
  nextTick(() => {
    form.value.op = filter.op
    form.value.value = filter.value
  })
}

function removeFilter(filter) {
  store.filters = store.filters.filter((f) => f !== filter)
}

function clearFilters() {
  store.filters = []
  store.loadItems()
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
  store.loadItems()
}
</script>

<style scoped>
.accordion-content {
  max-height: 600px;
  transition: max-height 1s;
}
.accordion-content.hide {
  max-height: 0;
  transition: max-height 1s;
}
.show-active-filter {
  max-height: 0;
  padding: 0;
  border-top: 0;
  overflow: hidden;
  transition: max-height 1s;
}
.transitionX-inp {
  transition: all 1s ease-in-out;
}
</style>
