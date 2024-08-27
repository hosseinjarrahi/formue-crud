<template>
  <transition name="fade" appear>
    <div v-if="store.dialog" class="fixed z-10 inset-0 overflow-y-auto backdrop-blur-[4px]">
      <div
        class="flex items-center overflow-y justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <div class="fixed inset-0 transition-opacity">
          <div class="absolute inset-0 bg-gray-500 opacity-50"></div>
        </div>
        <div
          class="inline-block max-h-full align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <h1
            class="mb-4 flex justify-between w-full p-5"
            style="border-bottom: 1px solid rgba(0, 0, 0, 0.2)"
          >
            <b class="text-primerr-700" style="font-size: 1.2rem" v-if="store.isEditing">
              {{ $fcTr('edit') }}
            </b>
            <b class="text-primerr-700" style="font-size: 1.2rem" v-else> {{ $fcTr('add') }} </b>
            <img
              style="max-width: 18px; cursor: pointer"
              :src="timesSVG"
              @click="store.dialog = false"
            />
          </h1>

          <div class="bg-card-800 px-4 dark:bg-muted-700 dark:text-muted-200">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { inject } from 'vue'
import timesSVG from '@/assets/times.svg'

const store = inject('store')
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
