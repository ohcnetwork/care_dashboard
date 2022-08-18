import FacilityDetails from '../pages/Facility/FacilityDetails'
import { Routes } from './types'

export const facilityRouter: Routes = {
  '/facility/:id': (props: Record<'id', string>) => (
    <FacilityDetails id={props.id} />
  ),
}
