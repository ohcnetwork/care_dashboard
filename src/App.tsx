import { QueryClient, QueryClientProvider } from 'react-query'
import { routes } from './router'
import { useRoutes } from 'raviger'
import { Header } from './components/Header'
import { ACTIVATED_DISTRICTS } from './utils/constants'
import { useEffect, useState } from 'react'
import { checkTheme } from './utils/theme'

const queryClient = new QueryClient()

function App() {
  const appRoutes = useRoutes(routes, { matchTrailingSlash: false })

  const [theme, setTheme] = useState(checkTheme());

  useEffect(() => {
    localStorage.setItem('theme', theme)
  }, [theme]);

  return (
    <div className={theme}>
      <div className="bg-slate-50 dark:bg-slate-900 min-h-screen">
        <Header district={ACTIVATED_DISTRICTS[0].name} theme={theme} setTheme={setTheme} />
        <main>{appRoutes}</main>
      </div>
    </div>
  )
}

// eslint-disable-next-line react/display-name
export default () => {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  )
}
