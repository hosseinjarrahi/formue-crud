<template>
  <TailwindDialog v-model="store.dialog" :title="store.isEditing ? $fcTr('edit') : $fcTr('add')">
    <slot></slot>

    <template #actions>
      <slot name="actions"></slot>
    </template>
  </TailwindDialog>
</template>

<script setup>
import { inject } from 'vue'
import TailwindDialog from './TailwindDialog.vue'

const store = inject('store')
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s linear;
}
.fade-enter-from,
.fade-enter,
.fade-leave-to {
  transform: scale(0.5);
  opacity: 0;
}
.fade-enter-from {
  transform: scale(1);
  transform: translateX(10px);
  opacity: 0;
}
</style>
