import '@/assets/main.css'
import '@/assets/tabulator.css'
import install from './install'
import fields from '@/helpers/fields'
import MCrud from '@/components/MCrud.vue'
import { setEmitter } from '@/helpers/emitter'
import { registerFields } from '@/helpers/formueCrud'
import ActionButton from '@/components/ActionButton.vue'

export { MCrud, setEmitter, registerFields, install, fields, ActionButton }
