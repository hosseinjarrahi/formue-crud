<template>
  <MCrud />
</template>

<script setup>
import MCrud from "./components/MCrud.vue";
import { useCrud } from "./composables/useMCrud";

const { init } = useCrud();

init({
  mainRoute: "http://127.0.0.1:8000/api/test",
  
  fields: [
    {
      title: "Name",
      field: "name",
      type: "text",
      placeholder: "Enter name",
      isHeader: true,
    },
    {
      title: "Email",
      field: "email",
      type: "email",
      placeholder: "Enter email",
      isHeader: true,
    },
    {
      title: "Phone",
      field: "phone",
      type: "number",
      placeholder: "Enter phone",
      isHeader: true,
    },
    {
      title: "Address",
      field: "address",
      type: "text",
      placeholder: "Enter address",
      isHeader: true,
    },
  ],
});
</script>
