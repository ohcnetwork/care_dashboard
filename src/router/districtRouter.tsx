import Capacity from '../pages/district/Capacity'
import { Routes } from './types'

export const districtRouter: Routes[] = [
  { path: '/district/:district_name/capacity', element: <Capacity /> },
]
