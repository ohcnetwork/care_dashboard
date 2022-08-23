import FacilityDetails from '../pages/Facility/FacilityDetails'

export const facilityRouter = {
  '/facility/:id': (props: Record<'id', string>) => (
    <FacilityDetails id={props.id} />
  ),
}
