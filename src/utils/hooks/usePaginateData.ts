import { useEffect, useRef, useState } from 'react'
import Fuse from 'fuse.js'

interface UsePaginationDataArgs<T> {
  data: T[]
  keys: string[]
  resultsPerPage?: number
  searchValue: string
}

const DEFAULT_RESULTS_PER_PAGE = 10

export const usePaginateData = <T>(args: UsePaginationDataArgs<T>) => {
  const {
    data,
    keys,
    searchValue,
    resultsPerPage = DEFAULT_RESULTS_PER_PAGE,
  } = args

  const fuseData = useRef(new Fuse(data, { keys, includeScore: true }))

  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(
    Math.ceil(data.length / resultsPerPage)
  )
  const [paginatedData, setPaginatedData] = useState(data)

  useEffect(() => {
    fuseData.current = new Fuse(data, { keys, includeScore: true })
  }, [data])

  useEffect(() => {
    let newData = data
    if (searchValue.length) {
      newData = fuseData.current
        .search({ facility_name: searchValue })
        .filter((i) => (i?.score || 0) <= 0.5)
        .map((i) => i.item)
    }

    setTotalPage(Math.ceil(newData.length / resultsPerPage))
    setPage(totalPage >= page ? page : 1)
    setPaginatedData(newData)
  }, [searchValue, page, data])

  const handlePageChange = (page: number) => setPage(page)

  const skip = (page - 1) * resultsPerPage
  const end = skip + resultsPerPage

  return {
    paginatedData: paginatedData.slice(skip, end),
    page,
    handlePageChange,
    totalPage,
    totalResults: paginatedData.length,
  }
}
