<script setup>
import MCrud from './components/MCrud.vue'

const fields = ({ get, useFields: _ }) => ({
  city: _.select({
    title: 'شهر',
    items: get({
      url: '/_/map/city'
    }),
    labelProp: 'name',
    valueProp: 'id',
    isHeader: true,
    sendKey: 'city_id',
    columns: 6,
    test: {
      normalizer() {}
    }
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
    <MCrud :hiddenActions="[]" :fields="fields" route="http://localhost:9090/api/_/map/city" />
  </div>
</template>
