import axios from 'axios'
import { useQuery } from 'react-query'
import { PaginatedResponse } from '../../types/paginatedResponse'
import { createQueryKey } from '../../utils/url'
import { FacilitySummaryResponse } from './useFacilitySummary'

const PATIENT_SUMMARY_KEY = 'patientSummeryKey'

export interface PatientSummaryQuery {
  /* DISTRICT ID */
  district?: number
  start_date?: string
  end_date?: string
  limit?: number
  facility?: string
}

export const usePatientSummary = (query: PatientSummaryQuery, enabled = true) =>
  useQuery(
    createQueryKey(PATIENT_SUMMARY_KEY, query),
    () =>
      axios
        .get<PaginatedResponse<FacilitySummaryResponse[]>>(
          '/api/v1/patient_summary/',
          {
            params: query,
          }
        )
        .then((d) => d.data),
    {
      enabled,
    }
  )
