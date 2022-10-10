import dayjs from 'dayjs'

import { cloneDeep, filter, includes, map, keys, reduce } from 'lodash-es'
import { PatientSummaryResponse } from '../../api/queries/usePatientSummary'
import { INITIAL_PATIENT_FACILITY_TRIVIA, PATIENT_TYPES } from '../constants'
import { toDateString } from '../date'

export type PatientTypeKeys = keyof typeof PATIENT_TYPES
export type PatientTypeTodayKeys = `today_patients_${PatientTypeKeys}`
export type PatientTypeTotalKeys = `total_patients_${PatientTypeKeys}`
export type PatientFacilitiesTrivia = ReturnType<
  typeof processPatientFacilitiesTriviaData
>

export const processPatientSummaryData = (
  facilitiesSummary?: PatientSummaryResponse[],
  filterFacilities?: string[]
) => {
  const cleanFacilityData = filter(facilitiesSummary, (f) => !!f.facility)
  const facilityData = map(cleanFacilityData, (d) => {
    const { created_date, data, facility, modified_date } = d

    const modifiedDayJsDate = dayjs(data.modified_date || modified_date)

    const modified_date_format =
      toDateString(modifiedDayJsDate?.toDate()) || null

    return {
      ...data,
      id: facility.id || null,
      date: toDateString(new Date(created_date)),
      name: facility.name || null,
      address: facility.address || null,
      district_id: facility.district || null,
      facility_type: facility.facility_type || 'Unknown',
      location: facility.location || null,
      phone_number: facility.phone_number || null,
      modified_date: modified_date_format,
    }
  })

  const data = filterFacilities?.length
    ? filter(facilityData, (f) => includes(filterFacilities, f.facility_type))
    : facilityData

  return data
}

export const processPatientFacilitiesTriviaData = (
  facility: ReturnType<typeof processPatientSummaryData>,
  filterDate?: string
) => {
  const initial = {
    current: cloneDeep(INITIAL_PATIENT_FACILITY_TRIVIA),
    previous: cloneDeep(INITIAL_PATIENT_FACILITY_TRIVIA),
  }

  const getKey = (date: string) =>
    date === (filterDate || toDateString(new Date())) ? 'current' : 'previous'

  return facility.reduce((a, c) => {
    const key = getKey(c.date)
    a[key].count += 1

    keys(PATIENT_TYPES).forEach((k) => {
      const curKey = k as PatientTypeKeys
      const todayKey = `today_patients_${curKey}` as const
      const totalKey = `total_patients_${curKey}` as const
      a[key][curKey].today += c[todayKey] || 0
      a[key][curKey].total += c[totalKey] || 0
    })

    return a
  }, initial)
}

interface PatientCardData {
  total: number
  today: number
}
export interface PatientCardDataForCapacity {
  facility_name: string | null
  id: string | null
  facility_type: string | null
  phone_number: string | null
  last_updated: string | null
  icu?: PatientCardData
  oxygen_bed?: PatientCardData
  bed_with_oxygen_support?: PatientCardData
  icu_with_oxygen_support?: PatientCardData
  not_admitted?: PatientCardData
  home_isolation?: PatientCardData
  isolation?: PatientCardData
  home_quarantine?: PatientCardData
  paediatric_ward?: PatientCardData
  gynaecology_ward?: PatientCardData
  icu_with_invasive_ventilator?: PatientCardData
  icu_with_non_invasive_ventilator?: PatientCardData
}

export const processPatientCardData = (
  facility: ReturnType<typeof processPatientSummaryData>,
  filterDate?: string
) => {
  return facility.reduce((acc, curr) => {
    if (curr.date !== (filterDate || toDateString(new Date()))) {
      return acc
    }

    const newData: PatientCardDataForCapacity = {
      id: curr.id,
      facility_name: curr.name,
      facility_type: curr.facility_type,
      phone_number: curr.phone_number,
      last_updated: dayjs(curr.modified_date).isValid()
        ? dayjs(curr.modified_date).fromNow()
        : 'Not Available',
    }

    Object.keys(PATIENT_TYPES).forEach((k) => {
      const curKey = k as PatientTypeKeys
      const todayKey = `today_patients_${curKey}` as const
      const totalKey = `total_patients_${curKey}` as const
      newData[curKey] = {
        total: curr[totalKey] || 0,
        today: curr[todayKey] || 0,
      }
    })

    return [...acc, newData]
  }, [] as PatientCardDataForCapacity[])
}

type AdditionalExportData = Record<string, string | number | null | boolean>

type PatientExportData = {
  'Govt/Pvt': 'Govt' | 'Pvt'
  'Hops/CFLTC': 'CFLTC' | 'Hops'
  'Hospital/CFLTC Address': string | null
  'Hospital/CFLTC Name': string | null
  Mobile: string | null
} & AdditionalExportData

export const processPatientExportData = (
  facilityData: ReturnType<typeof processPatientSummaryData>,
  date: Date
) => {
  const filename = 'patient_export.csv'

  const data = reduce(
    facilityData,
    (a, c) => {
      if (c.date !== toDateString(date)) {
        return a
      }

      const additionalData = reduce(
        Object.keys({ ...PATIENT_TYPES }),
        (acc, cur) => {
          const copy = cloneDeep(acc)
          const key = cur as unknown as keyof typeof PATIENT_TYPES
          copy[`Total Patient in ${PATIENT_TYPES[key]}`] =
            c[`total_patients_${key}`]

          return copy
        },
        {} as AdditionalExportData
      )

      const newData: PatientExportData[] = [
        ...a,
        {
          'Hospital/CFLTC Name': c.name || null,
          'Hospital/CFLTC Address': c.address || null,
          'Govt/Pvt': c.facility_type.startsWith('Govt') ? 'Govt' : 'Pvt',
          'Hops/CFLTC':
            c.facility_type === 'First Line Treatment Centre'
              ? 'CFLTC'
              : 'Hops',
          Mobile: c.phone_number ? String(c.phone_number) : null,
          ...additionalData,
        },
      ]
      return newData
    },
    [] as PatientExportData[]
  )

  return { data, filename }
}
