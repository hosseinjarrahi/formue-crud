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
import normalizer from '@/helpers/normalizer'
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

function bind() {
  return {}
}

const normalize = (data) => {
  let out = { ...data }

  for (const field of store.flatFieldsWithoutActions) {
    out[field.field] = normalizer(field, data)
  }

  return out
}

const defineListeners = () => {
  emitter.listen('formue.dialog', (dialogValue) => {
    store.dialog = dialogValue
  })

  listen('toggle.select', (id) => {
    if (store.selected.has(id)) return store.selected.delete(id)

    store.selected.add(id)
  })

  listen('createBtn', () => {
    store.dialog = true
    store.editItemId = false
    store.isEditing = false
    store.form = {}
  })

  listen('editBtn', (data) => {
    store.dialog = true
    store.editItemId = data.id
    store.isEditing = true
    store.form = normalize(data)
  })

  listen('handleDialogForm', (dialogParam) => {
    store.dialog = dialogParam
  })

  listen('editTheItem', (item) => {
    edit(item)
  })

  listen('addTheItem', (item) => {
    add(item)
  })
}

defineListeners()
</script>
