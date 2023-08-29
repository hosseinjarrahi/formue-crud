<template>
  <select
    class="rounded mx-2"
    :value="getSafe(filterValue, 'type')"
    @input="(event) => updateType(event.target.value)"
  >
    <option disabled>{{ $fcTr('select_type') }}</option>
    <option value="<>">{{ $fcTr('range') }}</option>
    <option value="=">{{ $fcTr('equal_to') }}</option>
    <option value=">">{{ $fcTr('greater_than') }}</option>
    <option value="<">{{ $fcTr('less_than') }}</option>
  </select>
  <DatePicker
    locale="en,fa"
    class="rounded px-2"
    :modelValue="getSafe(this.filterValue, 'value')"
    :range="getSafe(this.filterValue, 'type') === '<>'"
    simple
    @update:modelValue="updateValue"
  />
  <button
    class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mx-2"
    @click="clear"
  >
    {{ $fcTr('clear') }}
  </button>
</template>

<script>
import { get as getSafe } from 'lodash'
import AbstractFilter from './AbstractFilter.vue'
import Vue3PersianDatetimePicker from 'vue3-persian-datetime-picker'

export default {
  extends: AbstractFilter,

  components: { DatePicker: Vue3PersianDatetimePicker },

  methods: {
    updateValue(value) {
      this.updateFilter({
        type: getSafe(this.filterValue, 'type'),
        value,
        field: 'date'
      })
    },

    updateType(type) {
      this.updateFilter({
        type,
        value: getSafe(this.filterValue, 'value'),
        field: 'date'
      })
    }
  }
}
</script>

<style scoped>
input {
  border: 1px solid black;
}
</style>
