<template>
  <v-text-field
    :modelValue="value"
    variant="outlined"
    density="compact"
    rounded
    hide-details="auto"
    label="select date"
    class="custom-input"
    placeholder="select date"
    v-bind="getFromSchema('dynamicProps', false) ? getFromSchema('dynamicProps')(props) : {}"
  ></v-text-field>
  <date-picker
    locale="en,fa"
    :modelValue="value"
    :range="value === '<>'"
    simple
    @update:modelValue="updateField"
    v-bind="getFromSchema('dynamicProps', false) ? getFromSchema('dynamicProps')(props) : {}"
    format="YYYY-MM-DD"
    display-format="jYYYY-jMM-jDD"
    custom-input=".custom-input"
  />
</template>

<script setup>
import DatePicker from 'vue3-persian-datetime-picker'
import { VTextField } from 'vuetify/components/VTextField'

import { propsField } from 'formue'

const props = defineProps(propsField)
</script>

<style scoped>
input {
  border: 1px solid black;
}
</style>
