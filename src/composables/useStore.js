import { reactive, ref, computed } from 'vue'
import { get as getSafe } from 'lodash'
import { pascalCase } from './useHelper'
import { useEmitter } from 'formue'
import { useLoading } from './useLoading'
import { usePagination } from './usePagination'
import { useFields } from './useFields'
import { useFetch } from './useFetch'
import { useTabulator } from './useTabulator'

const { setPagination } = usePagination()
const { listen, event } = useEmitter()
const { loadings } = useLoading()
const ft = useFetch()

const items = reactive({})
const mainKey = ref(false)
const isEditing = false
let routes = {}
let hiddenActions = reactive([])
let relationsFetched = false

const mainItem = computed(() => {
  return getSafe(items, mainKey?.value, [])
})

const mainRoute = computed(() => {
  return getSafe(routes, mainKey?.value, '')
})

function reset() {
  Object.assign(items, {})
  routes = {}
  mainKey.value = false
  hiddenActions.splice(0)
  // backup = false
}

function addRoute(payload) {
  const key =
    typeof payload == 'string' ? payload.substr(payload.lastIndexOf('/') + 1) : payload.key

  const standardKey = pascalCase(key)

  mainKey.value = mainKey.value || standardKey

  routes[standardKey] = typeof payload == 'string' ? payload : getSafe(payload, 'route')

  return routes[standardKey]
}

function loadItem(key, page = 1, all = false) {
  let query = all ? 'all=true' : ''
  let pageQuery = getSafe(routes, key, '').indexOf('?') > -1 ? '&page=' : '?page=' // to do : change routes structure

  loadings[key] = true

  const route = getSafe(routes, key, '') + pageQuery + page + '&' + query

  ft.get(route)
    .then((response) => response.json())
    .then((response) => {
      setData(key, response.data)
      console.log(items)
      if (key === mainKey.value) {
        setPagination(response)

        !relationsFetched && event('readyToFetchRelations')
        relationsFetched = true
      }
    })
    .finally(() => {
      loadings[key] = false
    })
}

function loadRelations(relations) {
  for (const relation of relations) addRoute(relation)

  listen('readyToFetchRelations', () => {
    // to do : add load attr to routes to findout which route downloaded and here download not loaded routes
  })
}

function setData(key, data) {
  items[key] = data
}

function addData(payload) {
  const { addData: addToTable } = useTabulator()
  addToTable(payload)
}

function getItem(key, defaultValue = []) {
  return getSafe(items, key, defaultValue)
}

function add(payload) {
  const { flatFields, convertToSendForm } = useFields()

  let route = { value: false }

  for (const field of flatFields.value) {
    if ('onSave' in field) {
      field.onSave(items[field.rel.model], payload, route)
    }
  }

  loadings[mainKey.value] = true

  route = route.value || routes[mainKey.value]

  let sendForm = convertToSendForm(payload)

  ft.post(route, sendForm)
    .then(async (response) => {
      let newItems = await response.json()
      addData(newItems)
      event('alert', { text: 'با موفقیت ثبت شد', color: 'green' })
      event('handleDialogForm', false)
    })
    .catch((error) => {
      event('alert', {
        text: getSafe(error, 'response.message'),
        color: 'red'
      })
    })
    .finally(() => {
      loadings[mainKey.value] = false
    })
}

function edit(payload) {
  const data = payload.value
  const { convertToSendForm } = useFields()
  const { editData } = useTabulator()

  let route = routes[mainKey.value].split('?')[0]

  let sendForm = convertToSendForm(data)

  ft.patch(route + '/' + data.id, sendForm)
    .then(async (response) => {
      let editedItem = await response.json()
      editData(editedItem)
      event('alert', { text: 'با موفقیت ویرایش شد', color: 'green' })
      event('handleDialogForm', false)
    })
    .catch((error) => {
      event('alert', {
        text: getSafe(error, 'response.message'),
        color: 'red'
      })
    })
    .finally(() => {})
}

function remove({ deleteId, indexToRemove }) {
  const { removeData } = useTabulator()

  const deleteIds = Array.isArray(deleteId) ? deleteId : [deleteId]

  let route = routes[mainKey.value].split('?')[0]

  deleteIds.forEach((item, index) => {
    ft.remove(route + '/' + item)
      .then(() => {
        event('alert', {
          text: 'با موفقیت حذف شد',
          color: 'green'
        })
        event('handleDeleteDialog', false)
        removeData(indexToRemove)
      })
      .catch((error) => {
        event('alert', {
          text: getSafe(error, 'response.data.message'),
          color: 'red'
        })
      })
      .finally(() => {})
  })
}

const useStore = () => {
  return {
    add,
    edit,
    reset,
    items,
    remove,
    routes,
    mainKey,
    getItem,
    addRoute,
    loadItem,
    mainItem,
    mainRoute,
    isEditing,
    loadRelations,
    hiddenActions
  }
}

export { useStore }
