<template>
  <select
    class="rounded mx-2"
    :value="getSafe(filterValue, 'type')"
    @input="(event) => updateType(event.target.value)"
  >
    <option disabled>{{ $fcTr('select_type') }}</option>
    <option value="=">{{ $fcTr('equal_to') }}</option>
    <option value="!=">{{ $fcTr('not_equal_to') }}</option>
    <option value=">">{{ $fcTr('greater_than') }}</option>
    <option value="<">{{ $fcTr('less_than') }}</option>
    <option value="LIKE">{{ $fcTr('look_like') }}</option>
  </select>
  <input
    class="rounded px-2"
    :value="getSafe(filterValue, 'value')"
    :placeholder="$fcTr('search ...')"
    @input="(event) => updateValue(event.target.value)"
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

export default {
  extends: AbstractFilter,

  methods: {
    updateValue(value) {
      this.updateFilter({
        type: getSafe(this.filterValue, 'type'),
        value,
        field: 'text'
      })
    },

    updateType(type) {
      this.updateFilter({
        type,
        value: getSafe(this.filterValue, 'value'),
        field: 'text'
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
