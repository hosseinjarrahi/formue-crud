<template>
  <div class="w-full">
    <component :is="MTable" v-bind="bind()" />
  </div>
</template>

<script setup>
import MTable from './MTable.vue'
import { inject } from 'vue'
import { emitter } from 'formue'

const store = inject('store')

emitter.listen('toggle.select', (id) => {
  if (store.selected.has(id)) return store.selected.delete(id)

  store.selected.add(id)
})

// function getField(field) {
//   return 'item.' + field
// }

// function getHeader(header) {
//   return 'header.' + header
// }

// function getIndex(item) {
//   return (
//     store
//       .getItems(store.mainKey)
//       .map((i) => i.id)
//       .indexOf(item.id) +
//     (15 * page - 14)
//   )
// }

function bind() {
  return {
    // getHeader,
    // getField,
    // getIndex
  }
}
</script>
