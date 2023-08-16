<template>
  <button
    class="mx-2 inline-flex items-center justify-center w-5 h-5 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
    @click="event('createBtn')"
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
      <!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
      <path
        d="M240 64c0-8.8-7.2-16-16-16s-16 7.2-16 16V240H32c-8.8 0-16 7.2-16 16s7.2 16 16 16H208V448c0 8.8 7.2 16 16 16s16-7.2 16-16V272H416c8.8 0 16-7.2 16-16s-7.2-16-16-16H240V64z"
      />
    </svg>
  </button>
  <div ref="table"></div>
</template>

<script setup>
import { onMounted, defineProps, ref } from 'vue'
import { emitter } from 'formue'
import { useTabulator } from './../composables/useTabulator'

const { event } = emitter
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
