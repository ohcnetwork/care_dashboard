import { districtRouter } from './districtRouter'
import { errorRouter } from './errorRouter'
import { homeRouter } from './homeRouter'

export const routes = {
  ...homeRouter,
  ...districtRouter,
  ...errorRouter,
}
