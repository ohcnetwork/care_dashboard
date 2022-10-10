// create useTheme hook
import { useContext, useEffect } from 'react'
import { ThemeContext } from '../context/themeContext'

export const useTheme = () => {
  const { theme, setTheme } = useContext(ThemeContext)

  useEffect(() => {
    localStorage.setItem('theme', theme)
  }, [theme])

  return [theme, setTheme] as const
}
