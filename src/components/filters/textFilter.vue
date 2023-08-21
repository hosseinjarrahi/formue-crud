<template>
  <select
    class="rounded mr-2"
    :value="getSafe(props.modelValue, 'type')"
    @input="(event) => updateType(event.target.value)"
  >
    <option disabled selected>select type</option>
    <option value="=">equal to</option>
    <option value="!=">not equal to</option>
    <option value=">">grater than</option>
    <option value="<">less than</option>
    <option value="LIKE">look like</option>
  </select>
  <input
    class="rounded px-2"
    :value="getSafe(props.modelValue, 'value')"
    placeholder="search ..."
    @input="(event) => updateValue(event.target.value)"
  />
  <button
    class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-2"
    @click="clear"
  >
    clear
  </button>
</template>

<script setup>
import { get as getSafe } from 'lodash'
import { defineProps } from 'vue'

const props = defineProps({
  modelValue: {}
})

const emit = defineEmits(['update:modelValue'])

function updateValue(value) {
  emit('update:modelValue', {
    type: getSafe(props.modelValue, 'type'),
    value
  })
}

function updateType(type) {
  emit('update:modelValue', {
    type,
    value: getSafe(props.modelValue, 'value')
  })
}

function clear() {
  emit('update:modelValue', {
    type: '',
    value: ''
  })
}
</script>

<style scoped>
input {
  border: 1px solid black;
}
</style>
