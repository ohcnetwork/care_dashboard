import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import minMax from 'dayjs/plugin/minMax'

import {
  cloneDeep,
  every,
  filter,
  forEach,
  includes,
  keyBy,
  keys,
  map,
  omit,
  reduce,
  values,
} from 'lodash-es'
import {
  FacilitySummaryResponse,
  Inventory,
} from '../../api/queries/useFacilitySummary'
import { toDateString } from '../date'
import {
  AVAILABILITY_TYPES,
  AVAILABILITY_TYPES_ORDERED,
  AVAILABILITY_TYPES_TOTAL_ORDERED,
  COVID_BEDS,
  GOVT_FACILITY_TYPES,
  INITIAL_FACILITIES_TRIVIA,
  NON_COVID_BEDS,
  OXYGEN_INVENTORY,
} from '../constants'

// Extend Day js plugin
dayjs.extend(relativeTime)
dayjs.extend(minMax)

export const InventoryTimeToEmpty = (inventoryItem?: Inventory) =>
  inventoryItem &&
  inventoryItem.stock &&
  inventoryItem.burn_rate &&
  inventoryItem.burn_rate !== undefined &&
  Math.round(inventoryItem.burn_rate ?? 0) !== 0
    ? Number((inventoryItem?.stock / inventoryItem?.burn_rate).toFixed(2))
    : -1

const additionalData = ({
  availability,
  ...data
}: FacilitySummaryResponse['data']) => {
  if (!availability) return { availability, ...data }

  const capacity = keyBy(availability, (d) => d.room_type)

  const omitKeys = [
    'modified_date',
    'id',
    'name',
    'address',
    'facility_type',
    'location',
    'phone_number',
    'inventory',
  ] as const

  return omit(
    {
      ...data,
      oxygen_capacity: data.oxygen_capacity ?? null,
      type_b_cylinders: data.type_b_cylinders ?? null,
      type_c_cylinders: data.type_c_cylinders ?? null,
      type_d_cylinders: data.type_d_cylinders ?? null,
      expected_oxygen_requirement: data.expected_oxygen_requirement ?? null,
      expected_type_b_cylinders: data.expected_type_b_cylinders ?? null,
      expected_type_c_cylinders: data.expected_type_c_cylinders ?? null,
      expected_type_d_cylinders: data.expected_type_d_cylinders ?? null,
      actual_discharged_patients: data.actual_discharged_patients ?? null,
      actual_live_patients: data.actual_live_patients ?? null,
      tte_tank: InventoryTimeToEmpty(
        data?.inventory?.[OXYGEN_INVENTORY.liquid]
      ),
      tte_d_cylinders: InventoryTimeToEmpty(
        data?.inventory?.[OXYGEN_INVENTORY.liquid]
      ),
      tte_c_cylinders: InventoryTimeToEmpty(
        data?.inventory?.[OXYGEN_INVENTORY.liquid]
      ),
      tte_b_cylinders: InventoryTimeToEmpty(
        data?.inventory?.[OXYGEN_INVENTORY.liquid]
      ),
      capacity,
    },
    omitKeys
  )
}

export const processFacilityData = (
  facilitiesSummary?: FacilitySummaryResponse[],
  filterFacilities?: string[]
) => {
  const cleanFacilityData = filter(facilitiesSummary, (f) => !!f.facility)
  const facilityData = map(cleanFacilityData, (d) => {
    const { created_date, data, facility, modified_date } = d

    const modifiedDayJsDate = data?.availability?.length
      ? dayjs.max(...map(data.availability, (a) => dayjs(a.modified_date)))
      : dayjs(data.modified_date || modified_date)

    const inventoryModifiedDayJsDate = data.inventory?.length
      ? dayjs.max(...values(data.inventory).map((a) => dayjs(a.modified_date)))
      : dayjs(data.modified_date || modified_date)

    const inventory_modified_date =
      toDateString(inventoryModifiedDayJsDate?.toDate()) || null

    const modified_date_format =
      toDateString(modifiedDayJsDate?.toDate()) || null

    return {
      id: facility.id || null,
      date: toDateString(new Date(created_date)),
      name: facility.name || null,
      address: facility.address || null,
      district_id: facility.district || null,
      facility_type: facility.facility_type || 'Unknown',
      location: facility.location || null,
      phone_number: facility.phone_number || null,
      inventory: data.inventory || null,
      modified_date: modified_date_format,
      inventory_modified_date,
      ...additionalData(data),
    }
  })

  const data = filterFacilities?.length
    ? filter(facilityData, (f) => includes(filterFacilities, f.facility_type))
    : facilityData

  return data
}

export const processFacilityTrivia = (
  facility: ReturnType<typeof processFacilityData>,
  filterDate?: string
) => {
  const initial = {
    current: cloneDeep(INITIAL_FACILITIES_TRIVIA),
    previous: cloneDeep(INITIAL_FACILITIES_TRIVIA),
  }
  const getKey = (date: string) =>
    date === (filterDate || toDateString(new Date())) ? 'current' : 'previous'

  const data = reduce(
    facility,
    (a, c) => {
      const curKey = getKey(c.date)

      a[curKey].count += 1
      a[curKey].oxygen += c.oxygen_capacity || 0
      a[curKey].actualLivePatients += c.actual_live_patients || 0
      a[curKey].actualDischargedPatients += c.actual_discharged_patients || 0

      const availabilityTypeKeys = keys(
        AVAILABILITY_TYPES
      ) as (keyof typeof AVAILABILITY_TYPES)[]

      forEach(availabilityTypeKeys, (val) => {
        a[curKey][val].used +=
          Number(c.capacity && c.capacity[val]?.current_capacity) || 0
        a[curKey][val].total +=
          Number(c.capacity && c.capacity[val]?.total_capacity) || 0
      })

      forEach(AVAILABILITY_TYPES_TOTAL_ORDERED, (k) => {
        const current_covid =
          Number(c.capacity?.[k.covid]?.current_capacity) || 0
        const current_non_covid =
          Number(c.capacity?.[k.non_covid]?.current_capacity) || 0

        const total_covid = Number(c.capacity?.[k.covid]?.total_capacity) || 0
        const total_non_covid =
          Number(c.capacity?.[k.non_covid]?.total_capacity) || 0

        const kid = k.id as unknown as keyof typeof INITIAL_FACILITIES_TRIVIA

        const current = a[curKey][kid]

        if (typeof current === 'object') {
          current.used += Number(current_covid) + Number(current_non_covid)
          current.total += Number(total_covid) + Number(total_non_covid)
        }
      })

      return a
    },
    initial
  )

  return data
}

type AdditionalExportData = Record<string, string | number | null | boolean>

type FacilityExportData = {
  'Govt/Pvt': 'Govt' | 'Pvt'
  'Hops/CFLTC': 'CFLTC' | 'Hops'
  'Hospital/CFLTC Address': string | null
  'Hospital/CFLTC Name': string | null
  Mobile: string | null
} & AdditionalExportData

export const processCapacityExportData = (
  facilityData: ReturnType<typeof processFacilityData>,
  date: string
) => {
  const filename = 'capacity_export.csv'

  const data = reduce(
    facilityData,
    (a, c) => {
      if (c.date !== date) {
        return a
      }
      const additionalExportData = reduce(
        AVAILABILITY_TYPES_ORDERED,
        (acc, cur) => {
          const copy = cloneDeep(acc)
          const key = cur as unknown as keyof typeof AVAILABILITY_TYPES
          copy[`Current ${AVAILABILITY_TYPES[key]}`] =
            c.capacity?.[cur]?.current_capacity || 0
          copy[`Total ${AVAILABILITY_TYPES[key]}`] =
            c.capacity?.[cur]?.total_capacity || 0

          return copy
        },
        {} as AdditionalExportData
      )
      const newData: FacilityExportData[] = [
        ...a,
        {
          'Govt/Pvt': GOVT_FACILITY_TYPES.includes(c.facility_type)
            ? 'Govt'
            : 'Pvt',
          'Hops/CFLTC':
            c.facility_type === 'First Line Treatment Centre'
              ? 'CFLTC'
              : 'Hops' || null,
          'Hospital/CFLTC Address': c.address || null,
          'Hospital/CFLTC Name': c.name || null,
          Mobile: c.phone_number ? String(c.phone_number) : null,
          ...additionalExportData,
        },
      ]
      return newData
    },
    [] as FacilityExportData[]
  )

  return { data, filename }
}

export interface CapacityBedData {
  used: number
  total: number
  vacant: number
}

export interface CapacityCardDataForCapacity {
  facility_name: string | null
  facility_id: string | null
  facility_type: string | null
  phone_number: string | null
  last_updated: string | null
  patient_discharged: string | null
  covid: CapacityBedData[] | null
  non_covid: CapacityBedData[] | null
  final_total: CapacityBedData[] | null
}

export interface CapacityBedData {
  used: number
  total: number
  vacant: number
}

export const getCapacityBedData = (
  ids: (string | number)[],
  facility: ReturnType<typeof processFacilityData>[0]
): CapacityBedData[] => {
  return ids.map((i) => {
    if (facility.capacity) {
      const total =
        Number.parseInt(facility.capacity[i]?.total_capacity as string) || 0
      const used =
        Number.parseInt(facility.capacity[i]?.current_capacity as string) || 0
      const vacant = total - used

      return {
        used,
        total,
        vacant,
      }
    }

    return {
      used: 0,
      total: 0,
      vacant: 0,
    }
  })
}

export const getFinalTotalData = (
  covid: CapacityBedData[],
  nonCovid: CapacityBedData[]
): CapacityBedData[] => {
  return covid.map((val, idx) => {
    const used = val.used + nonCovid[idx].used
    const total = val.total + nonCovid[idx].total
    const vacant = val.vacant + nonCovid[idx].vacant

    return { used, total, vacant }
  })
}

export const processFacilityCapacityTableData = (
  facilities: ReturnType<typeof processFacilityData>,
  filterDate?: string
) => {
  const fac = reduce(
    facilities,
    (acc, curr) => {
      const covidData = getCapacityBedData(COVID_BEDS, curr)
      const nonCovidData = getCapacityBedData(NON_COVID_BEDS, curr)

      const finalTotalData = getFinalTotalData(covidData, nonCovidData)
      // const noCapacity = every(finalTotalData, (item) => item.total === 0)
      if (curr.date !== (filterDate || toDateString(new Date()))) {
        return acc
      }
      return [
        ...acc,
        {
          facility_name: curr.name || null,
          facility_id: curr.id || null,
          facility_type: curr.facility_type || null,
          phone_number: curr.phone_number || null,
          last_updated: dayjs(curr.modified_date).fromNow() || null,
          patient_discharged:
            `${curr.actual_live_patients || 0} / ${
              curr.actual_discharged_patients || 0
            }` || null,
          covid: covidData || null,
          non_covid: nonCovidData || null,
          final_total: finalTotalData || null,
        },
      ]
    },
    [] as CapacityCardDataForCapacity[]
  )


  return fac
}

export type ProcessFacilityDataReturn = ReturnType<typeof processFacilityData>
