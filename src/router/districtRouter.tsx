import Capacity from '../pages/district/Capacity'
import Map from '../pages/district/Map'
import Oxygen from '../pages/district/Oxygen'
import Patient from '../pages/district/Patient'

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
  '/district/:districtName/patient': (props: Record<string, string>) => (
    <Patient districtName={props.districtName} />
  ),
}
