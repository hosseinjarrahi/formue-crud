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

    <div class="flex justify-end">
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
import { ref, inject, watch } from 'vue'
import { emitter } from 'formue'
import normalizer from '@/helpers/normalizer'

const { event, listen } = emitter

const store = inject('store')

const form$ = ref(null)
let editItem = {}

const normalize = (data) => {
  let out = {}
  for (const field of store.flatFieldsWithoutActions) {
    out[field.field] = normalizer(field, data)
  }
  return out
}

const defineListeners = () => {
  listen('createBtn', () => {
    editItem = {}
    store.isEditing = false
    store.form = {}
  })

  listen('editBtn', (data) => {
    editItem = data
    store.isEditing = true
    store.form = normalize(data)
  })

  listen('saveForm', () => {
    try {
      form$.value.validate()

      if (form$.value.invalid) {
        return
      }
    } catch (e) {}

    const save = () => {
      store.isEditing
        ? store.editItem({ ...store.form, id: editItem?.id })
        : store.addItem({ ...store.form })
    }

    return save()
  })

  listen(['createBtn'], () => {
    store.form = {}
  })

  listen('editTheItem', (item) => {
    edit(item)
  })

  listen('addTheItem', (item) => {
    add(item)
  })
}

defineListeners()

watch(store.form, (value) => {
  console.log(value)
})
</script>
