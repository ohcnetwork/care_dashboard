import axios from 'axios'
import { useQuery } from 'react-query'
import { PaginatedResponse } from '../../types/paginatedResponse'
import { createQueryKey } from '../../utils/url'
import { Facility } from '../common/types/facilitySummery'
import { FacilitySummaryResponse } from './useFacilitySummary'

const PATIENT_SUMMARY_KEY = 'patientSummeryKey'

export interface PatientSummaryResponse {
  facility: Facility
  created_date: string
  modified_date: string
  data: PatientSummaryData
}

export interface PatientSummaryData {
  district: string
  facility_name: string
  modified_date: string
  today_patients_icu: number
  total_patients_icu: number
  facility_external_id: string
  today_patients_regular: number
  total_patients_regular: number
  today_patients_isolation: number
  total_patients_isolation: number
  today_patients_home_quarantine: number
  total_patients_home_quarantine: number
  today_patients_bed_with_oxygen_support: number
  today_patients_icu_with_oxygen_support: number
  total_patients_bed_with_oxygen_support: number
  total_patients_icu_with_oxygen_support: number
  today_patients_icu_with_invasive_ventilator: number
  total_patients_icu_with_invasive_ventilator: number
  today_patients_icu_with_non_invasive_ventilator: number
  total_patients_icu_with_non_invasive_ventilator: number
}

export interface PatientSummaryQuery {
  /* DISTRICT ID */
  district?: number
  start_date?: string
  end_date?: string
  limit?: number
  facility?: string
}

export interface PatientSummaryResponse {
  facility: Facility
  created_date: string
  modified_date: string
  data: Data
}

interface Data {
  district: string
  facility_external_id: string
  facility_name: string
  modified_date: string
  today_patients_bed_with_oxygen_support: number
  today_patients_home_quarantine: number
  today_patients_icu: number
  today_patients_icu_with_invasive_ventilator: number
  today_patients_icu_with_non_invasive_ventilator: number
  today_patients_icu_with_oxygen_support: number
  today_patients_isolation: number
  today_patients_regular: number
  total_patients_bed_with_oxygen_support: number
  total_patients_home_quarantine: number
  total_patients_icu: number
  total_patients_icu_with_invasive_ventilator: number
  total_patients_icu_with_non_invasive_ventilator: number
  total_patients_icu_with_oxygen_support: number
  total_patients_isolation: number
  total_patients_regular: number
}

export const usePatientSummary = (query: PatientSummaryQuery, enabled = true) =>
  useQuery(
    createQueryKey(PATIENT_SUMMARY_KEY, query),
    () =>
      axios
        .get<PaginatedResponse<PatientSummaryResponse[]>>(
          'https://careapi.coronasafe.in/api/v1/patient_summary/',
          {
            params: query,
          }
        )
        .then((d) => d.data),
    {
      enabled,
    }
  )
