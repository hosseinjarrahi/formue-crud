<template>
  <div class="w-1/2 mx-auto pt-10">
    <MCrud :fields="fields" route="http://192.168.190.10:9090/api/professor" />
    <AppAlert />
  </div>
</template>

<script setup>
import './../node_modules/formue/dist/style.css'
import AppAlert from '@/components/AppAlert.vue'
import MCrud from './components/MCrud.vue'
import { defineFields } from '@/helpers/formueCrud'

const fields = defineFields((_) => [
  {
    title: 'firstname',
    field: 'firstname',
    filter: 'date',
    isHeader: true,
    component: _('text')
  },
  {
    title: 'lastname',
    field: 'lastname',
    isHeader: true,
    filter: 'select',
    rel: {
      get: 'http://192.168.190.10:9090/api/lesson',
      model: 'Lesson',
      textKey: 'name',
      valueKey: 'id'
      // get: {
      //   immidate:false,
      //   route:'http://192.168.190.10:8000/api/professor',
      //   model:'Professor'
      // },
      // get: {
      //   immidate:false,
      //   handler(ft,store){
      //     ft.get('http://192.168.190.10:8000/api/professor')
      //     .then(res => store.items[model] = res.data))
      //   }
      // },
      // get: {
      //   immidate: false,
      //   handler(ft, set) {
      //     // fetch bby ft and then set data by set
      //   }
      // }
    },
    component: _('text')
  }
])
</script>
