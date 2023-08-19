<template>
  <div ref="table"></div>
</template>

<script setup>
import { onMounted, defineProps, ref } from 'vue'
import { useTabulator } from './../composables/useTabulator'
const { initTable } = useTabulator()

const table = ref(null)

const props = defineProps({
  store: {}
})
onMounted(() => {
  initTable({
    store: props.store,
    element: table.value,
    headers: props.store.headers,
    data: props.store.mainItems
  })
})
</script>

<style>
@import 'https://unpkg.com/tabulator-tables@4.9.3/dist/css/semantic-ui/tabulator_semantic-ui.min.css';
</style>
