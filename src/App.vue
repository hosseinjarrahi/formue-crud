<template>
  <div class="w-1/2 mx-auto pt-10">
    <MCrud :fields="fields" route="http://192.168.190.10:9090/api/professor" />
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
    component: markRaw(TextField)
  },
  {
    title: 'lastname',
    field: 'lastname',
    isHeader: true,
    filter: 'select',
    rel: {
      get: 'http://192.168.190.10/api/lesson',
      textKey: 'name',
      valueKey: 'id'
      // get: {
      //   immidate:false,
      //   route:'http://127.0.0.1:8000/api/professor',
      //   key:''
      // },
      // get: {
      //   immidate:false,
      //   handler(ft,store){
      //     ft.get('http://127.0.0.1:8000/api/professor')
      //     .then(res => store.items[key] = res.data))
      //   }
      // },
      // get: {
      //   immidate: false,
      //   handler(ft, set) {
      //     // fetch bby ft and then set data by set
      //   }
      // }
    },
    component: markRaw(TextField)
  }
])
</script>
