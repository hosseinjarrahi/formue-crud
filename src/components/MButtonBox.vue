<template>
  <!-- button top of table -->
  <div class="fc-header">
    <!-- left sid  -->
    <div class="fc-header-left-sid">
      <!-- add boutton -->
      <button
        v-if="can('create')"
        class="fc-plus-btn"
        data-tooltip="افزودن"
        @click="event('createBtn')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-plus"
        >
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
      </button>
      <!-- export menu (excel, pdf, print) -->
      <MMenu>
        <template v-slot:activator="{ on, props }">
          <button
            :class="!props.isOpen ? 'before:hidden' : 'before:block'"
            v-bind="props"
            v-on="on"
            class="fc-header-icon-btn fc-drop-down-btn min-w-[130px]"
          >
            <span class="z-[1]">{{ $fcTr('export') }}</span>
          </button>
        </template>
        <div class="bg-muted-200 dark:bg-muted-800 cursor-pointer rounded-xl fm-light-shadow">
          <!-- <a
            class="group flex w-full items-center py-3 text-sm duration-300 text-muted-500 hover:bg-muted-300 dark:hover:bg-muted-700 rounded-xl justify-end flex-row-reverse"
          >
            <p class="text-muted-400 font-sans text-xs">{{ $fcTr('export_as_pdf') }}</p>
            <svg class="fill-muted-400 w-3.5 mx-2" viewBox="0 0 512 512">
              <path
                d="M64 464H96v48H64c-35.3 0-64-28.7-64-64V64C0 28.7 28.7 0 64 0H229.5c17 0 33.3 6.7 45.3 18.7l90.5 90.5c12 12 18.7 28.3 18.7 45.3V288H336V160H256c-17.7 0-32-14.3-32-32V48H64c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16zM176 352h32c30.9 0 56 25.1 56 56s-25.1 56-56 56H192v32c0 8.8-7.2 16-16 16s-16-7.2-16-16V448 368c0-8.8 7.2-16 16-16zm32 80c13.3 0 24-10.7 24-24s-10.7-24-24-24H192v48h16zm96-80h32c26.5 0 48 21.5 48 48v64c0 26.5-21.5 48-48 48H304c-8.8 0-16-7.2-16-16V368c0-8.8 7.2-16 16-16zm32 128c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H320v96h16zm80-112c0-8.8 7.2-16 16-16h48c8.8 0 16 7.2 16 16s-7.2 16-16 16H448v32h32c8.8 0 16 7.2 16 16s-7.2 16-16 16H448v48c0 8.8-7.2 16-16 16s-16-7.2-16-16V432 368z"
              />
            </svg>
          </a> -->
          <a
            class="group flex w-full items-center py-3 text-sm duration-300 text-muted-500 hover:bg-muted-300 dark:hover:bg-muted-700 rounded-xl justify-end flex-row-reverse"
            @click="exportAsExcel"
          >
            <p class="text-muted-400 font-sans text-xs">{{ $fcTr('export_as_excel') }}</p>
            <svg class="fill-muted-400 w-3.5 mx-2" viewBox="0 0 512 512">
              <path
                d="M48 448V64c0-8.8 7.2-16 16-16H224v80c0 17.7 14.3 32 32 32h80V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16zM64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V154.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0H64zm90.9 233.3c-8.1-10.5-23.2-12.3-33.7-4.2s-12.3 23.2-4.2 33.7L161.6 320l-44.5 57.3c-8.1 10.5-6.3 25.5 4.2 33.7s25.5 6.3 33.7-4.2L192 359.1l37.1 47.6c8.1 10.5 23.2 12.3 33.7 4.2s12.3-23.2 4.2-33.7L222.4 320l44.5-57.3c8.1-10.5 6.3-25.5-4.2-33.7s-25.5-6.3-33.7 4.2L192 280.9l-37.1-47.6z"
              />
            </svg>
          </a>
          <!-- <a
            class="group flex w-full items-center py-3 text-sm duration-300 text-muted-500 hover:bg-muted-300 dark:hover:bg-muted-700 rounded-xl justify-end flex-row-reverse"
          >
            <p class="text-muted-400 font-sans text-xs">{{ $fcTr('print') }}</p>
            <svg class="fill-muted-400 w-3.5 mx-2" viewBox="0 0 512 512">
              <path
                d="M112 160V64c0-8.8 7.2-16 16-16H357.5c4.2 0 8.3 1.7 11.3 4.7l26.5 26.5c3 3 4.7 7.1 4.7 11.3V160h48V90.5c0-17-6.7-33.3-18.7-45.3L402.7 18.7C390.7 6.7 374.5 0 357.5 0H128C92.7 0 64 28.7 64 64v96h48zm16 208H384v96H128V368zm-16-48c-17.7 0-32 14.3-32 32H48V256c0-8.8 7.2-16 16-16H448c8.8 0 16 7.2 16 16v96H432c0-17.7-14.3-32-32-32H112zm320 80h48c17.7 0 32-14.3 32-32V256c0-35.3-28.7-64-64-64H64c-35.3 0-64 28.7-64 64V368c0 17.7 14.3 32 32 32H80v80c0 17.7 14.3 32 32 32H400c17.7 0 32-14.3 32-32V400z"
              />
            </svg>
          </a> -->
        </div>
      </MMenu>

      <!-- reload data of table button -->
      <button class="fc-header-icon-btn" data-tooltip="رفرش" @click="store.reloadData">
        <svg :class="{ spin: store.loadings.mainLoading }" viewBox="0 0 512 512">
          <path
            d="M371.2 122.9C340.3 96.2 300 80 256 80C158.8 80 80 158.8 80 256s78.8 176 176 176c39.7 0 76.2-13.1 105.6-35.2c10.6-8 25.6-5.8 33.6 4.8s5.8 25.6-4.8 33.6C353 463.3 306.4 480 256 480C132.3 480 32 379.7 32 256S132.3 32 256 32c57.3 0 109.6 21.5 149.2 56.9l30.5-30.5c6.6-6.6 15.6-10.3 25-10.3C480.2 48 496 63.8 496 83.3V200c0 13.3-10.7 24-24 24H355.3c-19.5 0-35.3-15.8-35.3-35.3c0-9.4 3.7-18.3 10.3-25l40.8-40.8zm76.8-9L385.9 176H448V113.9z"
          />
        </svg>
      </button>

      <!-- button for select rows -->
      <button
        class="fc-header-icon-btn"
        :class="{ 'fm-active-btn': isSelectActive }"
        data-tooltip="انتخاب گروهی"
        @click="toggleSelect"
      >
        <svg viewBox="0 0 512 512">
          <path
            d="M384 48c8.8 0 16 7.2 16 16V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16H384zM64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64zM80 112v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V112c0-8.8-7.2-16-16-16H96c-8.8 0-16 7.2-16 16zM96 352c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V368c0-8.8-7.2-16-16-16H96zm80-224c0 13.3 10.7 24 24 24H344c13.3 0 24-10.7 24-24s-10.7-24-24-24H200c-13.3 0-24 10.7-24 24zm32 128c0 13.3 10.7 24 24 24H344c13.3 0 24-10.7 24-24s-10.7-24-24-24H232c-13.3 0-24 10.7-24 24zM176 384c0 13.3 10.7 24 24 24H344c13.3 0 24-10.7 24-24s-10.7-24-24-24H200c-13.3 0-24 10.7-24 24zm-4.7-140.7c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0L112 257.4 99.3 244.7c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6l24 24c6.2 6.2 16.4 6.2 22.6 0l48-48z"
          />
        </svg>
      </button>
      <!-- button and menu for custom column -->
      <MMenu :close-on-content-click="true">
        <template v-slot:activator="{ props, on }">
          <button
            v-on="on"
            class="fc-header-icon-btn"
            data-tooltip="انتخاب سرستون"
            :class="[
              props.isOpen ? 'light:!bg-white dark:bg-muted-800' : '',
              props.isOpen ? (dir === 'rtl' ? 'expanded-rtl' : 'expanded2') : ''
            ]"
          >
            <svg viewBox="0 0 448 512" class="z-[1]">
              <path
                d="M64 448c-17.7 0-32-14.3-32-32V96c0-17.7 14.3-32 32-32H384c17.7 0 32 14.3 32 32V416c0 17.7-14.3 32-32 32H64zM0 416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64C28.7 32 0 60.7 0 96V416zM128 288c8.8 0 16-7.2 16-16V144c0-8.8-7.2-16-16-16s-16 7.2-16 16V272c0 8.8 7.2 16 16 16zm176 48c0 8.8 7.2 16 16 16s16-7.2 16-16V144c0-8.8-7.2-16-16-16s-16 7.2-16 16V336zm-80-80c8.8 0 16-7.2 16-16V144c0-8.8-7.2-16-16-16s-16 7.2-16 16v96c0 8.8 7.2 16 16 16z"
              />
            </svg>
          </button>
        </template>
        <div
          class="bg-white dark:bg-muted-800 rounded-xl pt-1 rtl:text-right ltr:text-left fm-light-shadow"
        >
          <div class="m-3 mt-2 text-muted-600 dark:text-muted-200">
            {{ $fcTr('custom_column') }}
          </div>

          <ul class="p-2">
            <template v-for="field in store.flatFieldsWithoutActions" :key="field.field">
              <SelectColumnItem
                v-if="field.title"
                :column-name="field.title"
                :checked="field.isHeader"
                @toggle="field.isHeader = !field.isHeader"
              />
            </template>
          </ul>
        </div>
      </MMenu>
    </div>
    <div
      v-if="can('filter')"
      data-tooltip="فیلتر"
      class="fm-header-rigth-sid flex w-full sm:w-auto rtl:flex-row-reverse rtl:justify-end"
    >
      <button
        class="test fc-header-icon-btn transform transition-all"
        :class="store.panel === 'filters' ? '!bg-white dark:!bg-muted-800 !rounded-b-none ' : ''"
        @click="choose('filters')"
      >
        <transition name="scale">
          <div v-if="store.panel === 'filters'">
            <span></span>
          </div>
        </transition>
        <svg
          :class="store.panel === 'filters' ? 'light:!fill-primary-700' : ''"
          stroke="currentColor"
          viewBox="0 0 512 512"
        >
          <path
            d="M0 73.7C0 50.7 18.7 32 41.7 32H470.3c23 0 41.7 18.7 41.7 41.7c0 9.6-3.3 18.9-9.4 26.3L336 304.5V447.7c0 17.8-14.5 32.3-32.3 32.3c-7.3 0-14.4-2.5-20.1-7l-92.5-73.4c-9.6-7.6-15.1-19.1-15.1-31.3V304.5L9.4 100C3.3 92.6 0 83.3 0 73.7zM55 80L218.6 280.8c3.5 4.3 5.4 9.6 5.4 15.2v68.4l64 50.8V296c0-5.5 1.9-10.9 5.4-15.2L457 80H55z"
          />
        </svg>
      </button>
      <!-- search input -->
      <div class="group/nui-input relative rtl:">
        <input
          v-model="store.searchParam"
          type="text"
          class="nui-focus px-4! border-muted-300 text-muted-600 placeholder:text-muted-300 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-500 dark:focus:border-muted-700 peer w-full border bg-white font-sans transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-75 h-10 py-2 text-sm leading-5 pe-4 ps-9 rounded-full"
          :placeholder="$fcTr('search')"
          @keyup="searchWithDebounce"
        />
        <div
          class="ltr:left-0 text-muted-400 group-focus-within/nui-input:text-primary-500 absolute end-0 rtl:start-0 top-0 flex items-center justify-center transition-colors duration-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-75 h-10 w-10"
        >
          <svg
            v-if="!searchLoading"
            class="icon h-[1.15rem] w-[1.15rem]"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
          >
            <g
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21l-4.35-4.35"></path>
            </g>
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 512 512"
            class="icon animate-spin"
          >
            <path
              d="M457 372c11.5 6.6 26.3 2.7 31.8-9.3C503.7 330.2 512 294.1 512 256C512 122.7 410.1 13.2 280 1.1C266.8-.1 256 10.7 256 24v0c0 13.3 10.8 23.9 24 25.4C383.5 61.2 464 149.2 464 256c0 29.3-6.1 57.3-17 82.6c-5.3 12.2-1.5 26.8 10 33.5v0z"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { emitter } from 'formue'
import { debounce } from 'lodash'
import MMenu from '@/components/MMenu.vue'
import { inject, ref, onMounted, computed } from 'vue'
import { usePermission } from '@/composables/usePermission'
import SelectColumnItem from '@/components/SelectColumnItem.vue'

const { can } = usePermission()

const { event } = emitter

const store = inject('store')

function choose(panel) {
  if (panel === store.panel) store.panel = ''
  else store.panel = panel
}

const dir = ref(null)
onMounted(() => {
  dir.value = document.body.getAttribute('dir')
})

const selectField = computed(() => {
  return store.flatFields.find((item) => item.field === '_select_')
})

const isSelectActive = computed(() => {
  return !!selectField.value.isHeader
})

function toggleSelect() {
  selectField.value.isHeader = !selectField.value.isHeader
  if (!selectField.value.isHeader) {
    store.selected.clear()
  }
}

const searchLoading = ref(false)
function search() {
  searchLoading.value = true
  store.loadItems().finally(() => (searchLoading.value = false))
}

const searchWithDebounce = debounce(search, 600)

function exportAsExcel() {
  window.open(axios.defaults.baseURL + store.generateQuery())
}
</script>

<style scoped>
/* style for reload data  */
.spin {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

/* style for filter palne  */
.scale-enter-active,
.scale-leave-active {
  transition: transform 0.3s cubic-bezier(0.5, 0, 0.5, 1), opacity 0.3s linear;
}

.scale-enter-from,
.scale-enter,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.5);
}

/*  */
body
  > div.v-overlay-container
  > div.v-overlay.v-overlay--absolute.v-overlay--active.v-theme--light.v-locale--is-ltr.v-menu {
  z-index: 2030 !important;
}
</style>
