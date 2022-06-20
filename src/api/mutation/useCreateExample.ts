import axios from 'axios'
import { useMutation, useQuery } from 'react-query'

export type CreateExamplePaylaod = {
  some: string
}

export type CreateExampleResponse = {
  success: boolean
}

export const CREATE_EXAMPLE_KEY = 'create_example_key'

export const useCreateExample = () => {
  return useMutation<
    CreateExampleResponse,
    unknown,
    CreateExamplePaylaod,
    unknown
  >(CREATE_EXAMPLE_KEY, (payload) =>
    axios.post('https://example.com/example', payload)
  )
}
