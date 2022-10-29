import axios from 'axios'
import { useQuery } from 'react-query'
import { PaginatedResponse } from '../../types/paginatedResponse'
import { createQueryKey } from '../../utils/url'

export const getGenericSummaryQueryHook = <QueryType, ResponseType>(
  key: string,
  endpoint: string
) => {
  const hook = (query: QueryType, enabled = true) =>
    useQuery(
      createQueryKey(key, query),
      () =>
        axios
          .get<PaginatedResponse<ResponseType[]>>(
            `${import.meta.env.VITE_API_URL}${endpoint}`,
            { params: query }
          )
          .then((d) => d.data),
      { enabled }
    )
  return hook
}
