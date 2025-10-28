<template>
  <transition name="fade" appear>
    <div v-if="dialog" @keydown.escape="dialog = false" class="relative z-50" role="dialog">
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black bg-opacity-30 transition-opacity backdrop-blur-sm"
        @click="dialog = false"
      ></div>

      <!-- Dialog Container -->
      <div class="fixed z-50 inset-0 overflow-hidden pointer-events-none">
        <!-- Dialog Panel -->
        <div
          class="absolute bg-white shadow-2xl border border-gray-200 pointer-events-auto transition-all duration-300 rounded-xl"
          style="left: 50%; top: 50%; transform: translate(-50%, -50%); width: 400px; max-width: 90vw;"
        >
          <!-- Header -->
          <div
            class="flex items-center justify-between px-4 py-3 border-gray-200 border-b rounded-t-xl bg-gradient-to-r from-red-50 to-orange-50"
          >
            <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              حذف
            </h3>

            <!-- Close Button -->
            <button
              @click="dialog = false"
              class="p-1.5 rounded-full hover:bg-red-100 transition-colors group"
              title="Close"
            >
              <svg
                class="w-4 h-4 text-gray-600 group-hover:text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="flex flex-col overflow-hidden">
            <!-- Content Area -->
            <div class="px-4 py-4 overflow-y-auto">
              <div class="mb-5 flex flex-row flex-wrap">{{ $fcTr('alert_to_delete') }}</div>
            </div>

            <!-- Fixed Actions Footer -->
            <div class="flex-shrink-0 bg-gray-50 px-4 py-3 border-t border-gray-200 rounded-b-xl">
              <div class="flex justify-end gap-2">
                <button
                  @click="dialog = false"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors"
                >
                  {{ $fcTr('no') }}
                </button>
                <button
                  :disabled="store.loadings.mainLoading"
                  class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
import { emitter } from '@/helpers/emitter'

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

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
