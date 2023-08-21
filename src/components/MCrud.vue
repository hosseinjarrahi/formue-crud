<script setup>
import { onMounted, defineProps, provide, defineEmits } from 'vue'
import { init } from '@/helpers/formueCrud'
import MList from './MList.vue'
import MHeader from './MHeader.vue'
import MFilter from './MFilter.vue'
import MDialogForm from './MDialogForm.vue'
import MShowDialog from './MShowDialog.vue'
import MDeleteDialog from './MDeleteDialog.vue'

const props = defineProps({
  options: { default: () => ({}) },
  hiddenActions: { default: () => [] },
  fields: { default: () => [] },
  route: { default: 'route' }
})

const emit = defineEmits(['mounted'])

const store = init({
  fields: props.fields,
  hiddenActions: props.hiddenActions,
  options: props.options,
  route: props.route
})

provide('store', store)

onMounted(() => {
  emit('mounted')
})
</script>

<template>
  <MHeader />

  <MFilter />

  <MList />

  <MDialogForm />

  <MShowDialog />

  <MDeleteDialog />

  <slot name="extra"></slot>
</template>
