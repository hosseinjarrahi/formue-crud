<template>
  <vSelect
    style="min-width: 89%"
    :options="filtered"
    :modelValue="getSafe(this.filterValue, 'value')"
    simple
    multiple
    :label="getSafe(field, 'rel.textKey')"
    :reduce="(item) => valueKey(item)"
    @update:modelValue="updateValue"
    :filterable="false"
    @open="onOpen"
    @close="onClose"
    @search="doSearch"
  >
    <!-- <template v-slot:option="option">
      <span :class="option.icon"></span>
      {{ getSafe(option, getSafe(field, 'rel.textKey')) }}
    </template> -->
    <template #list-footer>
      <li v-show="hasNextPage" ref="load" class="loader">{{ $fcTr('Loading more options...') }}</li>
    </template>
  </vSelect>

  <button
    class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mx-2"
    @click="clear"
  >
    {{ $fcTr('clear') }}
  </button>
</template>

<script>
import { get as getSafe, debounce } from 'lodash'
import AbstractFilter from './AbstractFilter.vue'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

export default {
  extends: AbstractFilter,

  components: { vSelect },

  inject: ['store'],

  data: () => ({
    key: '',
    observer: null,
    search: ''
  }),

  computed: {
    items() {
      return this.store.getItems(this.key)
    },
    filtered() {
      if (this.search === '') return this.items

      return this.items.filter((item) => {
        try {
          console.log(this.textKey(item).contains(this.search))
          return this.textKey(item).contains(this.search)
        } catch (e) {
          return false
        }
      })
    },
    pagination() {
      return this.store.paginations[this.key] || { total: 0, currentPage: 0 }
    },
    hasNextPage() {
      return this.pagination?.total > this.pagination?.currentPage
    }
  },

  created() {
    this.key = this.store.addRoute(getSafe(this.field, 'rel.get'))
    this.store.loadItems(this.key)
  },

  mounted() {
    this.observer = new IntersectionObserver(this.infiniteScroll)
  },

  methods: {
    debounce,
    doSearch(query) {
      this.search = query
    },
    valueKey(item) {
      return getSafe(item, getSafe(this.field, 'rel.valueKey'))
    },
    textKey(item) {
      return getSafe(item, getSafe(this.field, 'rel.textKey'))
    },
    updateValue(value) {
      this.updateFilter({
        value,
        field: 'select'
      })
    },
    async onOpen() {
      if (this.hasNextPage) {
        await this.$nextTick()
        this.observer.observe(this.$refs.load)
      }
    },
    onClose() {
      this.observer.disconnect()
    },
    async infiniteScroll([{ isIntersecting, target }]) {
      if (isIntersecting) {
        const ul = target.offsetParent
        const scrollTop = ul.scrollTop
        const fieldToSearch = getSafe(this.field, 'rel.textKey')
        const query = this.search !== '' ? fieldToSearch + '=' + this.search : ''
        this.store.loadItemsPlus(this.key, this.pagination.currentPage + 1, query, () => {
          ul.scrollTo({ top: scrollTop, behavior: 'auto' })
        })
      }
    }
  }
}
</script>

<style scoped>
input {
  border: 1px solid black;
}
.loader {
  text-align: center;
  color: #bbbbbb;
}
</style>
