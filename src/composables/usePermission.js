import { ref } from 'vue'

const allPermissions = [
  'create',
  'update',
  'delete',
  'show',
  'print',
  'importExcel',
  'exportExcel',
  'filter'
]

const permissions = ref([])

export function usePermission() {
  function setPermissions(hiddenActions) {
    permissions.value = allPermissions.value.filter((item) => !hiddenActions.includes(item))
  }

  function can(permission) {
    return permissions.value.includes(permission)
  }

  return { can, setPermissions, permissions }
}
