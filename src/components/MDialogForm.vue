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
          class="inline-block max-h-full align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div class="bg-card-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="flex flex-col text-right">
              <h1 class="mb-4 flex justify-between w-full">
                <span class="text-primerr-700" v-if="store.isEditing">Edit</span>
                <span class="text-primerr-700" v-else>Add</span>
                <i class="text-primerr-700 fal fa-times cursor-pointer" @click="dialog = false"></i>
              </h1>

              <div class="mb-5 flex flex-row flex-wrap">
                <MForm :fields="store.fields" v-model="form" :form-data="editItem" />
              </div>

              <div class="flex justify-end">
                <button
                  @click="dialog = false"
                  class="border p-2 px-8 rounded-md text-red-400 border-red-400"
                >
                  لغو
                </button>
                <button
                  :disabled="store.loadings.mainLoading"
                  @click="event('saveForm')"
                  class="border p-2 mx-1 px-8 rounded-md text-green-400 border-green-400"
                >
                  <span v-if="!store.loadings.mainLoading">ذخیره</span>
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
import MForm from 'formue'
import { ref, inject } from 'vue'
import { emitter } from 'formue'

const { event, listen } = emitter

const store = inject('store')

const form = ref({})
let dialog = ref(false)
let editItem = ref({})

const defineListeners = () => {
  listen('createBtn', () => {
    editItem.value = {}
    store.isEditing = false
    dialog.value = true
  })

  listen('editBtn', (data) => {
    editItem.value = { ...data }
    store.isEditing = true
    dialog.value = true
  })

  listen('handleDialogForm', (dialogParam) => {
    dialog.value = dialogParam
  })

  listen('saveForm', () => {
    const save = () => {
      store.isEditing ? store.editItem(form) : store.addItem(form)
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
