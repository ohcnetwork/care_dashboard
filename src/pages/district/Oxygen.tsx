import Fuse from 'fuse.js'
import { useQueryParams } from 'raviger'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  FacilitySummaryQuery,
  useFacilitySummary,
} from '../../api/queries/useFacilitySummary'
import { OxygenFacilityCard } from '../../components/OxygenFacilityCard'
import { Pagination } from '../../components/Pagination'
import { TableExportHeader } from '../../components/TableExportHeader'
import { UsageCard } from '../../components/UsageCard'
import { UrlQuery } from '../../types/urlQuery'
import {
  getDateFromQuery,
  toDateString,
  getNDateBefore,
  getNDateAfter,
} from '../../utils/date'
import { processFacilityData } from '../../utils/facility/capacity'
import {
  getOxygenCardData,
  getOxygenFlatData,
  getOxygenSummeryConfig,
} from '../../utils/facility/oxygen'
import { usePaginateData } from '../../utils/hooks/usePaginateData'
import { getDistrictByName } from '../../utils/url'

interface Props {
  districtName?: string
}

const RESULT_PER_PAGE = 10

const OxygenLoading = () => {
  return (
    <div className="2xl:max-w-7xl mx-auto px-4 my-4">
      <div className="w-full h-32 bg-slate-800 animate-pulse rounded-xl mb-4" />
      <div className="w-full h-32 bg-slate-800 animate-pulse rounded-xl mb-4" />
      <div className="w-full h-32 bg-slate-800 animate-pulse rounded-xl" />
    </div>
  )
}
export default function Oxygen({ districtName }: Props) {
  const [searchValue, setSearchValue] = useState('')
  const [{ date }, setQuery] = useQueryParams<UrlQuery>()
  const queryDate = getDateFromQuery(date)

  const query: FacilitySummaryQuery = {
    district: getDistrictByName(districtName)?.id,
    start_date: toDateString(getNDateBefore(queryDate, 1)),
    end_date: toDateString(getNDateAfter(queryDate, 1)),
    limit: 1000,
  }

  const { data, isLoading } = useFacilitySummary(query)

  const filtered = useMemo(
    () => processFacilityData(data?.results, []),
    [data?.results]
  )

  const oxygenCardData = useMemo(() => getOxygenCardData(filtered), [filtered])
  const oxygenFlatData = useMemo(() => getOxygenFlatData(filtered), [filtered])

  const { handlePageChange, page, paginatedData, totalPage } = usePaginateData({
    data: oxygenCardData,
    keys: ['facility_name'],
    searchValue,
  })

  return isLoading ? (
    <OxygenLoading />
  ) : (
    <>
      <section className="my-4 2xl:max-w-7xl mx-auto px-4">
        <div>
          {getOxygenSummeryConfig(oxygenFlatData).map((config, i) => (
            <div className="card px-2 my-4 rounded-2xl" key={i}>
              <UsageCard data={config} />
            </div>
          ))}
        </div>
      </section>
      <section className="my-8 2xl:max-w-7xl mx-auto px-4">
        <div>
          <TableExportHeader
            label="Facilities"
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            exportData={{ data: [], filename: '' }}
            className="mb-8"
          />
          {paginatedData.map((data, index) => (
            <OxygenFacilityCard
              className="card rounded-2xl p-4 my-4"
              data={data}
              key={index}
            />
          ))}

          <div className="mt-4">
            <Pagination
              resultsPerPage={RESULT_PER_PAGE}
              totalPages={totalPage}
              curPage={page}
              handlePageChange={handlePageChange}
              resultsLength={oxygenCardData?.length}
            />
          </div>
        </div>
      </section>
    </>
  )
}
