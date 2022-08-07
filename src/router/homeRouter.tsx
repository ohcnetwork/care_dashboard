import { Routes } from 'raviger'
import { Home } from '../pages/Home'

export const homeRouter: Routes<string> = { '/': () => <Home /> }
