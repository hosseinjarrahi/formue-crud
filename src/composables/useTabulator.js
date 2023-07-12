import { createApp } from 'vue'
import { TabulatorFull as Tabulator } from 'tabulator-tables' //import Tabulator library
import { useStore } from './useStore'

let tableInstance

const initTable = (
  { element, headers, data } = {
    element: null,
    headers: [],
    data: []
  }
) => {
  const { mainRoute } = useStore()

  tableInstance = new Tabulator(element, {
    pagination: true,
    paginationMode: 'remote',
    ajaxURL: mainRoute.value,
    // ajaxParams: { token: 'ABC123' },
    paginationSize: 5,
    paginationInitialPage: 1,
    paginationSizeSelector: [3, 6, 8, 10],
    paginationCounter: 'rows',
    ajaxLoaderLoading:
      "<div style='display:inline-block; border:4px solid #333; border-radius:10px; background:#fff; font-weight:bold; font-size:16px; color:#000; padding:10px 20px;'>Loading Data</div>",

    data,
    columns: headers
  })

  setTimeout(() => {
    tableInstance.setData()
  })

  return tableInstance
}

export function updateRowNumber(cell) {
  var pageNumber = tableInstance.getPage()
  var pageSize = tableInstance.getPageSize()
  var index = cell.getRow().getPosition(true) + (pageNumber - 1) * pageSize
  return index
}

export function actions(cell, formatterParams) {
  const data = cell.getRow().getData()
  const index = cell.getRow().getPosition()
  const el = document.createElement('div')
  const Component = formatterParams.component
  const app = createApp(Component, { data, index })
  app.mount(el)
  return el
}

export function addData(items) {
  tableInstance
    .addData(items, true)
    .then(function (rows) {
      //rows - array of the row components for the rows updated or added
      //run code after data has been updated
    })
    .catch(function (error) {
      //handle error updating data
    })
}

export function editData(item) {
  tableInstance.updateData([item])
}

export function removeData(itemIds) {
  tableInstance.deleteRow(itemIds)
}

export function useTabulator() {
  return {
    initTable,
    tableInstance,
    addData,
    actions,
    editData,
    removeData
  }
}
