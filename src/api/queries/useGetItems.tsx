import axios from 'axios'
import { useQuery } from 'react-query'

export const GET_ITEMS_KEY = 'getItems'

export const useGetItems = () => {
  useQuery(GET_ITEMS_KEY, () => axios.get('https://example.com/feedbacks'))
}
