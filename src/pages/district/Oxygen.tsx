import { useQueryParams } from 'raviger'
import React, { useMemo, useState } from 'react'
import useFacilitySummary, {
  FacilitySummaryQuery,
  FilteredFacilityData,
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
  getOxygenSummaryConfig,
  processOxygenExportData,
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
      <div className="w-full h-32 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl mb-4" />
      <div className="w-full h-32 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl mb-4" />
      <div className="w-full h-32 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl" />
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

  const { handlePageChange, page, paginatedData, totalPage, totalResults } =
    usePaginateData({
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
          {getOxygenSummaryConfig(oxygenFlatData).map((config, i) => (
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
            exportData={processOxygenExportData(
              filtered as unknown[] as FilteredFacilityData[],
              date
            )}
            className="mb-8"
          />
          {paginatedData.map((data, index) => (
            <OxygenFacilityCard
              className="card rounded-2xl p-4 my-4"
              data={data}
              key={index}
            />
          ))}
          {paginatedData.length === 0 && (
            <div className="text-center font-bold text-lg text-gray-500">
              No facilities found
            </div>
          )}
          <div className="mt-4">
            <Pagination
              resultsPerPage={RESULT_PER_PAGE}
              totalPages={totalPage}
              curPage={page}
              handlePageChange={handlePageChange}
              resultsLength={totalResults}
            />
          </div>
        </div>
      </section>
    </>
  )
}
