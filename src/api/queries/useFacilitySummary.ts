import axios, { AxiosResponse } from 'axios'
import { useQuery } from 'react-query'
import { PaginatedResponse } from '../../types/paginatedResponse'
import { createQueryKey } from '../../utils/url'

const FACILITY_SUMMARY_KEY = 'facilitySummeryKey'

export interface FacilitySummaryQuery {
  /* DISTRICT ID */
  district?: number
  start_date?: string
  end_date?: string
  limit?: number
  facility?: string
}

export interface FacilitySummaryResponse {
  facility: Facility
  created_date: string
  modified_date: string
  data: Data
}

export interface Facility {
  id: string
  name: string
  ward: number
  local_body: number
  district: number
  state: number
  facility_type: string
  address: string
  location: Location
  latitude?: number
  longitude?: number
  pincode: number
  oxygen_capacity: number
  phone_number: string
  ward_object: WardObject
  local_body_object: LocalBodyObject
  district_object: DistrictObject
  state_object: StateObject
  modified_date: string
  created_date: string
  kasp_empanelled: boolean
  expected_oxygen_requirement: number
  type_b_cylinders: number
  type_c_cylinders: number
  type_d_cylinders: number
  expected_type_b_cylinders: number
  expected_type_c_cylinders: number
  expected_type_d_cylinders: number
  cover_image_url?: string
}

export interface Location {
  latitude: number
  longitude: number
}

export interface WardObject {
  id: number
  name: string
  number: number
  local_body: number
}

export interface LocalBodyObject {
  id: number
  name: string
  body_type: number
  localbody_code: string
  district: number
}

export interface DistrictObject {
  id: number
  name: string
  state: number
}

export interface StateObject {
  id: number
  name: string
}

export interface Data {
  id: string
  name: string
  ward: number
  state: number
  address: string
  pincode: number
  district: number
  location: Location
  latitude?: number
  longitude?: number
  local_body: number
  ward_object: WardObject
  availability?: AvailabilityData[] | null
  created_date: string
  phone_number: string
  state_object: StateObject
  facility_type: string
  modified_date: string
  cover_image_url?: null
  district_object: DistrictObject
  inventory?: Record<string, Inventory>
  capacity?: Record<string, Capacity>
  kasp_empanelled: boolean
  oxygen_capacity: number
  type_b_cylinders: number
  type_c_cylinders: number
  type_d_cylinders: number
  local_body_object: LocalBodyObject
  expected_type_b_cylinders: number
  expected_type_c_cylinders: number
  expected_type_d_cylinders: number
  expected_oxygen_requirement: number
  actual_discharged_patients: number
  actual_live_patients: number
}

export type FilteredFacilityData = Data & {
  id: string | null
  name: string | null
  address: string | null
  district_id: number | null
  location: Location | null
  phone_number: string | null
  inventory: Record<string, Inventory> | null
  modified_date: string | null
  date: string
  inventory_modified_date: string
  read_cover_image_url: string
  tte_tank: number | undefined
  tte_d_cylinders: number | undefined
  tte_c_cylinders: number | undefined
  tte_b_cylinders: number | undefined
}

export interface Inventory {
  unit: string
  stock: number
  is_low: boolean
  burn_rate: number
  end_stock: number
  item_name: string
  start_stock: number
  total_added: number
  modified_date: string
  total_consumed: number
}

export interface AvailabilityData {
  id: string
  room_type: number
  modified_date: string
  room_type_text: string
  total_capacity: number
  current_capacity: number
}

export interface Capacity {
  room_type: number
  total_capacity: number | string
  current_capacity: number | string
}

export const useFacilitySummary = (
  query: FacilitySummaryQuery,
  enabled = true
) =>
  useQuery(
    createQueryKey(FACILITY_SUMMARY_KEY, query),
    () =>
      axios
        .get<PaginatedResponse<FacilitySummaryResponse[]>>(
          'https://careapi.coronasafe.in/api/v1/facility_summary/',
          {
            params: query,
          }
        )
        .then((d) => d.data),
    {
      enabled,
    }
  )
