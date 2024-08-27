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

    <div class="flex justify-end pb-3">
      <button
        @click="store.dialog = false"
        className="px-4 py-2 ml-2 rounded-md border border-red-300 bg-red-100 text-red-500 text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md"
      >
        {{ $fcTr('cancel') }}
      </button>
      <button
        :disabled="store.loadings.mainLoading"
        @click="saveForm"
        className="px-4 py-2 rounded-md border border-green-300 bg-green-100 text-green-500 text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md"
      >
        <span v-if="!store.loadings.mainLoading"> {{ $fcTr('save') }} </span>
        <span v-else>loading</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'

const store = inject('store')

const form$ = ref(null)

const save = () => {
  store.isEditing ? store.editItem({ ...store.form }) : store.addItem({ ...store.form })
}

const saveForm = () => {
  try {
    form$.value.validate()

    if (form$.value.invalid) {
      return
    }
  } catch (e) {
    return
  }

  return save()
}
</script>
