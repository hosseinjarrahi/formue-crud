import { watch } from 'vue'
import { setData, setColumns } from '@/helpers/tabulator'

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
      setColumns(store.headers)
    },
    { deep: true }
  )
}
