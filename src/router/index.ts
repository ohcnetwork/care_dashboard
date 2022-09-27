import { assetRouter } from './assetRouter'
import { districtRouter } from './districtRouter'
import { errorRouter } from './errorRouter'
import { facilityRouter } from './facilityRouter'
import { homeRouter } from './homeRouter'

export const routes = {
  ...homeRouter,
  ...districtRouter,
  ...facilityRouter,
  ...assetRouter,
  ...errorRouter,
}
