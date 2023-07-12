<template>
  <MCrud />
</template>

<script setup>
import MCrud from './components/MCrud.vue'
import { useCrud } from './composables/useMCrud'
import TextField from '@/components/fields/TextField.vue'
import './../node_modules/formue/dist/style.css'

const { init } = useCrud()

init({
  mainRoute: "http://127.0.0.1:8000/api/coordinate-name",

  fields: [
    {
      title: 'name',
      sendKey:'name',
      field: 'name',
      component: TextField,
      isHeader: true,
    },
  ]
})
</script>
