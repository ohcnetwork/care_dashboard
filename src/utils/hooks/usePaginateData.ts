import { useEffect, useMemo, useRef, useState } from 'react'
import Fuse from 'fuse.js'

interface UsePaginationDataArgs<T> {
  data: T[]
  keys: string[]
  resultsPerPage?: number
  searchValue: string
}

const DEFAULT_RESULTS_PER_PAGE = 10

export const usePaginateData = <T>(args: UsePaginationDataArgs<T>) => {
  const { data, keys, searchValue, resultsPerPage } = args

  const fuseData = useRef(new Fuse(data, { keys }))

  const [page, setPage] = useState(1)
  const [paginatedData, setPaginatedData] = useState(data)

  useEffect(() => {
    fuseData.current = new Fuse(data, { keys })
  }, [data])

  useEffect(() => {
    const skip = (page - 1) * (resultsPerPage || DEFAULT_RESULTS_PER_PAGE)
    const end = skip + (resultsPerPage || DEFAULT_RESULTS_PER_PAGE)

    if (searchValue.length) {
      const newData = fuseData.current.search(searchValue).map((i) => i.item)
      setPaginatedData(newData.slice(0, 10))
    } else {
      setPaginatedData(data.slice(skip, end))
    }
  }, [searchValue, page, data])

  const handlePageChange = (page: number) => setPage(page)

  return {
    paginatedData,
    page,
    handlePageChange,
    totalPage: Math.ceil(data.length / Math.abs(resultsPerPage || 10)),
  }
}
