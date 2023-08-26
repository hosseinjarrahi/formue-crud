<template>
  <div class="w-1/2 mx-auto pt-10">
    <MCrud :fields="fields" route="http://127.0.0.1:8000/api/professor" dir="rtl" />
    <AppAlert />
  </div>
</template>

<script setup>
import { markRaw } from 'vue'
import './../node_modules/formue/dist/style.css'
import AppAlert from '@/components/AppAlert.vue'
import MCrud from './components/MCrud.vue'
import TextField from '@/components/fields/TextField.vue'
import { defineFields } from '@/helpers/formueCrud'

const fields = defineFields([
  {
    title: 'firstname',
    field: 'firstname',
    filter: 'text',
    isHeader: true,
    component: markRaw(TextField),
  },
  {
    title: 'lastname',
    field: 'lastname',
    isHeader: true,
    filter: 'text',
    component: markRaw(TextField),
  }
])
</script>
