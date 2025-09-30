<template>
  <input
    v-model="isSelected"
    class="rounded"
    type="checkbox"
    @change="toggle"
    style="border: 1px dashed rgba(0, 0, 0, 0.2)"
  />
</template>

<script setup>
import { ref } from 'vue'
import { emitter } from '@/helpers/emitter'

const props = defineProps({
  data: { default: () => ({}) },
  index: { default: -1 },
  all: { default: false }
})

const isSelected = ref(false)

emitter.listen('toggle.select.all', (show) => {
  if (props.all) return

  isSelected.value = show
  emitter.event('toggle.select', props.data.id)
})

function toggle(event) {
  if (props.all) return emitter.event('toggle.select.all', isSelected.value)

  emitter.event('toggle.select', props.data.id)
}
</script>
