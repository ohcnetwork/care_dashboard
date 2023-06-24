import { useMemo, useState } from 'react'
import useFacilitySummary, {
  FacilitySummaryQuery,
} from '../../api/queries/useFacilitySummary'
import { FacilityCapacityTableCard } from '../../components/FacilityCapacityTableCard'
import { Pagination } from '../../components/Pagination'
import RadialCard from '../../components/RadialCard'
import { TableExportHeader } from '../../components/TableExportHeader'
import {
  AVAILABILITY_TYPES,
  AVAILABILITY_TYPES_ORDERED,
  AVAILABILITY_TYPES_TOTAL_ORDERED,
} from '../../utils/constants'
import {
  getDateFromQuery,
  getNDateAfter,
  getNDateBefore,
  toDateString,
} from '../../utils/date'
import {
  processCapacityExportData,
  processFacilityCapacityTableData,
  processFacilityData,
  processFacilityTrivia,
} from '../../utils/facility/capacity'
import { usePaginateData } from '../../utils/hooks/usePaginateData'
import { getDistrictByName, getFacilitiesFromQuery } from '../../utils/url'
import { useQueryParams } from 'raviger'
import { UrlQuery } from '../../types/urlQuery'
import TitleBar from '../../components/TitleBar'

interface Props {
  districtName?: string
}

export default function Capacity({ districtName }: Props) {
  const [searchValue, setSearchValue] = useState('')
  const [urlQuery, setQuery] = useQueryParams<UrlQuery>()
  const { date, start_date, end_date, facility_type } = urlQuery

  const queryDate =
    start_date && end_date
      ? getDateFromQuery(start_date)
      : getDateFromQuery(date)
  const queryEndDate =
    start_date && end_date ? getDateFromQuery(end_date) : getDateFromQuery(date)

  const query: FacilitySummaryQuery = {
    district: getDistrictByName(districtName)?.id,
    start_date: toDateString(getNDateBefore(queryDate, 1)),
    end_date: toDateString(getNDateAfter(queryEndDate, 1)),
    limit: 1000,
  }

  const { data, isLoading } = useFacilitySummary(query)
  const filtered = useMemo(
    () =>
      processFacilityData(data?.results, getFacilitiesFromQuery(facility_type)),
    [data?.results, facility_type]
  )
  // Todo: Support date range
  const facilitiesTrivia = useMemo(
    () => processFacilityTrivia(filtered, toDateString(queryDate)),
    [filtered, queryDate]
  )
  const exportData = useMemo(
    () => processCapacityExportData(filtered, toDateString(queryDate)),
    [filtered, queryDate]
  )

  const tableData = useMemo(
    () => processFacilityCapacityTableData(filtered),
    [filtered]
  )

  const { handlePageChange, page, paginatedData, totalPage } = usePaginateData({
    data: tableData,
    keys: ['facility_name'],
    searchValue,
  })

  return (
    <>
      <section className="my-4">
        <div className="2xl:max-w-7xl mx-auto px-4">
          <TitleBar
            isLoading={isLoading}
            district={districtName}
            pills={[
              {
                title: 'Facility Count',
                value: facilitiesTrivia.current.count,
              },
              {
                title: 'Oxygen Capacity',
                value: facilitiesTrivia.current.oxygen,
              },
              {
                title: 'Live Patients',
                value: facilitiesTrivia.current.actualLivePatients,
              },
              {
                title: 'Discharged Patients',
                value: facilitiesTrivia.current.actualDischargedPatients,
              },
            ]}
          />

          <div className="mx-auto grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 my-5">
            {AVAILABILITY_TYPES_TOTAL_ORDERED.map((k) => {
              return (
                <RadialCard
                  label={k.name}
                  isLoading={isLoading}
                  reverseIndicator
                  current={facilitiesTrivia.current[k.id]}
                  previous={facilitiesTrivia.previous[k.id]}
                  key={k.id}
                />
              )
            })}
            {AVAILABILITY_TYPES_ORDERED.map((key, i) => {
              return (
                <RadialCard
                  isLoading={isLoading}
                  label={AVAILABILITY_TYPES[key]}
                  current={facilitiesTrivia.current[key]}
                  previous={facilitiesTrivia.previous[key]}
                  reverseIndicator
                  key={i}
                />
              )
            })}
          </div>
        </div>
      </section>
      {!isLoading ? (
        <section className="my-4 mt-16">
          <div className="2xl:max-w-7xl mx-auto px-4">
            <TableExportHeader
              label="Facilities"
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              exportData={exportData}
            />
            <div className="mt-8">
              {paginatedData.map((data, i) => (
                <FacilityCapacityTableCard data={data} key={i} />
              ))}
              {paginatedData.length === 0 && (
                <div className="text-center font-bold text-lg text-gray-500">
                  No facilities found
                </div>
              )}
            </div>
            <Pagination
              curPage={page}
              handlePageChange={handlePageChange}
              totalPages={totalPage}
              resultsPerPage={10}
              resultsLength={tableData?.length}
            />
          </div>
        </section>
      ) : null}
    </>
  )
}
