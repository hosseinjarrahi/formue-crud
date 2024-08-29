import { ref } from 'vue'

export function usePermission() {
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

  function setPermissions(hiddenActions) {
    permissions.value = permissions.value.filter((item) => !hiddenActions.includes(item))
  }

  function can(permission) {
    return permissions.value.includes(permission)
  }

  return { can, setPermissions, permissions }
}
