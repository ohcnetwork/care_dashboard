export interface AssetDetails {
  id: string
  status: 'ACTIVE' | 'TRANSFER_IN_PROGRESS ' | string
  asset_type: string
  location_object: LocationObject
  created_date: string
  modified_date: string
  name: string
  description: string
  asset_class: string
  is_working: boolean
  not_working_reason: string
  serial_number: string
  warranty_details: string
  meta: Meta
  vendor_name: string
  support_name: string
  support_phone: string
  support_email: string
  qr_code_id: string
  manufacturer: string
  warranty_amc_end_of_validity: string
  last_serviced_on: string
  notes: string
}

export interface LocationObject {
  id: string
  facility: {
    id: string
    name: string
  }
  created_date: string
  modified_date: string
  name: string
  description: string
  location_type: number
}

export interface Meta {
  asset_type: string
  local_ip_address: string
  camera_access_key: string
  middleware_hostname: string
}
