<template>
  <component :is="formComponent">
    <FormCore />
  </component>

  <div class="w-full">
    <component :is="MTable" v-bind="bind()" />
  </div>
</template>

<script setup>
import MTable from './MTable.vue'
import { get as getSafe } from 'lodash'
import { inject, computed } from 'vue'
import { emitter } from 'formue'
import MDialogForm from './MDialogForm.vue'
import MTabForm from './MTabForm.vue'
import FormCore from './FormCore.vue'

const store = inject('store')
const { listen } = emitter

const formComponent = computed(() => {
  const map = {
    tab: MTabForm,
    dialog: MDialogForm
  }

  return getSafe(map, store.options.formMode) || MDialogForm
})

listen('toggle.select', (id) => {
  if (store.selected.has(id)) return store.selected.delete(id)

  store.selected.add(id)
})

function bind() {
  return {}
}

const defineListeners = () => {
  listen('createBtn', () => {
    store.dialog = true
  })

  listen('editBtn', () => {
    store.dialog = true
  })

  listen('handleDialogForm', (dialogParam) => {
    store.dialog = dialogParam
  })
}

defineListeners()
</script>
