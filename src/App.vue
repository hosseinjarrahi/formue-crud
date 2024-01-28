<template>
  <div class="w-1/2 mx-auto pt-10">
    <MCrud
      :fields="fields"
      route="http://192.168.190.69:9090/api/content-project-title"
    />
    <AppAlert />
  </div>
</template>

<script setup>
import './../node_modules/formue/dist/style.css'
import AppAlert from '@/components/AppAlert.vue'
import MCrud from './components/MCrud.vue'
import { select, hasRel } from '@/helpers/fields'

const fields = ({ get }) => ({
  title: {
    title: 'عنوان',
    type: 'text',
    isHeader: true,
    rules: 'required'
  },
  main_project: select({
    title: 'کلان روند',
    items: get({ url: 'http://192.168.190.69:9090/api/content-main-project' }),
    extendOptions: {
      limit: 15,
      infinite: true,
      options: async (x) => {
        console.log(x)
        console.log('object')
      }
    },
    isHeader: true,
    labelProp: 'title',
    valueProp: 'id',
    rules: 'required',
    ...hasRel('project')
  }),
  project: select({
    title: 'روند',
    items: get({
      url: 'http://192.168.190.69:9090/api/content-project',
      foreignKey: 'main_project',
      dataKey: 'main_project.id'
    }),
    filterItems: get({
      url: 'http://192.168.190.69:9090/api/content-project'
    }),
    type: 'select',
    isHeader: true,
    labelProp: 'project',
    valueProp: 'id',
    rules: 'required'
  }),
  status: {
    title: 'وضعیت',
    rel: false,
    type: 'date',
    default: 1,
    isHeader: true,
    values: [
      { text: 'فعال', value: 1 },
      { text: 'غیر فعال', value: 0 }
    ],
    item_text: 'text',
    item_value: 'value'
  }
})
</script>
