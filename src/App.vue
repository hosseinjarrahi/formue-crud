<template>
  <div class="w-1/2 mx-auto pt-10">
    <!-- <label
      class="nui-focus relative block h-9 w-9 shrink-0 overflow-hidden rounded-full transition-all duration-300 focus-visible:outline-2 dark:ring-offset-muted-900"
      ><input
        @click="toggleDark()"
        type="checkbox"
        class="absolute start-0 top-0 z-[2] h-full w-full cursor-pointer opacity-0"
      /><span
        class="relative block h-9 w-9 rounded-full bg-white dark:bg-muted-800 border border-muted-300 dark:border-muted-700"
      >
        <svg
          v-if="!isDark"
          aria-hidden="true"
          viewBox="0 0 24 24"
          class="pointer-events-none absolute start-1/2 top-1/2 block h-5 w-5 text-yellow-400 transition-all duration-300 -translate-y-1/2 translate-x-[50%] opacity-100 translate-x-[50%]"
        >
          <g fill="currentColor" stroke="currentColor" class="stroke-2">
            <circle cx="12" cy="12" r="5"></circle>
            <path
              d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
            ></path>
          </g>
        </svg>
        <svg
          v-if="isDark"
          aria-hidden="true"
          viewBox="0 0 24 24"
          class="pointer-events-none absolute start-1/2 top-1/2 block h-5 w-5 text-yellow-400 transition-all duration-300 translate-y-[-50%] translate-x-[45%]"
        >
          <path
            fill="currentColor"
            stroke="currentColor"
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
            class="stroke-2"
          ></path>
        </svg>
      </span>
    </label> -->
    <MCrud :fields="fields" route="http://192.168.190.10:9090/api/professor" />
    <AppAlert />
  </div>
</template>

<script setup>
import './../node_modules/formue/dist/style.css'
import AppAlert from '@/components/AppAlert.vue'
import MCrud from './components/MCrud.vue'
import { defineFields } from '@/helpers/formueCrud'

const fields = defineFields((_) => [
  {
    title: 'firstname',
    field: 'firstname',
    filter: 'date',
    isHeader: true,
    component: _('text')
  },
  {
    title: 'lastname',
    field: 'lastname',
    isHeader: true,
    filter: 'select',
    rel: {
      get: 'http://192.168.190.10:9090/api/lesson',
      key: 'Lesson',
      textKey: 'name',
      valueKey: 'id'
      // get: {
      //   immidate:false,
      //   route:'http://192.168.190.10:8000/api/professor',
      //   model:'Professor'
      // },
      // get: {
      //   immidate:false,
      //   handler(ft,store){
      //     ft.get('http://192.168.190.10:8000/api/professor')
      //     .then(res => store.items[model] = res.data))
      //   }
      // },
      // get: {
      //   immidate: false,
      //   handler(ft, set) {
      //     // fetch bby ft and then set data by set
      //   }
      // }
    },
    component: _('text')
  }
])

import { ref } from 'vue'
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
// import { useSidBarStore } from "../../stores/SidBarStore";
// import { computed } from "vue";

// const lightStore = useSidBarStore();

// function changeLightMode() {
//   lightStore.changeLightMode();
// }
// const light = computed(() => lightStore.light);
</script>
