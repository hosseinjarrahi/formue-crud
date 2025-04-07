import { date } from '@/helpers/fields'
import { useLangsStore } from '@/stores/langStore'

export default () => {
  const store = useLangsStore()

  return {
    op: {
      placeholder: store.translate('operator'),
      columns: 4,
      items: [
        { value: '$eq', text: store.translate('equal_to') },
        { value: '$between', text: store.translate('between') },
        { value: '$gt', text: store.translate('greater_than') },
        { value: '$lt', text: store.translate('less_than') }
      ],
      labelProp: 'text',
      valueProp: 'value',
      native: false,
      type: 'select'
    },
    value: date({
      placeholder: store.translate('value'),
      columns: 4
    })
  }
}
