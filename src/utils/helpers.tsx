export interface ObjectI {
  [key: string | number]: ObjectI | string | number | boolean | null | undefined
}

export const flattenObject = (obj: ObjectI, prefix = ''): ObjectI => {
  return Object.keys(obj).reduce((acc: ObjectI, key): ObjectI => {
    const value = obj[key]
    if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
      return { ...acc, ...flattenObject(value, `${prefix}${key}_`) }
    }

    return { ...acc, [`${prefix}${key}`]: value }
  }, {})
}
