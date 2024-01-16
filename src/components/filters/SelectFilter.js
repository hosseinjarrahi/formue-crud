import { tags } from '@/helpers/fields'
import { useLangsStore } from '@/stores/langStore'

export default (schema) => {
  const store = useLangsStore()

  return {
    op: {
      placeholder: store.translate('operator'),
      columns: 4,
      items: [
        { value: '$in', text: store.translate('in') },
        { value: '$notIn', text: store.translate('not_in') }
      ],
      labelProp: 'text',
      valueProp: 'value',
      native: false,
      type: 'select'
    },

    value: tags({
      placeholder: store.translate('value'),
      items: 'filterItems' in schema ? schema.filterItems : schema.items,
      search: true,
      columns: 4,
      labelProp: schema.labelProp,
      valueProp: schema.valueProp,
      object: false
    })
  }
}
