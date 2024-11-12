<template>
  <div class="flex flex-col text-right">
    <div class="mb-5">
      <Vueform
        v-model="store.form"
        v-bind="store.structure"
        :schema="store.formFields"
        :columns="{ label: 12 }"
        ref="form$"
        sync
      />
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'

const store = inject('store')

const form$ = ref(null)
</script>
