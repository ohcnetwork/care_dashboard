import { QueryClient, QueryClientProvider } from 'react-query'
import { routes } from './router'
import { useRoutes } from 'raviger'
import { Header } from './components/Header'
import { ACTIVATED_DISTRICTS } from './utils/constants'

const queryClient = new QueryClient()

function App() {
  const appRoutes = useRoutes(routes, { matchTrailingSlash: false })

  return (
    <>
      <Header district={ACTIVATED_DISTRICTS[0].name} />
      <main>{appRoutes}</main>
    </>
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
