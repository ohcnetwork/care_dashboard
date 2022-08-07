import Capacity from '../pages/district/Capacity'
import Map from '../pages/district/Map'

export const districtRouter = {
  '/district/:districtName/capacity': (props: Record<string, string>) => (
    <Capacity districtName={props.districtName} />
  ),
  '/district/:districtName/map': (props: Record<string, string>) => (
    <Map districtName={props.districtName} />
  ),
}
