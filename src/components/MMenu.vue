<template>
  <div class="relative">
    <!-- Button to open the menu -->

    <slot name="activator" v-bind="{ on, props }">
      <button class="bg-blue-500 text-white px-4 py-2 rounded-md" v-on="on">
        Open Menu
        {{ isOpen }}
      </button>
    </slot>

    <!-- Menu -->
    <div
      v-if="isOpen"
      class="absolute top-[35px] left-0 mt-2 w-48 rounded-md shadow-lg z-[1]"
      ref="target"
    >
      <slot>
        <ul class="py-2">
          <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Item 1</li>
          <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Item 2</li>
          <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Item 3</li>
        </ul>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

const target = ref(null)

onClickOutside(target, (event) => console.log(event))

const isOpen = ref(false)

const props = { isOpen: isOpen.value }

const on = {
  click: () => (isOpen.value = !isOpen.value)
}
</script>
