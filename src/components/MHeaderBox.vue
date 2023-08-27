<template>
  <template v-if="showHeaderBox">
    <div
      class="w-full bg-[#f9fafb] border border-[rgba(34,36,38,.1)] rounded p-2 flex align-center mt-2"
    >
      <div
        v-for="field in store.flatFields"
        :key="field.field"
        class="px-1 mx-1 cursor-pointer divide-y rounded"
        :class="{
          'bg-red-600 text-white': field.isHeader
        }"
        @click="toggleHeader(field)"
      >
        {{ field.title }}
      </div>
    </div>
  </template>
</template>

<script setup>
import { emitter } from 'formue'
import { inject, ref } from 'vue'

const { listen } = emitter

const showHeaderBox = ref(false)

const store = inject('store')

listen('showHeaderBox', () => {
  showHeaderBox.value = !showHeaderBox.value
})

function toggleHeader(field) {
  field.isHeader = !field.isHeader
}
</script>
