<template>
  <template v-if="store.panel === 'headerBox'">
    <div class="w-full border bg-muted-200 rounded p-2 flex align-center mt-2">
      <div
        v-for="field in store.flatFields"
        :key="field.field"
        class="px-1 mx-1 cursor-pointer divide-y rounded"
        :class="{
          'bg-primary-600 text-white': field.isHeader
        }"
        @click="toggleHeader(field)"
      >
        {{ field.title }}
      </div>
    </div>
  </template>
</template>

<script setup>
import { inject } from 'vue'

const store = inject('store')

function toggleHeader(field) {
  field.isHeader = !field.isHeader
}
</script>
