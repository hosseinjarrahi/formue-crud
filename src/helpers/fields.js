import { get as getSafe } from 'lodash'

export const hasRel = (relWith) => {
  return {
    onChange: (...args) => {
      const el = args[2].form$.el$(relWith)
      el && 'clear' in el && el.clear()
      el && 'updateItems' in el && el.updateItems()
    }
  }
}

export const select = (items = {}) => ({
  search: true,
  clearOnSearch: true,
  type: 'select',
  delay: 1000,
  object: true,
  filterResults: false,
  native: false,
  formatter: (cell) => {
    return getSafe(cell.getValue(), getSafe(items, 'labelProp'))
  },
  ...items
})

export const normalSelect = (items = {}) => ({
  search: true,
  clearOnSearch: true,
  type: 'select',
  object: true,
  native: false,
  formatter: (cell) => {
    return getSafe(cell.getValue(), getSafe(items, 'labelProp'), cell.getValue())
  },
  ...items
})

export const multiSelect = (items = {}) => ({
  search: true,
  clearOnSearch: true,
  type: 'multiselect',
  delay: 1000,
  object: true,
  filterResults: false,
  native: false,
  formatter: (cell) => {
    return getSafe(cell.getValue(), getSafe(items, 'labelProp'))
  },
  ...items
})

export const tags = (items = {}) => ({
  search: true,
  clearOnSearch: true,
  type: 'tags',
  delay: 1000,
  object: true,
  filterResults: false,
  hideSelected: true,
  native: false,
  formatter: (cell) => {
    return getSafe(cell.getValue(), getSafe(items, 'labelProp'))
  },
  ...items
})

export const date = (items = {}) => ({
  type: 'date',
  ...items
})

export const group = (label, schema = {}) => ({
  addClass: ['bg-gray-100', 'p-4', 'rounded-lg', ''],
  type: 'group',
  label,
  schema
})

export const multiFile = (items = {}) => ({
  type: 'multifile',
  label: items?.title,
  placeholder: items?.title,
  drop: true,
  filename: 'name',
  url: 'http://192.168.190.69:9090/api/file/show',
  uploadTempEndpoint: 'http://192.168.190.69:9090/api/file/upload',
  accept: ['.jpg', '.png', '.gif', '.docx', '.txt', '.zip', '.rar'],
  sort: true,
  clickable: true,
  object: true,
  storeFile: 'hash',
  ...items
})

export default {
  normalSelect,
  multiSelect,
  multiFile,
  hasRel,
  select,
  group,
  tags,
  date
}
