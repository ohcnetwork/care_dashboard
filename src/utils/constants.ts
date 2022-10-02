export const GMAP_KEY = 'AIzaSyDsBAc3y7deI5ZO3NtK5GuzKwtUzQNJNUk'

export const ACTIVATED_DISTRICTS = [
  { id: 7, name: 'Ernakulam', lat: 10.148_547_6, lng: 76.500_752_4, zoom: 10 },
]

export const DEFAULT_ACTIVE_DISTRICT = ACTIVATED_DISTRICTS[0]

export const OXYGEN_INVENTORY = {
  liquid: 2,
  type_d: 4,
  type_c: 6,
  type_b: 5,
}

export const INITIAL_FACILITIES_TRIVIA = {
  '20': { total: 0, used: 0 },
  '10': { total: 0, used: 0 },
  '150': { total: 0, used: 0 },
  '1': { total: 0, used: 0 },
  '70': { total: 0, used: 0 },
  '50': { total: 0, used: 0 },
  '60': { total: 0, used: 0 },
  '40': { total: 0, used: 0 },
  '100': { total: 0, used: 0 },
  '110': { total: 0, used: 0 },
  '120': { total: 0, used: 0 },
  '30': { total: 0, used: 0 },
  '1111': { total: 0, used: 0 },
  '2222': { total: 0, used: 0 },
  '3333': { total: 0, used: 0 },
  '4444': { total: 0, used: 0 },
  actualDischargedPatients: 0,
  actualLivePatients: 0,
  count: 0,
  oxygen: 0,
}

export const AVAILABILITY_TYPES = {
  '20': 'Non-Covid Ventilator',
  '10': 'Non-Covid ICU',
  '150': 'Non-Covid Oxygen Beds',
  '1': 'Non-Covid Ordinary Bed',
  '70': 'KASP Ventilator',
  '50': 'KASP ICU',
  '60': 'KASP Oxygen Beds',
  '40': 'KASP Ordinary Bed',
  '100': 'Covid ICU w/ Ventilator',
  '110': 'Covid ICU',
  '120': 'Covid Oxygen Beds',
  '30': 'Covid Ordinary Bed',
} as const

export const AVAILABILITY_TYPES_TOTAL_ORDERED = [
  { id: 4444, name: 'Ordinary Bed', non_covid: 1, covid: 30 },
  { id: 3333, name: 'Oxygen Beds', non_covid: 150, covid: 120 },
  { id: 2222, name: 'ICU', non_covid: 10, covid: 110 },
  { id: 1111, name: 'Ventilator', non_covid: 20, covid: 100 },
] as const

export const AVAILABILITY_TYPES_ORDERED = [
  1, 150, 10, 20, 30, 120, 110, 100, 40, 60, 50, 70,
] as const

export const GOVT_FACILITY_TYPES = [
  'Govt Hospital',
  'Primary Health Centres',
  '24x7 Public Health Centres',
  'Family Health Centres',
  'Community Health Centres',
  'Urban Primary Health Center',
  'Taluk Hospitals',
  'Taluk Headquarters Hospitals',
  'Women and Child Health Centres',
  'General hospitals',
  'District Hospitals',
  'Govt Medical College Hospitals',
]

export const AVAILABILITY_TYPES_PROXY = {
  '20': 'Non-Covid',
  '10': 'Non-Covid',
  '150': 'Non-Covid',
  '1': 'Non-Covid',
  '70': 'KASP',
  '50': 'KASP',
  '60': 'KASP',
  '40': 'KASP',
  '100': 'Covid',
  '110': 'Covid',
  '120': 'Covid',
  '30': 'Covid',
} as const

export const COVID_BEDS = Object.entries(AVAILABILITY_TYPES_PROXY)
  .filter(([_, value]) => value === 'Covid')
  .map(([key, _]) => key)

export const NON_COVID_BEDS = Object.entries(AVAILABILITY_TYPES_PROXY)
  .filter(([_, value]) => value === 'Non-Covid')
  .map(([key, _]) => key)

export enum OXYGEN_INVENTORY_ENUM {
  oxygen_capacity = 2,
  type_d_cylinders = 4,
  type_c_cylinders = 6,
  type_b_cylinders = 5,
}

export const OXYGEN_INVENTORY_MAP = {
  oxygen_capacity: 2,
  type_d_cylinders: 4,
  type_c_cylinders: 6,
  type_b_cylinders: 5,
}

export const OXYGEN_INVENTORY_NAME = {
  liquid: 'Liquid Oxygen',
  type_d: 'Jumbo D Type Oxygen Cylinder',
  type_c: 'C Type Oxygen Cylinder',
  type_b: 'B Type Oxygen Cylinder',
}

export const OXYGEN_INVENTORY_STRING_ENUM = {
  oxygen_capacity: 'oxygen_capacity',
  type_d_cylinders: 'type_d_cylinders',
  type_c_cylinders: 'type_c_cylinders',
  type_b_cylinders: 'type_b_cylinders',
}

export const FACILITY_TYPES = [
  ...GOVT_FACILITY_TYPES,
  'Private Hospital',
  'First Line Treatment Centre',
  'Second Line Treatment Center',
  'COVID-19 Domiciliary Care Center',
  'Corona Care Centre',
  'Covid Management Center',
  'Shifting Centre',
  'TeleMedicine',
]
export const facilityOptions = FACILITY_TYPES.map((facility_type, idx) => {
  return { value: idx, label: facility_type }
})
