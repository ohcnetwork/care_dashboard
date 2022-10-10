import { FacilitySummaryResponse } from './useFacilitySummary'
import { getGenericSummaryQueryHook } from './utils'

const PATIENT_SUMMARY_KEY = 'patientSummeryKey'

export type PatientSummaryResponse = FacilitySummaryResponse<PatientSummaryData>

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
  /** District ID */
  district?: number
  start_date?: string
  end_date?: string
  limit?: number
  facility?: string
}

export default getGenericSummaryQueryHook<
  PatientSummaryQuery,
  PatientSummaryResponse
>(PATIENT_SUMMARY_KEY, '/api/v1/patient_summary/')
