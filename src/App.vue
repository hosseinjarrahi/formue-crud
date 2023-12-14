<template>
  <div class="w-1/2 mx-auto pt-10">
    <MCrud :fields="fields" route="http://192.168.190.69:9090/api/content-req-cat" />
    <AppAlert />
  </div>
</template>

<script setup>
import './../node_modules/formue/dist/style.css'
import AppAlert from '@/components/AppAlert.vue'
import MCrud from './components/MCrud.vue'
import { defineFields } from '@/helpers/formueCrud'

const fields = defineFields(({ get, getSafe }) => ({
  req_cat: {
    title: 'گروه',
    rel: false,
    type: 'text',
    isHeader: true,
    rules: 'required'
  },
  req_main_cat: {
    title: 'سرفصل',
    search: true,
    sendKey: "req_main_cat_id",
    clearOnSearch: true,
    trackBy: ['req_cat'],
    items: get({ url: 'http://192.168.190.69:9090/api/content-req-main-cat' }),
    type: 'select',
    delay: 500,
    object: true,
    filterResults: false,
    labelProp: 'req_cat',
    valueProp: 'id',
    native: false,
    isHeader: true,
    rules: 'required',
    formatter(cell, formatterParams, onRendered) {
      return getSafe(cell.getValue(), 'req_cat')
    }
  }
}))
</script>
