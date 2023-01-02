import { ACTIVATED_DISTRICTS, facilityOptionsMap } from './constants'

export const parameterize = (word: string | undefined) => {
  if (!word) return ''
  return word.toLowerCase().replace(/ /g, '_')
}

export const humanize = (word: string) => {
  return capitalize(word.toLowerCase().replace(/_/g, ' '))
}

export const capitalize = (text: string) => {
  return text.replace(/\w\S*/g, (word) => {
    return word.replace(/^\w/, (c) => c.toUpperCase())
  })
}

export const getDistrictByName = (districtName: string | undefined) => {
  return (
    ACTIVATED_DISTRICTS.find(
      ({ name }) => parameterize(name) === parameterize(districtName)
    ) || {
      id: -1,
      name: 'None',
    }
  )
}

/* FUNCTION TO CREATE UNIQUE KEY FOR react-query */

export const createQueryKey = <T>(baseKey: string, query: T) => [baseKey, query]

export const getFacilityIds = (query?: string) =>
  query
    ?.split(',')
    .map((f) => f.trim())
    .filter((f) => Number.isInteger(+f)) || []

export const getFacilitiesFromQuery = (query?: string) => {
  const requiredFacilities = getFacilityIds(query).map(
    (id) => facilityOptionsMap[id]
  )

  return requiredFacilities
}
