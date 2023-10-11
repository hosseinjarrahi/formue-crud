<template>
  <template v-if="store.panel === 'headerBox'">
    <div class="w-full border bg-white rounded p-2 flex align-center mt-2">
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
import { inject, watch } from 'vue'

const store = inject('store')

let element = null
watch(
  () => store.panel,
  (newItems) => {
    if (store.panel === 'headerBox') {
      store.headersWithoutActions.forEach((header) => {
        element = document.querySelector(`[tabulator-field="${header.field}"]`)
        function toggle(header) {
          header.isHeader = !header.isHeader
        }
        element.innerHTML =
          element.innerHTML +
          `<span class="fc-remove"><button class="text-white font-bold rounded px-1" onclick="">` +
          '<svg  aria-hidden="true" viewBox="0 0 24 24" class="h-4 w-4 text-primary-500"><path data-v-74b3417a="" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6 6 18M6 6l12 12"></path></svg>' +
          '</button></span>'
      })
    }
  }
)

function toggleHeader(field) {
  field.isHeader = !field.isHeader
}
</script>
<style>
.fc-remove {
  position: absolute;
  width: 100%;
  height: 100%;
  /* background: red; */
  z-index: 10000;
  top: 0%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 10px;
}
.fc-remove button {
  background: wheat;
  height: 1.5rem;
  width: 1.5rem;
  margin-right: 0px;
}
</style>
