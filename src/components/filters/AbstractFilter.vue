<script>
import { get as getSafe } from 'lodash'

export default {
  props: {
    modelValue: {
      type: Object,
      default: () => ({})
    },
    field: {
      type: Object,
      default: () => ({})
    }
  },
  
  inject: ['store'],

  emits: ['update:modelValue'],

  computed: {
    filterValue() {
      return this.modelValue
    }
  },

  methods: {
    getSafe,
    updateFilter(value) {
      this.$emit('update:modelValue', value)
    },

    clear() {
      this.$emit('update:modelValue', {})
    },
  }
}
</script>
