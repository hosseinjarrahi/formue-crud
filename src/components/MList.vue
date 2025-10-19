<template>
  <component :is="formComponent">
    <FormCore />

    <template #actions>
      <button
        :disabled="store.loadings.mainLoading"
        @click="event('saveForm')"
        className="btn mt-1 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 !bg-green-500 text-base font-medium text-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
      >
        <span v-if="store.loadings.mainLoading">
          <b></b>
          <b></b>
          <b></b>
        </span>
        <span v-else-if="store.isEditing"> {{ $fcTr('edit') }} </span>
        <span v-else> {{ saveKey || $fcTr('save') }} </span>
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
import { emitter } from '@/helpers/emitter'
import MTable from './MTable.vue'
import MTabForm from './MTabForm.vue'
import FormCore from './FormCore.vue'
import { inject, computed } from 'vue'
import { get as getSafe } from 'lodash'
import MDialogForm from './MDialogForm.vue'
import normalizer from '@/helpers/normalizer'

const store = inject('store')
const { listen, event } = emitter

const saveKey = inject('form.save.key')

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

  listen('fillForm', (data) => {
    store.dialog = true
    store.editItemId = false
    store.isEditing = false
    store.form = normalize(data)
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

<style>
@keyframes stretch {
  0% {
    transform: scale(0.5);
    background-color: #b5ddf0;
  }
  50% {
    background-color: #cfe9f6;
  }
  100% {
    transform: scale(1);
    background-color: #ffffff;
  }
}

.btn span b {
  animation-direction: alternate;
  animation-duration: 0.5s;
  animation-fill-mode: none;
  animation-iteration-count: infinite;
  animation-name: stretch;
  animation-play-state: running;
  animation-timing-function: ease-out;
  border-radius: 100%;
  display: block;
  height: 10px;
  margin: 0 1px;
  width: 10px;
  animation-delay: 0.1s;
  margin: 0 5px;
}
.btn span b:first-child {
  animation-delay: 0s;
  margin: 0;
}
.btn span b:last-child {
  animation-delay: 0.2s;
  margin: 0;
}
.btn b {
  font-weight: normal;
}
</style>
