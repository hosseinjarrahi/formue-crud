<script setup>
import { onMounted, defineProps, provide, defineEmits } from 'vue'
import { init } from '@/helpers/formueCrud'
import MList from './MList.vue'
import MButtonBox from './MButtonBox.vue'
import MFilter from './MFilter.vue'
import MDialogForm from './MDialogForm.vue'
import MShowDialog from './MShowDialog.vue'
import MDeleteDialog from './MDeleteDialog.vue'
import MHeaderBox from './MHeaderBox.vue'

const props = defineProps({
  options: { default: () => ({}) },
  hiddenActions: { default: () => [] },
  fields: { default: () => [] },
  dir: { default: 'ltr' },
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
provide('dir', props.dir)
document.body.setAttribute('dir', props.dir)
onMounted(() => {
  document.getElementsByClassName('v-overlay-container')[0].setAttribute('dir', 'ltr')

  emit('mounted')
})
</script>

<template>
  <MButtonBox />

  <MFilter />

  <MHeaderBox />

  <MList />

  <MDialogForm />

  <MShowDialog />

  <MDeleteDialog />

  <slot name="extra"></slot>
</template>
