export interface SummaryResponse<T> {
  facility: Facility
  created_date: string
  modified_date: string
  data: T
}

interface Facility {
  id: string
  name: string
  ward: number
  local_body: number
  district: number
  state: number
  facility_type: string
  address: string
  location: Location
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
  read_cover_image_url?: null
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
