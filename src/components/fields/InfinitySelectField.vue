<template>
  <vSelect
    style="min-width: 89%"
    :options="filtered"
    :modelValue="getValues(value)"
    simple
    multiple
    :label="getFromSchema('rel.textKey')"
    :reduce="(item) => valueKey(item)"
    :filterable="false"
    @update:modelValue="updateField"
    @open="onOpen"
    @close="onClose"
    @search="doSearch"
  >
    <!-- <template v-slot:option="option">
      <span :class="option.icon"></span>
      {{ getSafe(option, getSafe(field, 'rel.textKey')) }}
    </template> -->
    <template #list-footer>
      <li v-show="hasNextPage" ref="load" class="loader">
        {{ $fcTr('Loading more options...') }}
      </li>
    </template>
  </vSelect>
</template>

<script>
import { get as getSafe, every, isType, debounce } from 'lodash'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import { propsField } from 'formue'

export default {
  components: { vSelect },

  props: propsField,

  inject: ['store'],

  data() {
    return {
      model: '',
      observer: null,
      search: ''
    }
  },

  computed: {
    items() {
      return this.store.getItems(this.model)
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
      return this.store.paginations[this.model] || { total: 0, currentPage: 0 }
    },
    hasNextPage() {
      return this.pagination?.total > this.pagination?.currentPage
    }
  },

  created() {
    this.model = this.store.addRoute(this.getFromSchema('rel.get'))
    this.store.loadItems(this.model)
  },

  mounted() {
    this.observer = new IntersectionObserver(this.infiniteScroll)
  },

  methods: {
    debounce,
    getSafe,
    checkGetIsArray() {
      const get = getFromSchema('rel.get')
      if (Array.isArray(Object.getPrototypeOf(get))) return true
      return false
    },
    areAllItemsOfType(array, type) {
      if (!Array.isArray(array)) return false

      return every(array, (item) => isType(item, type))
    },
    getValues(values) {
      if (this.areAllItemsOfType(values, 'object')) {
        return values.map((value) => value[this.getProp('valueKey', 'value')])
      }
      return values
    },
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
        this.store.loadItemsPlus(this.model, this.pagination.currentPage + 1, query, () => {
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
