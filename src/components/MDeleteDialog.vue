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
                <span class="text-primerr-700">حذف</span>
                <i class="text-primerr-700 fal fa-times cursor-pointer" @click="dialog = false"></i>
              </h1>

              <div class="mb-5 flex flex-row flex-wrap">{{ $fcTr('alert_to_delete') }}</div>

              <div class="flex justify-end">
                <button
                  @click="dialog = false"
                  class="border p-2 px-8 rounded-md text-red-400 border-red-400"
                >
                  {{ $fcTr('no') }}
                </button>
                <button
                  :disabled="store.loadings.mainLoading"
                  class="border p-2 mx-1 px-8 rounded-md text-green-400 border-green-400"
                  @click="store.remove(deleteId)"
                >
                  <span v-if="!store.loadings.mainLoading"> {{ $fcTr('yes') }} </span>
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

const store = inject('store')

const dialog = ref(false)
let deleteId = ''

emitter.listen('deleteBtn', (data) => {
  dialog.value = true
  deleteId = data.id
})

emitter.listen('handleDeleteDialog', (dialogParam) => {
  dialog.value = dialogParam
  //   event('multiDelete', false)
})
</script>
