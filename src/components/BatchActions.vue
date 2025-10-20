<template>
  <Transition name="fade">
    <button class="fc-header-icon-btn !bg-red-100" data-tooltip="حذف دسته جمعی" :disabled="!list.length"
      @click="batchRemove">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
        <rect width="16" height="16" fill="none" />
        <path fill="#f00"
          d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1l-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
      </svg>
    </button>
  </Transition>
</template>

<script setup>
import { emitter } from '@/helpers/emitter'
import { inject, ref, Transition } from 'vue'

const store = inject('store')

const list = ref([])

emitter.listen('toggle.select', (id) => {
  if (list.value.includes(id)) list.value = list.value.filter((i) => i !== id)
  else list.value.push(id)
})

function batchRemove() {
  emitter.event('dialog.confirm', {
    description: ' آیا از حذف این ' + list.value.length + ' آیتم ، مطمئن هستید؟ ',
    title: 'حذف دسته جمعی',
    icon: 'fluent:delete-dismiss-24-regular',
    confirmFunc: async () => {
      const respones = await store.remove(list.value)
      list.value = []
      emitter.event('batch.removed')
      return respones;
    },
  })
}
</script>
