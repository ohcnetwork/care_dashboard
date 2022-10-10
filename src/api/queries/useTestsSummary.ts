import { FacilitySummaryResponse } from './useFacilitySummary'
import { getGenericQueryHook } from './utils'

const TESTS_SUMMARY_KEY = 'testsSummaryKey'

export interface TestsSummaryQuery {
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

export type TestsSummaryResponse = FacilitySummaryResponse<TestsSummaryData>

export interface TestsSummaryData {
  district: string
  total_tests: number
  facility_name: string
  modified_date: string
  result_awaited: number
  test_discarded: number
  total_patients: number
  result_negative: number
  result_positive: number
}

export default getGenericQueryHook<TestsSummaryQuery, TestsSummaryResponse>(
  TESTS_SUMMARY_KEY,
  'api/v1/tests_summary'
)
