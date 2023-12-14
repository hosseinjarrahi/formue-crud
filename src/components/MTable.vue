<template>
  <div ref="table" class="mt-2"></div>
  <div v-if="store.loadings.mainLoading" class="mt-[-20px]">
    <template v-for="n in 10" :key="n">
      <div
        :class="{
          'border-t-0': n === 1,
          'border-b-0': n === 10,
          'bg-muted-50 dark:bg-muted-700': n % 2 !== 0,
          'bg-white dark:bg-muted-800': n % 2 === 0
        }"
        class="w-full py-4 mx-auto border-b-1"
      >
        <div class="flex animate-pulse flex-row items-center h-full justify-center">
          <div class="w-full flex flex-row items-start rtl:mr-8 ltr:ml-8">
            <div
              v-for="i in 9"
              :key="i"
              class="mx-1 w-[10%] bg-muted-300 dark:bg-muted-900 h-2.5 rounded-md"
            ></div>
          </div>
        </div>
      </div>
    </template>
  </div>
  <div
    class="padding: 100px; mt-[-20px] rounded-b-xl bg-white text-center p-[100px] dark:bg-muted-800"
    v-if="hasNoItems"
  >
    <h2 class="dark:text-muted-200 text-muted-600">{{ $fcTr('not_load_or_existing_data') }}</h2>
  </div>
  <MTablePagination />
</template>

<script setup>
import { onMounted, inject, ref, computed } from 'vue'
import { initTable } from '@/helpers/tabulator'
import { adaptor } from '@/helpers/tabulatorAdaptor'
import MTablePagination from './MTablePagination.vue'

const table = ref(null)

const store = inject('store')
const dir = inject('dir')

const hasNoItems = computed(() => {
  return store.mainItems.length === 0 && !store.loadings.mainLoading
})

adaptor(store)

onMounted(() => {
  initTable({
    options: {
      textDirection: dir
    },
    element: table.value,
    headers: store.headers,
    data: store.mainItems
  })
})
</script>