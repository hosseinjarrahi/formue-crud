import { defineStore } from 'pinia'
import { get as getSafe, has } from 'lodash'
import { useFetch } from './useFetch'
import { makeHeaders, convertToSendForm } from '@/helpers/formueCrud'
import { emitter } from 'formue'
import { pascalCase } from '@/helpers/common'
import axios from 'axios'

function getAllFields(obj) {
  let fields = []

  function traverse(obj) {
    for (let key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        if (
          !['schema', 'columns'].includes(key) &&
          !has(obj[key], 'schema') &&
          getSafe(obj[key], 'type') != 'group'
        ) {
          fields.push({ field: key, ...obj[key] })
        } else {
          traverse(obj[key])
        }
      }
    }
  }

  traverse(obj)
  return fields
}

// function addToAllFields(obj, objs) {
//   let fields = []

//   function traverse(obj) {
//     for (let key in obj) {
//       if (typeof obj[key] === 'object' && obj[key] !== null) {
//         if (
//           !['schema', 'columns'].includes(key) &&
//           !has(obj[key], 'schema') &&
//           getSafe(obj[key], 'type') != 'group'
//         ) {
//           fields.push({ field: key, ...obj[key], ...objs })
//         } else {
//           traverse(obj[key])
//         }
//       }
//     }
//   }

//   traverse(obj)
//   return fields
// }

const { event } = emitter

const defineDynamicStore = (storeName = 'myStore') => {
  return defineStore(storeName, {
    state: () => ({
      mainKey: '',
      form: {},
      items: {},
      routes: {},
      fields: [],
      options: [],
      filters: [],
      selected: [],
      loadings: {},
      structure: {},
      paginations: {},
      isEditing: false,
      panelName: false,
      hiddenActions: [],
      isFiltering: false
    }),

    getters: {
      getItems(state) {
        return (key) => getSafe(state.items, key, [])
      },

      getPaginations(state) {
        return (key) => getSafe(state.paginations, key, [])
      },

      mainItems(state) {
        return getSafe(state.items, state.mainKey, [])
      },

      mainPagination(state) {
        return this.getPaginations(state.mainKey)
      },

      mainRoute(state) {
        return getSafe(state.routes, state.mainKey, '')
      },

      flatFields(state) {
        let fields = getAllFields(state.fields)
        fields.unshift({
          title: '',
          type: 'hidden',
          value: '_select_',
          field: '_select_',
          align: 'center',
          headerSort: false
        })
        return fields
      },

      formFields(state) {
        return state.fields
      },

      flatFieldsWithoutActions() {
        return this.flatFields.filter(
          (field) => !['_actions_', '_index_', '_select_'].includes(field.field)
        )
      },

      headers() {
        return makeHeaders(this.flatFields)
      },

      headersWithoutActions() {
        return this.headers.filter(
          (header) => !['_actions_', '_index_', '_select_'].includes(header.field)
        )
      }
    },

    actions: {
      reset() {
        this.items = {}
        this.loadings = {}
        this.routes = {}
        this.options = []
      },

      setData(key, data) {
        this.items[key] = data
      },

      addData(newItem) {
        if (!Array.isArray(this.items[this.mainKey])) {
          this.items[this.mainKey] = []
        }
        this.items[this.mainKey] = [newItem, ...this.items[this.mainKey]]
      },

      editData(editItem) {
        let temp = this.items[this.mainKey]
        temp = temp.map((item) => {
          if (item.id == editItem.id) return { _index_: item['_index_'], ...editItem }
          return item
        })
        this.items[this.mainKey] = [...temp]
      },

      removeData(idToRemove) {
        let temp = this.items[this.mainKey]
        temp = temp.filter((item) => item.id != idToRemove)
        this.items[this.mainKey] = [...temp]
      },

      getModelKey(route) {
        let key = typeof route == 'string' ? route.substr(route.lastIndexOf('/') + 1) : route.key
        this.mainKey = this.mainKey || pascalCase(key) // should remove from here
        return pascalCase(key)
      },

      setPagination(response, key) {
        if (!(key in this.paginations))
          this.paginations[key] = {
            total: 0,
            currentPage: 0,
            lastPage: 0
          }

        this.paginations[key].total = getSafe(response, 'total')
        this.paginations[key].currentPage = getSafe(response, 'current_page')
        this.paginations[key].lastPage = getSafe(response, 'last_page')
      },

      paginate(page) {
        this.isFiltering ? this.getWithFilter(page) : this.loadItems(this.mainKey, page)
      },

      reloadData() {
        this.isFiltering ? this.getWithFilter() : this.loadItems()
      },

      loadItemsPlus(key = this.mainKey, page = 1, query = '', fn = () => {}, add = true) {
        let pageQuery = getSafe(this.routes, key, '').indexOf('?') > -1 ? '&page=' : '?page=' // to do : change routes structure

        this.loadings[key] = true

        const route = getSafe(this.routes, key, '') + pageQuery + page + '&' + query

        axios
          .get(route)
          .then((response) => {
            response = getSafe(response, 'data', {})

            if (!Array.isArray(this.items[key])) this.items[key] = []
            if (add) for (const item of response.data) this.items[key].push(item)
            else this.items[key] = response.data
            this.setPagination(response, key)
          })
          .finally(() => {
            fn()
            this.loadings[key] = false
          })
      },

      loadItems(key = this.mainKey, page = 1) {
        let pageQuery = getSafe(this.routes, key, '').indexOf('?') > -1 ? '&page=' : '?page=' // to do : change routes structure

        this.loadings[key] = true
        this.loadings.mainLoading = key === this.mainKey

        const route = getSafe(this.routes, key, '') + pageQuery + page

        axios
          .get(route)
          .then((response) => {
            response = getSafe(response, 'data', {})
            this.items[key] = getSafe(response, 'data')
            this.setPagination(response, key)
          })
          .finally(() => {
            this.loadings[key] = false
            this.loadings.mainLoading = false
          })
      },

      customLoadItems(key, page = 1, fn = () => ({})) {
        this.loadings[key] = true
        fn(
          (response) => {
            this.items[key] = response.data
            this.setPagination(response, key)
          },
          () => {},
          () => {
            this.loadings[key] = false
          },
          page
        )
      },

      getWithFilter(page = 1, itemPerPage = 15) {
        const filterURL = 'http://192.168.190.10:9090/api/filter'

        this.loadings.filter = true

        axios
          .post(`${filterURL}?page=${page}`, {
            model: this.mainKey,
            itemPerPage: itemPerPage,
            filters: this.filters
          })
          .then((response) => {
            response = getSafe(response, 'data', {})

            this.items[this.mainKey] = response.data
            this.setPagination(response, this.mainKey)
          })
          .finally(() => {
            this.loadings.filter = false
          })
      },

      addItem(data) {
        // let route = { value: false }

        // for (const field of flatFields.value) {
        //   if ('onSave' in field) {
        //     field.onSave(items[field.rel.model], payload, route)
        //   }
        // }

        this.loadings.mainLoading = true

        let route = this.routes[this.mainKey]

        let sendForm = convertToSendForm(data, this.flatFields)

        axios
          .post(route, sendForm)
          .then(async (response) => {
            response = getSafe(response, 'data', {})
            let newItems = getSafe(response, 'data')
            this.addData(newItems)
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
            this.loadings.mainLoading = false
          })
      },

      editItem(data) {
        let route = this.routes[this.mainKey].split('?')[0]

        let sendForm = convertToSendForm(data, this.flatFields)

        this.loadings.mainLoading = true

        axios
          .patch(route + '/' + data.id, sendForm)
          .then(async (response) => {
            response = getSafe(response, 'data', {})
            const editedItem = getSafe(response, 'data', {})
            this.editData(editedItem)
            event('alert', { text: 'با موفقیت ویرایش شد', color: 'green' })
            event('handleDialogForm', false)
          })
          .catch((error) => {
            event('alert', {
              text: getSafe(error, 'response.message'),
              color: 'red'
            })
          })
          .finally(() => {
            this.loadings.mainLoading = false
          })
      },

      remove(deleteId) {
        const deleteIds = Array.isArray(deleteId) ? deleteId : [deleteId]

        let route = this.routes[this.mainKey].split('?')[0]

        this.loadings.mainLoading = true

        deleteIds.forEach((item) => {
          axios
            .delete(route + '/' + item)
            .then(() => {
              event('alert', {
                text: 'با موفقیت حذف شد',
                color: 'green'
              })
              event('handleDeleteDialog', false)
              this.removeData(deleteId)
            })
            .catch((error) => {
              event('alert', {
                text: getSafe(error, 'response.data.message'),
                color: 'red'
              })
            })
            .finally(() => {
              this.loadings.mainLoading = false
            })
        })
      }
    }
  })
}

export const useDynamicStore = (name) => {
  const dynamicStore = defineDynamicStore(name)

  return dynamicStore()
}
