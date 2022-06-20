import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'

import { routes } from './router'

const queryClient = new QueryClient()

function App() {
  return (
    <Routes>
      {routes.map((props, i) => (
        <Route {...props} key={i} />
      ))}
    </Routes>
  )
}

// eslint-disable-next-line react/display-name
export default () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
