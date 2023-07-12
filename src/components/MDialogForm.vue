<template>
  <transition name="fade" appear>
    <div class="fixed z-10 inset-0 overflow-y-auto" v-if="props.modelValue">
      <div
        class="flex items-center overflow-y justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <div class="fixed inset-0 transition-opacity">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div
          class="inline-block max-h-full align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div class="bg-card-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="flex flex-col text-right">
              <h1 class="mb-4 flex justify-between w-full">
                <span class="text-primerr-700" v-if="!isEditing">افزودن</span>
                <span class="text-primerr-700" v-else>ویرایش</span>
                <i
                  class="text-primerr-700 fal fa-times cursor-pointer"
                  @click="$emit('update:modelValue', false)"
                ></i>
              </h1>

              <div class="mb-5 flex flex-row flex-wrap">
                <MForm :fields="fields" v-model="form" :formData="editItem" />
              </div>

              <div class="flex justify-end">
                <button
                  @click="$emit('update:modelValue', false)"
                  class="border p-2 px-8 rounded-md text-red-400 border-red-400"
                >
                  لغو
                </button>
                <button
                  @click="event('saveForm')"
                  class="border p-2 mx-1 px-8 rounded-md text-green-400 border-green-400"
                >
                  ذخیره
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import MForm from 'formue'
import { useEmitter } from 'formue'
import { useFields } from './../composables/useFields'
import { watch, ref } from 'vue'
import { useStore } from './../composables/useStore'

const { add, edit } = useStore()
const { listen, event } = useEmitter()
const { fields } = useFields()

const form = ref({})

const props = defineProps({
  modelValue: {},
  isEditing: {},
  editItem: {}
})

const emit = defineEmits(['input'])

watch(props.val, (val) => {
  val && event('dialog', props.isEditing)
})

function handleDialog(e) {
  emit('update:modelValue', e)
}

function defineListeners() {
  listen('saveForm', (doYouWantToValidate = false) => {
    const save = () => {
      props.isEditing ? edit(form) : add(form)
    }
    // if (doYouWantToValidate) {
    //   return event('validating', (valid) => {
    //     valid ? save() : ''
    //   })
    // }
    return save()
  })

  listen(['createBtn'], () => {
    Object.assign(form, {})
  })

  listen('editTheItem', (item) => {
    edit(item)
  })

  listen('addTheItem', (item) => {
    add(item)
  })
}

defineListeners()
</script>
