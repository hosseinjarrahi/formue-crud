import { watch } from 'vue'
import { setData, setColumns, makeHeaders } from '@/helpers/tabulator'
import arrowUp from '@/assets/arrow-up.svg'
import arrowDown from '@/assets/arrow-down.svg'

const arrows = {
  up: arrowUp,
  down: arrowDown
}

const makeArrow = (dir = 'up') => {
  const img = document.createElement('img')
  img.src = arrows[dir]
  img.style.width = '10px'
  img.style.height = '10px'
  img.style.marginLeft = '5px'
  return img
}

const appendArrow = (column, img) => {
  column._column.titleHolderElement.style.display = 'flex'
  column._column.titleHolderElement.style.alignItems = 'center'
  column._column.titleHolderElement.appendChild(img)
}

const deleteArrow = (column) => {
  column._column.titleHolderElement.lastChild.remove()
}

export function adaptor(store, table) {
  let sorters = []

  table.on('headerClick', (e, column) => {
    const field = column.getField()

    if (['_index_', '_select_'].includes(field)) return

    if (sorters.includes(field + ':asc')) {
      let pos = sorters.indexOf(field + ':asc')
      sorters[pos] = field + ':desc'
      deleteArrow(column)
      appendArrow(column, makeArrow('down'))
    } else if (sorters.includes(field + ':desc')) {
      let pos = sorters.indexOf(field + ':desc')
      sorters.splice(pos, 1)
      deleteArrow(column)
    } else {
      appendArrow(column, makeArrow())
      sorters.push(field + ':asc')
    }

    store.sorts = sorters

    store.loadItems()
  })

  watch(
    () => store.mainItems,
    (newItems) => {
      setData(newItems)
    },
    { immediate: true }
  )

  watch(
    () => store.flatFields,
    () => {
      setColumns(makeHeaders(store.headers))
    },
    { deep: true }
  )

  watch(
    () => store.loadings.mainLoading,
    (loading) => {
      if (loading) setData([])
    },
    { deep: true }
  )
}
