import { QueryClient, QueryClientProvider } from 'react-query'
import { routes } from './router'
import { useRoutes } from 'raviger'
import { Header } from './components/Header'
import { DEFAULT_ACTIVE_DISTRICT } from './utils/constants'
import { useState } from 'react'
import { useTheme } from './utils/hooks/useTheme'
import { ThemeProvider } from './utils/context/themeContext'
import { checkTheme } from './utils/theme'
import { Filters } from './components/Filters'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  const appRoutes = useRoutes(routes, { matchTrailingSlash: false })

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen">
      <Header district={DEFAULT_ACTIVE_DISTRICT.name} />
      <main>{appRoutes}</main>
    </div>
  )
}

// eslint-disable-next-line react/display-name
export default () => {
  const [theme, setTheme] = useState(checkTheme())
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={{ setTheme, theme }}>
        <div className={theme}>
          <App />
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
