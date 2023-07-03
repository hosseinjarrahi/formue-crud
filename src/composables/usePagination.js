import { reactive, ref } from 'vue'
import { get as getSafe } from 'lodash'
import { useStore } from './useStore.js'

const pagination = reactive({
  total: 0,
  currentPage: 1,
  lastPage: ''
})
const page = ref(1)

function reset() {
  Object.assign(pagination, {
    currentPage: 1,
    total: 0
  })
}

function paginate(page) {
  const { loadItem, mainKey } = useStore()

  loadItem(mainKey, page)
}

function setPagination(response) {
  const { mainKey } = useStore()

  pagination.total = getSafe(response, mainKey + '.total')
  pagination.currentPage = getSafe(response, mainKey + '.current_page')
  pagination.lastPage = getSafe(response, mainKey + '.last_page')
}

export function usePagination() {
  return { pagination, page, paginate, setPagination, reset }
}
