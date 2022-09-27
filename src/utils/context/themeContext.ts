import { createContext } from 'react'
import { checkTheme } from '../theme'

type InitialTheme = {
  theme: 'light' | 'dark'
  setTheme: React.Dispatch<React.SetStateAction<'dark' | 'light'>>
}
console.log(checkTheme())
const initialTheme: InitialTheme = {
  theme: checkTheme(),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setTheme: () => {},
}

export const ThemeContext = createContext(initialTheme)

export const ThemeProvider = ThemeContext.Provider
