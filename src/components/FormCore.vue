<template>
  <div class="flex flex-col text-right">
    <div class="mb-5">
      <Vueform
        v-model="store.form"
        v-bind="store.structure"
        :schema="store.formFields"
        :columns="{ label: 12 }"
        ref="form$"
        sync
      />
    </div>

    <div class="flex justify-end pb-3">
      <button
        @click="store.dialog = false"
        className="px-4 py-2 ml-2 rounded-md border border-red-300 bg-red-100 text-red-500 text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md"
      >
        {{ $fcTr('cancel') }}
      </button>
      <button
        :disabled="store.loadings.mainLoading"
        @click="event('saveForm')"
        className="px-4 py-2 rounded-md border border-green-300 bg-green-100 text-green-500 text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md"
      >
        <span v-if="!store.loadings.mainLoading"> {{ $fcTr('save') }} </span>
        <span v-else>loading</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { emitter } from 'formue'
import normalizer from '@/helpers/normalizer'

const { event, listen } = emitter

const store = inject('store')

const form$ = ref(null)

let editItemId = ''

const normalize = (data) => {
  let out = { ...data }

  for (const field of store.flatFieldsWithoutActions) {
    out[field.field] = normalizer(field, data)
  }

  return out
}

const save = () => {
  store.isEditing
    ? store.editItem({ ...store.form, id: editItemId })
    : store.addItem({ ...store.form })
}

const defineListeners = () => {
  listen('createBtn', () => {
    editItemId = false
    store.isEditing = false
    store.form = {}
  })

  listen('editBtn', (data) => {
    // todo
    editItemId = data.id

    store.isEditing = true

    store.form = normalize(data)
  })

  listen('saveForm', () => {
    try {
      form$.value.validate()

      if (form$.value.invalid) {
        return
      }
    } catch (e) {
      return
    }

    return save()
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
