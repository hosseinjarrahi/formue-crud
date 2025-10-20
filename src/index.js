import '@/assets/main.css'
import '@/assets/tabulator.css'
import install from './install'
import fields from '@/helpers/fields'
import MCrud from '@/components/MCrud.vue'
import { setEmitter, emitter } from '@/helpers/emitter'
import { registerFields } from '@/helpers/formueCrud'
import ActionButton from '@/components/ActionButton.vue'

export { MCrud, setEmitter, emitter, registerFields, install, fields, ActionButton }
