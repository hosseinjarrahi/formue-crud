import { markRaw } from 'vue'
import SelectField from './../fields/SelectField.vue'
import TextField from './../fields/TextField.vue'

export default () => [
  {
    title: 'operator',
    field: 'op',
    groupAttr: { class: 'w-[32.5%]' },
    rel: {
      get: [
        { value: '=', text: 'equal_to' },
        { value: '!=', text: 'not_equal_to' },
        { value: '>', text: 'greater_than' },
        { value: '<', text: 'less_than' },
        { value: 'LIKE', text: 'look_like' }
      ],
      textKey: 'text',
      valueKey: 'value'
    },
    component: markRaw(SelectField)
  },
  {
    title: 'search',
    field: 'value',
    groupAttr: { class: 'w-[32.5%]' },
    component: markRaw(TextField)
  }
]
