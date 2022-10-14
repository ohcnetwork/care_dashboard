// create useTheme hook
import { useContext, useEffect } from 'react'
import { ThemeContext } from '../context/themeContext'

export const useTheme = () => {
  const { theme, setTheme } = useContext(ThemeContext)

  useEffect(() => {
    localStorage.setItem('theme', theme)
    if (theme == 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return [theme, setTheme] as const
}
