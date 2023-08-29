<template>
  <input
    class="border-2 w-full border-indigo-600 rounded"
    :value="value"
    @input="(event) => updateField(event.target.value)"
  />
  <span class="text-red-900" v-if="error">
    {{ error }}
  </span>
</template>

<script setup>
import { defineProps } from 'vue'
import { propsField } from 'formue'

defineProps(propsField)
</script>
