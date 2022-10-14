import { Facility } from '../../queries/useFacilitySummary'

export interface SummaryResponse<T> {
  facility: Facility
  created_date: string
  modified_date: string
  data: T
}
