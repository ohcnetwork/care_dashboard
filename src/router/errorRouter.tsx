import Error404 from '../pages/Error404'
import { Routes } from './types'

export const errorRouter: Routes = {
  '/404': Error404,
  '*': Error404,
}
