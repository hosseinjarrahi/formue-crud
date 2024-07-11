<template>
  <div class="flex flex-col text-right">
    <div class="mb-5">
      <Vueform
        v-model="store.form"
        :schema="store.formFields"
        :columns="{ label: 12 }"
        v-bind="store.structure"
        ref="form$"
        sync
      />
    </div>

    <div class="flex justify-end pb-3">
      <button
        @click="store.dialog = false"
        class="border p-2 px-8 rounded-md text-red-400 border-red-400"
      >
        {{ $fcTr('cancel') }}
      </button>
      <button
        :disabled="store.loadings.mainLoading"
        @click="event('saveForm')"
        class="border p-2 mx-1 px-8 rounded-md text-green-400 border-green-400"
      >
        <span v-if="!store.loadings.mainLoading"> {{ $fcTr('save') }} </span>
        <span v-else>loading</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, nextTick } from 'vue'
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
