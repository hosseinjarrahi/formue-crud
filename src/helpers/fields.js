import { get as getSafe } from 'lodash'

export const hasRel = (relWith) => {
  return {
    onChange: (...args) => {
      const project = args[2].form$.el$(relWith)
      project.clear()
      project.updateItems()
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
