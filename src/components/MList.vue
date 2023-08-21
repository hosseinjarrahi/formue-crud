<template>
  <div class="w-full">
    <component :is="MTable" v-bind="bind()" />
  </div>
</template>

<script setup>
import { inject } from 'vue'
import MTable from './MTable.vue'

const store = inject('store')

function getField(field) {
  return 'item.' + field
}

function getHeader(header) {
  return 'header.' + header
}

function getIndex(item) {
  return (
    store
      .getItems(store.mainKey)
      .map((i) => i.id)
      .indexOf(item.id) +
    (15 * page - 14)
  )
}

function bind() {
  return {
    getHeader,
    getField,
    getIndex
  }
}
</script>
