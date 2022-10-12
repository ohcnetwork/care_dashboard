import React, { useEffect, useMemo, useState } from 'react'
import {
  FacilitySummaryQuery,
  useFacilitySummary,
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
  FACILITY_TYPES,
  facility_types,
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
import { getDistrictByName } from '../../utils/url'
import { useQueryParams } from 'raviger'
import { UrlQuery } from '../../types/urlQuery'
import { X } from 'react-feather'
import { omit } from 'lodash'

interface Props {
  districtName?: string
}

export default function Capacity({ districtName }: Props) {
  const [searchValue, setSearchValue] = useState('')
  const [urlQuery, setQuery] = useQueryParams<UrlQuery>()
  const { date, end_date, facility_type } = urlQuery
  const initialFaciltyType = facility_type
    ?.split(',')
    .map((i) => {
      const key = parseInt(i.trim())
      return key >= 0 && key < facility_types.length
        ? facility_types[key]
        : null
    })
    .filter((i) => i != null) as any[]
  const [selectedFacilities, setSelectedFacilities] = useState<any>(
    initialFaciltyType || []
  )
  const [selectedDate, setSelectedDate] = useState<any>(
    date ? getDateFromQuery(date) : null
  )

  const queryDate = getDateFromQuery(date)
  const queryEndDate = getDateFromQuery(end_date ? end_date : date)
  const query: FacilitySummaryQuery = {
    district: getDistrictByName(districtName)?.id,
    start_date: toDateString(getNDateBefore(queryDate, 1)),
    end_date: toDateString(getNDateAfter(queryEndDate, 1)),
    limit: 1000,
  }

  const { data, isLoading } = useFacilitySummary(query)

  const filtered = useMemo(
    () =>
      processFacilityData(
        data?.results,
        selectedFacilities.length
          ? selectedFacilities.map(
              (i: { id: number; facility_type: string }) => i.facility_type
            )
          : []
      ),
    [data?.results, selectedFacilities]
  )
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

  const handleRemoveFacility = (id: number) => {
    setSelectedFacilities((p: any) => p.filter((item: any) => item.id != id))
    if (selectedFacilities.filter((item: any) => item.id != id).length)
      setQuery({
        ...urlQuery,
        facility_type: selectedFacilities
          .filter((item: any) => item.id != id)
          .map((item: any) => {
            return item.id
          })
          .join(','),
      })
    else setQuery(omit(urlQuery, 'facility_type'))
  }

  useEffect(() => {
    if (facility_type)
      setSelectedFacilities(
        facility_type
          ?.split(',')
          .map((i) => {
            const key = parseInt(i.trim())
            return key >= 0 && key < facility_types.length
              ? facility_types[key]
              : null
          })
          .filter((i) => i != null) as any[]
      )
    if (date) setSelectedDate(date)
  }, [facility_type, date])

  return (
    <>
      <section className="my-4">
        <div className="2xl:max-w-7xl mx-auto px-4">
          <div className="mt-2 flex flex-wrap dark:text-white text-sm">
            {selectedFacilities?.map((i: any) => {
              return (
                <li
                  key={i.facility_type}
                  className="my-1 mr-1 shadow-xs rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-gray-200 opacity-100 flex px-2 items-center"
                >
                  <span>{i.facility_type}</span>
                  <button
                    className="ml-2 hover:bg-slate-200 dark:hover:bg-slate-900 rounded-full p-1 flex justify-center items-center dark:text-gray-200"
                    onClick={() => {
                      handleRemoveFacility(i.id)
                    }}
                  >
                    <X size={12} />
                  </button>
                </li>
              )
            })}
            {selectedDate && (
              <div className="my-1 mr-1 shadow-xs rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-gray-200 opacity-100 flex px-2 items-center">
                <span>Date</span>
                <button
                  className="ml-2 hover:bg-slate-200 dark:hover:bg-slate-900 rounded-full p-1 flex justify-center items-center dark:text-gray-200"
                  onClick={() => {
                    setQuery(omit(urlQuery, 'date', 'end_date'))
                    setSelectedDate(null)
                  }}
                >
                  <X size={12} />
                </button>
              </div>
            )}
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
