import { QueryClient, QueryClientProvider } from 'react-query'

import { routes } from './router'
import { useRoutes } from 'raviger'

const queryClient = new QueryClient()

function App() {
  const appRoutes = useRoutes(routes, { matchTrailingSlash: false })
  return <main>{appRoutes}</main>
}

// eslint-disable-next-line react/display-name
export default () => {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  )
}
