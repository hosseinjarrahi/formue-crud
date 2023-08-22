<template>
  <div ref="table" class="mt-2"></div>
</template>

<script setup>
import { onMounted, inject, ref } from 'vue'
import { initTable } from '@/helpers/tabulator'
import { adaptor } from '@/helpers/tabulatorAdaptor'

const table = ref(null)

const store = inject('store')

adaptor(store)

onMounted(() => {
  initTable({
    element: table.value,
    headers: store.headers,
    data: store.mainItems
  })
})
</script>

<style>
@import 'https://unpkg.com/tabulator-tables@4.9.3/dist/css/semantic-ui/tabulator_semantic-ui.min.css';
</style>
