<template>
  <transition name="fade" appear>
    <div
      v-show="store.dialog"
      class="w-full rounded-lg bg-white shadow-secondary-1 dark:bg-surface-dark"
    >
      <div
        class="border-b-2 flex justify-between border--100 px-6 py-3 text-surface dark:border-white/10 dark:text-white"
      >
          <b class="text-primerr-700" v-if="store.isEditing"> {{ $fcTr('edit') }} </b>
          <b class="text-primerr-700" v-else> {{ $fcTr('add') }} </b>
          <img
            style="max-width: 18px; cursor: pointer"
            :src="timesSVG"
            @click="store.dialog = false"
          />
      </div>
      <div class="p-6">
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { inject } from 'vue'
import timesSVG from '@/assets/times.svg'

const props = defineProps({
  dialog: { default: false }
})

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
  opacity: 0;
}
.fade-enter-from {
  transform: translateX(10px);
  opacity: 0;
}
</style>
