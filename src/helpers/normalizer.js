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

export default (field, data) => {
  if (field.normalizer) {
    return field.normalizer(data)
  }
  const normlizerFunction = mapNormalizer[field.type]

  if (!normlizerFunction) return defaultNormalizer(field, data)

  return normlizerFunction(field, data)
}
