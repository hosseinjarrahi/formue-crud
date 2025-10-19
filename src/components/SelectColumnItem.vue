<template>
  <div
    class="flex items-center gap-3 relative hover:bg-muted-200 dark:hover:bg-muted-700 rounded-lg px-5 pl-3 rtl:pl-8 rtl:pr-5 py-2 duration-300"
  >
    <div
      class="nui-focus block focus-within:outline-current rounded-full"
      :class="JSON.parse(checked) ? 'is-checked' : 'is-unchecked'"
    >
      <input
        :modelValue="checked"
        type="checkbox"
        class="peer cursor-pointer disabled:cursor-not-allowed"
        true-value="true"
        false-value="false"
        @click="$emit('toggle')"
      />
      <label class="text-success-500 peer-disabled:opacity-75">
        <div
          class="rtl:left-[auto] rtl:!right-0 ltr:right-[auto] ltr:left-0"
          :class="JSON.parse(checked) ? 'is-opaque' : ''"
        ></div>
        <svg aria-hidden="true" viewBox="0 0 52 52" data-v-3e8a7b5f="">
          <circle cx="26" cy="26" r="25" fill="none" stroke="currentColor"></circle>
          <path fill="none" stroke="currentColor" d="m14.1 27.2 7.1 7.2 16.7-16.8"></path>
        </svg>
      </label>
    </div>
    <div>
      <h6 class="font-heading text-muted-800 text-xs font-semibold leading-tight dark:text-white">
        {{ columnName }}
      </h6>
      <!-- <p class="text-muted-400 font-sans text-xs">default</p> -->
    </div>
  </div>
</template>

<script setup>
defineProps({
  checked: { default: false },
  columnName: { default: '' }
})
</script>
