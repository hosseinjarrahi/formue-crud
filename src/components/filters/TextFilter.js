export default () => ({
  op: {
    title: 'operator',
    columns: 4,
    items: [
      { value: '$eq', text: 'equal_to' },
      { value: '$ne', text: 'not_equal_to' },
      { value: '$gt', text: 'greater_than' },
      { value: '$lt', text: 'less_than' },
      { value: '$contains', text: 'look_like' }
    ],
    'label-prop': 'text',
    'value-prop': 'value',
    type: 'select'
  },
  value: {
    title: 'search',
    groupAttr: { class: 'w-[32.5%]' },
    type: 'text',
    columns: 4,
  }
})
