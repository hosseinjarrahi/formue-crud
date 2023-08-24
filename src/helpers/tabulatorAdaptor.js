import { watch } from 'vue'
import { setData, setColumns, makeHeaders } from '@/helpers/tabulator'

export function adaptor(store) {
  watch(
    () => store.mainItems,
    (newItems) => {
      setData(newItems)
    }
  )

  watch(
    () => store.flatFields,
    () => {
      setColumns(makeHeaders(store.headers))
    },
    { deep: true }
  )
}
