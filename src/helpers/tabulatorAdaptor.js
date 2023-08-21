import { watch } from 'vue'
import { setData } from '@/helpers/tabulator'

export function adaptor(store) {
  watch(
    () => store.mainItems,
    (newItems) => {
      setData(newItems)
    }
  )
}
