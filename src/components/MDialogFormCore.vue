<template>
  <card>
    <v-card-title class="pl-0 headline white--text py-1 secondary">
      <h6 v-if="!isEditing">{{ $fcTr('Add') }}</h6>
      <h6 v-else>{{ $fcTr('Edit') }}</h6>
      <v-spacer />
      <v-btn dark text @click="handleDialog(false)">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>

    <card-text class="py-3">
      <h1 class="text-center"><slot name="title"></slot></h1>
      <form ref="dynamicForm">
        <MForm :fields="filteredFields(fields)" :form="form" @updateField="updateField" />
      </form>
    </card-text>

    <v-divider></v-divider>

    <card-actions>
      <button
        :color="isEditing ? 'primary' : 'success'"
        small
        :loading="mainLoading"
        class="px-10"
        @click="event('saveForm')"
      >
        <span v-if="!isEditing"> {{ $fcTr('Save') }} </span>
        <span v-else> {{ $fcTr('Edit') }} </span>
      </button>
    </card-actions>
  </card>
</template>

<script>
import { MForm } from 'formue'

defineProps({
  valid: {},
  form: {},
  updateField: {},
  isEditing: {},
  handleDialog: {}
})
</script>
