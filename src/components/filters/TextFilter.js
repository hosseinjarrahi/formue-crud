import { useLangsStore } from '@/stores/langStore'

export default () => {
  const store = useLangsStore()

  return {
    op: {
      placeholder: store.translate('operator'),
      columns: 4,
      items: [
        { value: '$eq', text: store.translate('equal_to') },
        { value: '$ne', text: store.translate('not_equal_to') },
        { value: '$gt', text: store.translate('greater_than') },
        { value: '$lt', text: store.translate('less_than') },
        { value: '$contains', text: store.translate('look_like') }
      ],
      'label-prop': 'text',
      'value-prop': 'value',
      native: false,
      type: 'select'
    },
    value: {
      placeholder: store.translate('value'),
      type: 'text',
      columns: 4
    }
  }
}
