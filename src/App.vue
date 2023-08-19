<template>
  <div class="w-1/2 mx-auto pt-10">
    <MCrud :fields="fields" route="http://127.0.0.1:8000/api/ship-list" />
    <AppAlert />
  </div>
</template>

<script setup>
import { markRaw } from 'vue'
import './../node_modules/formue/dist/style.css'
import AppAlert from '@/components/AppAlert.vue'
import MCrud from './components/MCrud.vue'
import TextField from '@/components/fields/TextField.vue'

const fields = [
  {
    title: 'hull_number',
    field: 'hull_number',
    filter: 'text',
    isHeader: true,
    component: markRaw(TextField)
  }
]
</script>
