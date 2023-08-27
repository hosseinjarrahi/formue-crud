<template>
  <vSelect
    style="min-width: 89%;"
    :options="filterOptions"
    :modelValue="getSafe(this.filterValue, 'value')"
    simple
    multiple
    :label="getSafe(field, 'rel.textKey')"
    :reduce="(item) => getSafe(item, getSafe(this.field, 'rel.valueKey'))"
    @update:modelValue="updateValue"
  >
    <!-- <template v-slot:option="option">
      <span :class="option.icon"></span>
      {{ getSafe(option, getSafe(field, 'rel.textKey')) }}
    </template> -->
  </vSelect>

  <button
    class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mx-2"
    @click="clear"
  >
    {{ $fcTr('Clear') }}
  </button>
</template>

<script>
import { get as getSafe } from 'lodash'
import AbstractFilter from './AbstractFilter.vue'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

export default {
  extends: AbstractFilter,

  components: { vSelect },

  data: () => ({
    key: ''
  }),

  computed: {
    filterOptions() {
      return this.store.getItems(this.key)
    }
  },

  created() {
    this.key = this.store.addRoute(getSafe(this.field, 'rel.get'))
    this.store.loadItems(this.key)
  },

  methods: {
    updateValue(value) {
      this.updateFilter({
        value,
        field: 'select'
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
