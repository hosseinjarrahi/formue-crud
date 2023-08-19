<template>
  <input class="rounded" />
  <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded ml-2">filter</button>
  <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-2">filter</button>
</template>

<script setup>
import { defineProps } from 'vue'

const store = defineProps({
  store: {}
})
</script>

<style scoped>
input {
  border: 1px solid black;
}
</style>
