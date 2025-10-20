<script setup>
import MCrud from './components/MCrud.vue'

const fields = ({ get, useFields: _ }) => ({
  name: ({
    title: 'شهر',
    type: 'text',
    isHeader: true,
    sendKey: 'city_id',
    columns: 6,
  }),

  coordinates: {
    title: 'مختصات جغرافیایی',
    type: 'map',
    mapProps: {
      justOneMarker: true
    },
    isHeader: true
  }
})
</script>

<template>
  <div class="w-10/12 mx-auto pt-10">
    <MCrud :hiddenActions="[]" :fields="fields"
      route="http://localhost:3000/proxy/api/_/world/city?page=1&sort[0]=id%3Adesc" />
  </div>
</template>
