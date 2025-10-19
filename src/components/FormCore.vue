<template>
  <div class="flex flex-col text-right mt-4">
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
import { emitter } from '@/helpers/emitter'

const store = inject('store')

const form$ = ref(null)

const save = () => {
  store.isEditing ? store.editItem({ ...store.form }) : store.addItem({ ...store.form })
}

const saveForm = async () => {
  try {
    form$.value.validate().then(() => {
      if (form$.value.invalid) {
        return
      }
      return save()
    })
  } catch (e) {
    return
  }
}

emitter.listen('saveForm', () => {
  saveForm()
})
</script>
