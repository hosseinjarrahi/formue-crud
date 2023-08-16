<script setup>
import { onMounted, defineProps } from 'vue'
import MList from './MList.vue'
import { emitter } from 'formue'
import MDialogForm from './MDialogForm.vue'
import MShowDialog from './MShowDialog.vue'
import MDeleteDialog from './MDeleteDialog.vue'
import { useDynamicStore } from '@/composables/useDynamicStore'
import { initFields } from '@/helpers/formue'

const storeName = 'myStore'

const props = defineProps({
  options: { default: () => ({}) },
  hiddenActions: { default: () => [] },
  fields: { default: () => [] },
  route: { default: 'route' }
})

function init(storeName) {
  const store = useDynamicStore(storeName)

  store.fields = props.fields

  // clearEventListeners()

  emitter.event('beforeFormueInit')

  store.addRoute(props.route)

  store.loadItems()

  // loadRelations(getSafe(payload, 'relations', []))

  store.options = props.options

  store.hiddenActions = props.options

  initFields(store.flatFields)

  return store
}

const store = init(storeName)

onMounted(() => {
  emitter.event('McrudMounted')
})
</script>

<template>
  <!-- header buttons - print - create - excel , ....... -->

  <MList :store="store" />

  <MDialogForm :store="store" />

  <MShowDialog :store="store" />

  <MDeleteDialog :store="store" />

  <slot name="extra"></slot>
</template>
