<template>
  <transition name="fade" appear>
    <div v-if="modelValue" @keydown.escape="close" class="relative z-10" role="dialog">
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-50 transition-opacity backdrop-blur-[4px]"
      ></div>

      <div class="fixed z-10 inset-0 overflow-y-auto">
        <div class="flex items-center justify-center min-h-full p-4 sm:p-0">
          <div
            class="relative bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full"
          >
            <div class="bg-white px-4 pt-3 pb-4 sm:pb-4">
              <div class="flex items-start">
                <div class="w-full">
                  <h3
                    class="text-lg leading-6 font-medium text-gray-900 flex flex-row justify-between"
                    id="modal-title"
                  >
                    <span class="pt-1">{{ props.title }}</span>

                    <img
                      style="max-width: 18px; cursor: pointer"
                      :src="timesSVG"
                      @click="store.dialog = false"
                    />
                  </h3>
                  <div class="mt-2">
                    <slot></slot>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-100 p-2 flex sm:flex-row-reverse">
              <slot name="actions">
                <button
                  type="button"
                  class="mt-1 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 !bg-green-500 text-base font-medium text-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  @click="close"
                >
                  تایید
                </button>
                <button
                  type="button"
                  class="mt-1 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  @click="close"
                >
                  لغو
                </button>
              </slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue'

import timesSVG from '@/assets/times.svg'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  title: { default: '' },
  modelValue: {}
})

function close() {
  emit('update:modelValue', false)
}
</script>
