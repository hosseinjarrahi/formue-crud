<template>
  <div
    class="w-full bg-[#f9fafb] border border-[rgba(34,36,38,.1)] rounded p-2 flex align-center mt-2"
  >
    <div
      v-for="header in store.headersWithoutActions"
      :key="header.field"
      class="cursor-pointer"
      @click="selectedFilter ? (selectedFilter = false) : (selectedFilter = header)"
    >
      {{ header.title }}
    </div>
  </div>
  <div
    v-if="selectedFilter"
    class="w-full bg-[#f9fafb] border border-[rgba(34,36,38,.1)] rounded p-2 flex align-center mt-2"
  >
    <component :is="components[selectedFilter.filter + 'Filter']" :store="store">
      {{ selected }}
    </component>
  </div>
</template>

<script setup>
import { defineProps, ref, defineAsyncComponent } from 'vue'

const props = defineProps({
  store: {}
})

const store = props.store

const selectedFilter = ref(false)

const components = {}

const registerComponent = async (filePath) => {
  const componentName = filePath
    .split('/')
    .pop()
    .replace(/\.\w+$/, '')

  components[componentName] = defineAsyncComponent(() => import(filePath))
}

const componentsEntry = import.meta.globEager('./filters/*.vue')

for (const filePath in componentsEntry) {
  registerComponent(filePath)
}
</script>
