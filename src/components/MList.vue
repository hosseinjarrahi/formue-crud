<template>
  <component :is="formComponent">
    <FormCore />

    <template #actions>
      <button
        :disabled="store.loadings.mainLoading"
        @click="saveForm"
        className="mt-1 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 !bg-green-500 text-base font-medium text-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
      >
        <span v-if="!store.loadings.mainLoading"> {{ $fcTr('save') }} </span>
        <span v-else>loading</span>
      </button>

      <button
        @click="store.dialog = false"
        className="mt-1 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
      >
        {{ $fcTr('cancel') }}
      </button>
    </template>
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

const save = () => {
  store.isEditing ? store.editItem({ ...store.form }) : store.addItem({ ...store.form })
}

const saveForm = () => {
  try {
    form$.value.validate()

    if (form$.value.invalid) {
      return
    }
  } catch (e) {
    return
  }

  return save()
}

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
