import { get as getSafe, every, isType } from 'lodash'

function areAllItemsOfType(array, type) {
  if (!Array.isArray(array)) return false

  return every(array, (item) => isType(item, type))
}

const selectNormalizer = (field, data) => {
  const fieldName = getSafe(field, 'field')
  const valueProp = getSafe(field, 'valueProp')

  if (areAllItemsOfType(data, 'object')) {
    return data.map((value) => getSafe(value, valueProp))
  }

  return getSafe(data, fieldName)
  // getSafe(data, fieldName + '.id')
}

const defaultNormalizer = (field, data) => {
  return getSafe(data, field.field)
}

const mapNormalizer = {
  select: selectNormalizer,
  text: defaultNormalizer
}

function findNormalizers(obj, path = '', result = {}) {
  for (const key in obj) {
    const value = obj[key]
    const currentPath = path ? `${path}.${key}` : key

    if (typeof value === 'object' && value !== null) {
      if (typeof value.normalizer === 'function') {
        result.value = value.normalizer
      }
      findNormalizers(value, currentPath, result)
    }
  }
  return result
}

export default (field, data) => {
  if (typeof field.normalizer === 'function') {
    return field.normalizer(data)
  }

  const normalizer = findNormalizers(field)
  if (typeof normalizer.value === 'function') {
    return normalizer.value(data)
  }

  const normlizerFunction = mapNormalizer[field.type]

  if (!normlizerFunction) return defaultNormalizer(field, data)

  return normlizerFunction(field, data)
}
