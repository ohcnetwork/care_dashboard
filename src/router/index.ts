import { errorRouter } from './errorRouter'
import { homeRouter } from './homeRouter'
import { Routes } from './types'

export const routes: Routes[] = [...homeRouter, ...errorRouter]
