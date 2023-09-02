import { markRaw } from 'vue'
import DateField from './../fields/DateField.vue'
import SelectField from './../fields/SelectField.vue'

export default () => [
  {
    title: 'operator',
    field: 'op',
    groupAttr: { class: 'w-[32.5%]' },
    rel: {
      get: [
        { value: '=', text: 'equal_to' },
        { value: '<>', text: 'range' },
        { value: '>', text: 'greater_than' },
        { value: '<', text: 'less_than' }
      ]
    },
    component: markRaw(SelectField)
  },
  {
    title: 'search',
    field: 'value',
    groupAttr: { class: 'w-[32.5%]' },
    dynamicProps(props) {
      return { range: props.form.op === '<>' }
    },
    component: markRaw(DateField)
  }
]
