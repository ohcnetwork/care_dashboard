import Capacity from '../pages/district/Capacity'
import Map from '../pages/district/Map'
import { Routes } from './types'

export const districtRouter: Routes = {
  '/district/:districtName/capacity': Capacity,
  '/district/:districtName/map': Map,
}
