import Error404 from '../pages/Error404'

export const errorRouter = {
  '/404': () => <Error404 />,
  '*': () => <Error404 />,
}
