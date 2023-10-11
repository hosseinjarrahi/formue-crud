<template>
    <input v-model="isSelected" class="rounded" type="checkbox" @change="toggle" style="border:1px dashed rgba(0,0,0,.2)"/>
</template>

<script setup>
import { ref } from 'vue'
import { emitter } from 'formue'

const isSelected = ref(false)

const props = defineProps({
    data: {},
    index: {}
})

function toggle(data) {
    emitter.event('toggle.select', data.id)
}
</script>