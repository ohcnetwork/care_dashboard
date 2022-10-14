import React, { useEffect, useMemo, useState } from 'react'
import useFacilitySummary, {
  FacilitySummaryQuery,
} from '../../api/queries/useFacilitySummary'
import { FacilityCapacityTableCard } from '../../components/FacilityCapacityTableCard'
import { Pagination } from '../../components/Pagination'
import RadialCard from '../../components/RadialCard'
import { TableExportHeader } from '../../components/TableExportHeader'
import { ValuePill } from '../../components/ValuePill'
import {
  AVAILABILITY_TYPES,
  AVAILABILITY_TYPES_ORDERED,
  AVAILABILITY_TYPES_TOTAL_ORDERED,
  facilityOptions,
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
import { Filter, X } from 'react-feather'
import { omit } from 'lodash'
import { Filters } from '../../components/Filters'
import clsx from 'clsx'

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
          <div className="relative">
            {isLoading ? (
              <div className="absolute top-0 left-0 h-full rounded-xl animate-pulse bg-slate-200 dark:bg-slate-800 w-32"></div>
            ) : null}
            <div
              className={clsx(
                'flex gap-2 justify-between items-center',
                isLoading && 'opacity-0 pointer-events-none'
              )}
            >
              <h1 className="text-xl text-slate-900 dark:text-white font-medium">
                Capacity
              </h1>
              <Filters />
            </div>
          </div>

          <div className="grid gap-1 grid-rows-none mb-8 sm:grid-flow-col-dense sm:grid-rows-1 sm:place-content-end my-5">
            <ValuePill
              isLoading={isLoading}
              title="Facility Count"
              value={facilitiesTrivia.current.count}
            />
            <ValuePill
              isLoading={isLoading}
              title="Oxygen Capacity"
              value={facilitiesTrivia.current.oxygen}
            />
            <ValuePill
              isLoading={isLoading}
              title="Live Patients"
              value={facilitiesTrivia.current.actualLivePatients}
            />
            <ValuePill
              isLoading={isLoading}
              title="Discharged Patients"
              value={facilitiesTrivia.current.actualDischargedPatients}
            />
          </div>
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
