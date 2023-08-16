<template>
  <div class="w-full">
    <component :is="MTable" v-bind="bind()" />
  </div>
</template>

<script setup>
import MTable from './MTable.vue'

const props = defineProps({
  store: {}
})

function getField(field) {
  return 'item.' + field
}

function getHeader(header) {
  return 'header.' + header
}

function getIndex(item) {
  return (
    props.store
      .getItems(props.store.mainKey)
      .map((i) => i.id)
      .indexOf(item.id) +
    (15 * page - 14)
  )
}

function bind() {
  return {
    getHeader,
    getField,
    getIndex,
    store: props.store
  }
}
</script>
