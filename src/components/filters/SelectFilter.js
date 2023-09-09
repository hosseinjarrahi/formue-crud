import { markRaw } from 'vue'
import SelectField from './../fields/SelectField.vue'
import InfinitySelectField from './../fields/InfinitySelectField.vue'

export default (field) => {
  return [
    {
      title: 'operator',
      field: 'op',
      groupAttr: { class: 'w-[32.5%]' },
      rel: {
        get: [
          { value: '=', text: 'equal_to' },
          { value: '!=', text: 'not_equal_to' }
        ],
        valueKey: 'value',
        textKey: 'text'
      },
      component: markRaw(SelectField)
    },
    {
      title: 'select',
      field: 'value',
      groupAttr: { class: 'w-[32.5%]' },
      component: markRaw(InfinitySelectField),
      rel: field.rel
    }
  ]
}
