<template>
  <transition name="fade" appear>
    <div class="fixed z-10 inset-0 overflow-y-auto" v-if="dialog">
      <div
        class="flex items-center overflow-y justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <div class="fixed inset-0 transition-opacity">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div
          class="inline-block max-h-full align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div
            class="bg-card-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4 dark:bg-muted-700 dark:text-muted-200"
          >
            <div class="flex flex-col text-right">
              <h1 class="mb-4 flex justify-between w-full">
                <span class="text-primerr-700" v-if="store.isEditing"> {{ $fcTr('edit') }} </span>
                <span class="text-primerr-700" v-else> {{ $fcTr('add') }} </span>
                <i class="text-primerr-700 fal fa-times cursor-pointer" @click="dialog = false"></i>
              </h1>

              <div class="mb-5 flex flex-row flex-wrap">
                <Vueform
                  v-model="form"
                  sync
                  :schema="store.formFields"
                  :columns="{ label: 12 }"
                  v-bind="store.structure"
                />
              </div>

              <div class="flex justify-end">
                <button
                  @click="dialog = false"
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
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, inject } from 'vue'
import { emitter } from 'formue'
import normalizer from '@/helpers/normalizer'

const { event, listen } = emitter

const store = inject('store')

const form = ref({})
let dialog = ref(false)
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
    dialog.value = true
    form.value = {}
  })

  listen('editBtn', (data) => {
    editItem = data
    store.isEditing = true
    dialog.value = true
    form.value = normalize(data)
  })

  listen('handleDialogForm', (dialogParam) => {
    dialog.value = dialogParam
  })

  listen('saveForm', () => {
    const save = () => {
      store.isEditing
        ? store.editItem({ ...form.value, id: editItem?.id })
        : store.addItem({ ...form.value })
    }

    return save()
  })

  listen(['createBtn'], () => {
    Object.assign(form, {})
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

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s linear;
}
.fade-enter-from,
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-from {
  transform: translateX(10px);
  opacity: 0;
}
</style>
