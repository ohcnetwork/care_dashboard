import Capacity from '../pages/district/Capacity'
import Map from '../pages/district/Map'
import Oxygen from '../pages/district/Oxygen'

export const districtRouter = {
  '/district/:districtName/capacity': (props: Record<string, string>) => (
    <Capacity districtName={props.districtName} />
  ),
  '/district/:districtName/map': (props: Record<string, string>) => (
    <Map districtName={props.districtName} />
  ),
  '/district/:districtName/oxygen': (props: Record<string, string>) => (
    <Oxygen districtName={props.districtName} />
  ),
}
