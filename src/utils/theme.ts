export const checkTheme: () => 'light' | 'dark' = () => {
  const theme = localStorage.getItem('theme')
  console.log({ theme })
  if (theme && (theme === 'dark' || theme === 'light')) {
    return theme
  }
  const mql = window.matchMedia('(prefers-color-scheme: dark)')
  const hasPreference = typeof mql.matches === 'boolean'
  if (hasPreference) {
    localStorage.setItem('theme', mql.matches ? 'dark' : 'light')
    return mql.matches ? 'dark' : 'light'
  } else {
    localStorage.setItem('theme', 'light')
    return 'light'
  }
}
