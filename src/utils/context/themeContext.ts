import { createContext } from 'react'
import { checkTheme } from '../theme'

type InitialTheme = {
  theme: 'light' | 'dark'
  setTheme: React.Dispatch<React.SetStateAction<'dark' | 'light'>>
}

const initialTheme: InitialTheme = {
  theme: checkTheme(),
  setTheme: () => {
    return
  },
}

export const ThemeContext = createContext(initialTheme)

export const ThemeProvider = ThemeContext.Provider
