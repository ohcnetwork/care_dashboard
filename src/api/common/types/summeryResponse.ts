import { Facility } from './facilitySummery'

export interface SummaryResponse<T> {
  facility: Facility
  created_date: string
  modified_date: string
  data: T
}
