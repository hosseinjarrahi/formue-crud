import { defineStore } from 'pinia'
import { get as getSafe, has } from 'lodash'
import { useFetch } from './useFetch'
import { makeHeaders, convertToSendForm } from '@/helpers/formueCrud'
import { emitter } from 'formue'
import { pascalCase } from '@/helpers/common'

const { event } = emitter

const defineDynamicStore = () => {
  return defineStore('myStore', {
    state: () => ({
      mainKey: '',
      routes: {},
      items: {},
      loadings: {},
      isEditing: false,
      fields: [],
      paginations: {},
      options: [],
      filters: {},
      isFiltering: false,
      hiddenActions: [],
      panelName: false
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
        if (!Array.isArray(state.fields)) {
          return []
        }
        return state.fields.map((field) => {
          if (has(field, 'groupLabel')) {
            return field.items
          }
          return field
        })
      },

      headers() {
        return makeHeaders(this.flatFields)
      },

      headersWithoutActions() {
        return this.headers.filter((header) => !['_actions_', '_index_'].includes(header.field))
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
        this.items[this.mainKey].push(newItem)
      },

      editData(editItem) {
        let temp = this.items[this.mainKey]
        temp = temp.map((item) => {
          if (item.id == editItem.id) return editItem
          return item
        })
        this.items[this.mainKey] = [...temp]
      },

      removeData(idToRemove) {
        let temp = this.items[this.mainKey]
        temp = temp.filter((item) => item.id != idToRemove)
        this.items[this.mainKey] = [...temp]
      },

      addRoute(route) {
        let key = typeof route == 'string' ? route.substr(route.lastIndexOf('/') + 1) : route.key
        this.mainKey = this.mainKey || pascalCase(key)
        this.routes[pascalCase(key)] = typeof route == 'string' ? route : route.route
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

      loadItems(key = this.mainKey, page = 1) {
        const { get } = useFetch()

        let pageQuery = getSafe(this.routes, key, '').indexOf('?') > -1 ? '&page=' : '?page=' // to do : change routes structure

        this.loadings[key] = true

        const route = getSafe(this.routes, key, '') + pageQuery + page

        get(route)
          .then((response) => response.json())
          .then((response) => {
            this.items[key] = response.data
            this.setPagination(response, key)
          })
          .finally(() => {
            this.loadings[key] = false
          })
      },

      getWithFilter(page = 1, itemPerPage = 15) {
        const { post } = useFetch()

        const filterURL = 'http://127.0.0.1:8000/api/filter'

        this.loadings.filter = true

        post(`${filterURL}?page=${page}`, {
          model: this.mainKey,
          itemPerPage: itemPerPage,
          filters: this.filters
        })
          .then((response) => response.json())
          .then((response) => {
            this.items[this.mainKey] = response.data
            this.setPagination(response, this.mainKey)
          })
          .finally(() => {
            this.loadings.filter = false
          })
      },

      addItem(data) {
        data = data.value

        const { post } = useFetch()

        // let route = { value: false }

        // for (const field of flatFields.value) {
        //   if ('onSave' in field) {
        //     field.onSave(items[field.rel.model], payload, route)
        //   }
        // }

        this.loadings.mainLoading = true

        let route = this.routes[this.mainKey]

        let sendForm = convertToSendForm(data, this.flatFields)

        post(route, sendForm)
          .then(async (response) => {
            let newItems = await response.json()
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
        data = data.value

        const { patch } = useFetch()

        let route = this.routes[this.mainKey].split('?')[0]

        let sendForm = convertToSendForm(data, this.flatFields)

        this.loadings.mainLoading = true

        patch(route + '/' + data.id, sendForm)
          .then(async (response) => {
            let editedItem = await response.json()
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
        const { remove } = useFetch()

        const deleteIds = Array.isArray(deleteId) ? deleteId : [deleteId]

        let route = this.routes[this.mainKey].split('?')[0]

        this.loadings.mainLoading = true

        deleteIds.forEach((item) => {
          remove(route + '/' + item)
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
