import { useLangsStore } from '@/stores/langStore'
import { delay } from 'lodash'

export default () => {
  const store = useLangsStore()

  return {
    op: {
      placeholder: store.translate('operator'),
      columns: 4,
      items: [
        { value: '$notNull', text: store.translate('not_null') },
        { value: '$null', text: store.translate('null') }
      ],
      labelProp: 'text',
      valueProp: 'value',
      native: false,
      type: 'select'
    },
    value: {
      type: 'hidden',
      default: true,
      columns: 4
    }
  }
}
