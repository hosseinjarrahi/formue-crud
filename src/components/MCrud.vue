<script setup>
import { onMounted, defineProps, provide } from 'vue'
import { useDynamicStore } from '@/composables/useDynamicStore'
import { initFields } from '@/helpers/formue'
import { emitter } from 'formue'

import MList from './MList.vue'
import MDialogForm from './MDialogForm.vue'
import MShowDialog from './MShowDialog.vue'
import MDeleteDialog from './MDeleteDialog.vue'
import MHeader from './MHeader.vue'
import MFilter from './MFilter.vue'

const props = defineProps({
  options: { default: () => ({}) },
  hiddenActions: { default: () => [] },
  fields: { default: () => [] },
  route: { default: 'route' }
})

function init() {
  const store = useDynamicStore()

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

const store = init()

provide('store', store)

onMounted(() => {
  emitter.event('McrudMounted')
})
</script>

<template>
  <!-- header buttons - print - create - excel , ....... -->
  <MHeader />

  <MFilter />

  <MList />

  <MDialogForm />

  <MShowDialog />

  <MDeleteDialog />

  <slot name="extra"></slot>
</template>
