import axios from 'axios'
import { useQuery } from 'react-query'
import { PaginatedResponse } from '../../types/paginatedResponse'
import { createQueryKey } from '../../utils/url'
import { FacilitySummaryResponse } from './useFacilitySummary'

const TRIAGE_SUMMARY_KEY = 'triageSummaryKey'

export interface TriageSummaryQuery {
  start_date?: string
  end_date?: string
  facility?: string
  /** District ID */
  district?: number
  /** Local body ID */
  local_body?: number
  /** State ID */
  state?: number
  limit?: number
}

export type TriageSummaryResponse = FacilitySummaryResponse<TriageSummaryData>

export interface TriageSummaryData {
  district: string
  facility_name: string
  avg_patients_visited: number
  avg_patients_referred: number
  avg_patients_isolation: number
  total_patients_visited: null | number
  total_patients_referred: null | number
  total_patients_isolation: null | number
  avg_patients_home_quarantine: number
  total_patients_home_quarantine: null | number
  avg_patients_confirmed_positive: number
  total_patients_confirmed_positive: number
}

const hook = (query: TriageSummaryQuery, enabled = true) =>
  useQuery(
    createQueryKey(TRIAGE_SUMMARY_KEY, query),
    () =>
      axios
        .get<PaginatedResponse<TriageSummaryResponse[]>>(
          'https://careapi.coronasafe.in/api/v1/triage_summary',
          { params: query }
        )
        .then((d) => d.data),
    { enabled }
  )

export default hook
