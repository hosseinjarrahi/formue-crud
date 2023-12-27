<template>
  <div class="w-1/2 mx-auto pt-10">
    <MCrud :fields="fields" route="http://192.168.190.69:9090/api/content-project-title" />
    <AppAlert />
  </div>
</template>

<script setup>
import './../node_modules/formue/dist/style.css'
import AppAlert from '@/components/AppAlert.vue'
import MCrud from './components/MCrud.vue'
import { select } from '@/helpers/fields'

const fields = ({ get }) => ({
  title: {
    title: 'عنوان',
    name: 'title',
    type: 'text',
    isHeader: true,
    rules: 'required'
  },
  main_project: select({
    title: 'کلان روند',
    name: 'main_project',
    items: get({ url: 'http://192.168.190.69:9090/api/content-main-project' }),
    onChange: (...args) => {
      const project = args[2].form$.el$('project')
      console.log('*******************')
      console.log(project.updateItems())
    },
    isHeader: true,
    labelProp: 'title',
    valueProp: 'id',
    // col: { md: 6 },
    rules: 'required'
  }),
  project: select({
    title: 'روند',
    items: get({ url: 'http://192.168.190.69:9090/api/content-project?main_project={main_project.id}' }),
    type: 'select',
    isHeader: true,
    labelProp: 'project',
    valueProp: 'id',
    // col: { md: 6 },
    rules: 'required'
  }),
  //  من اینو کامنت کردم چون ChartField نبود می خواستم ارورم بره
  // #transport-mamad
  // structure_id: {
  //   title: "جایگاه",
  //   component: ChartField,
  //   type: "text",
  //   col: { md: 12 },
  //   rules: "required",
  //   isHeader: true,
  //   inList(value, form) {
  //     return form?.structure?.name;
  //   },
  // },
  status: {
    title: 'وضعیت',
    rel: false,
    type: 'switcher',
    default: 1,
    isHeader: true,
    values: [
      { text: 'فعال', value: 1 },
      { text: 'غیر فعال', value: 0 }
    ],
    item_text: 'text',
    item_value: 'value'
  }

  // user_type: {
  //   title: "نوع کاربر",
  //   rel: false,
  //   type: "select",
  //   item_text: "name",
  //   item_value: "id",
  //   isHeader: true,
  //   // showIn: ["show"],
  //   // #transport-mamad
  //   // default: this.$auth?.user?.type_id?.id,
  // },
  // user: {
  //   title: "کاربر",
  //   rel: false,
  //   item_text: "name",
  //   item_value: "id",
  //   type: "select",
  //   isHeader: true,
  //   // showIn: ["show"],
  //   // #transport-mamad
  //   // default: this.$auth?.user?.id,
  // },
})
</script>
