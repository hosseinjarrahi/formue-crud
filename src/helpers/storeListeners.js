import { emitter } from '@/helpers/emitter'

export default ({ listen, store }) => {
  emitter.listen('reloadData', () => {
    store.reloadData()
  })
}
