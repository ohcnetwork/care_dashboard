// create useTheme hook
import { useContext, useEffect } from 'react'
import { ThemeContext } from '../context/themeContext'

export const useTheme = () => {
  const { theme, setTheme } = useContext(ThemeContext)

  useEffect(() => {
    localStorage.setItem('theme', theme)
    if (theme == "dark") {
      document.documentElement.classList.add("dark")
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add("light")
      document.documentElement.classList.remove('dark');
    }
    document.documentElement.setAttribute(
      "data-color-scheme",
      theme
    );
  }, [theme])

  return [theme, setTheme] as const
}
