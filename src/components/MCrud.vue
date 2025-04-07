<script setup>
import { emitter } from 'formue'
import { onMounted, provide } from 'vue'
import { init } from '@/helpers/formueCrud'
import { useLangsStore } from '@/stores/langStore'
import MList from './MList.vue'
import MFilter from './MFilter.vue'
import MTooltip from './MTooltip.vue'
import MHeaderBox from './MHeaderBox.vue'
import MButtonBox from './MButtonBox.vue'
import MShowDialog from './MShowDialog.vue'
import MDeleteDialog from './MDeleteDialog.vue'
import storeListeners from '@/helpers/storeListeners'

const props = defineProps({
  options: { default: () => ({}) },
  structure: { default: () => ({}) },
  hiddenActions: { default: () => [] },
  fields: { default: () => [] },
  tableOptions: { default: () => ({}) },
  dir: {
    default: () => {
      const langStore = useLangsStore()
      return langStore.dir
    }
  },
  route: { default: 'route' }
})

const emit = defineEmits(['mounted'])

const store = init({
  fields: props.fields,
  hiddenActions: props.hiddenActions,
  options: props.options,
  structure: props.structure,
  route: props.route
})

provide('store', store)

provide('tableOptions', {
  dir: props.dir,
  ...props.tableOptions
})

document.body.setAttribute('dir', props.dir)

onMounted(() => {
  emit('mounted')
})

storeListeners({ listen: emitter.listen, store })
</script>

<template>
  <MButtonBox />

  <MFilter />

  <MHeaderBox />

  <MList />

  <MShowDialog />

  <MDeleteDialog />

  <MTooltip/>

  <slot name="extra"></slot>
</template>

