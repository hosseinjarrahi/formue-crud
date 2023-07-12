<template>
  <MList />

  <MDialogForm v-model="dialog" :editItem="editItem" :isEditing="isEditing" />

  <MShowDialog />

  <MDeleteDialog />

  <slot name="extra"></slot>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue'
import { useEmitter } from 'formue'
import MDialogForm from './MDialogForm.vue'
import MList from './MList.vue'
import MShowDialog from './MShowDialog.vue'
import MDeleteDialog from './MDeleteDialog.vue'

let dialog = ref(false)
let editItem = reactive({})
let isEditing = ref(false)

const { listen, event } = useEmitter()

function defineListeners() {
  listen('createBtn', () => {
    isEditing.value = false
    dialog.value = true
    Object.assign(editItem, {})
  })

  listen('editBtn', (data) => {
    Object.assign(editItem, { ...data })
    isEditing.value = true
    dialog.value = true
  })

  listen('handleDialogForm', (dialogParam) => {
    dialog.value = dialogParam
  })
}

defineListeners()

onMounted(() => {
  event('McrudMounted')
})
</script>
