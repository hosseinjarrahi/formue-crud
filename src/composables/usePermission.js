import { ref } from 'vue'

const permissions = ref([
  'create',
  'update',
  'delete',
  'show',
  'print',
  'importExcel',
  'exportExcel',
  'filter'
])

export function usePermission() {
  function setPermissions(hiddenActions) {
    permissions.value = permissions.value.filter((item) => !hiddenActions.includes(item))
  }

  function can(permission) {
    return permissions.value.includes(permission)
  }

  return { can, setPermissions, permissions }
}
