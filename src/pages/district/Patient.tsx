import { useQueryParams } from 'raviger'
import React, { useMemo, useState } from 'react'
import usePatientSummary, {
  PatientSummaryQuery,
} from '../../api/queries/usePatientSummary'
import BedsSummery from '../../components/BedsSummery'
import InfoCard from '../../components/InfoCard'
import { Pagination } from '../../components/Pagination'
import { TableExportHeader } from '../../components/TableExportHeader'
import { ValuePill } from '../../components/ValuePill'
import { UrlQuery } from '../../types/urlQuery'
import { PATIENT_TYPES } from '../../utils/constants'
import {
  toDateString,
  getNDateBefore,
  getNDateAfter,
  getDateFromQuery,
} from '../../utils/date'
import {
  PatientTypeKeys,
  processPatientCardData,
  processPatientExportData,
  processPatientFacilitiesTriviaData,
  processPatientSummaryData,
} from '../../utils/facility/patient'
import { usePaginateData } from '../../utils/hooks/usePaginateData'
import { getDistrictByName } from '../../utils/url'

interface Props {
  districtName?: string
}

const PatientSkeleton = () => {
  return (
    <section className="my-4 2xl:max-w-7xl mx-auto px-4">
      <div className="grid gap-1 grid-rows-none mb-8 sm:grid-flow-col-dense sm:grid-rows-1 sm:place-content-end my-5">
        <ValuePill title="Facility Count" value={0} isLoading />
      </div>
      <div className="grid grid-col-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8 ">
        {Array.from({ length: 7 }).map((_, i) => {
          return (
            <div
              key={i}
              className="w-full h-32 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl"
            />
          )
        })}
      </div>
    </section>
  )
}

export default function Patient({ districtName }: Props) {
  const [{ date }, setQuery] = useQueryParams<UrlQuery>()
  const queryDate = getDateFromQuery(date)
  const [searchValue, setSearchValue] = useState('')
  const query: PatientSummaryQuery = {
    district: getDistrictByName(districtName)?.id,
    start_date: toDateString(getNDateBefore(queryDate, 1)),
    end_date: toDateString(getNDateAfter(queryDate, 1)),
    limit: 1000,
  }

  const { data, isLoading } = usePatientSummary(query)

  const filtered = useMemo(
    () => processPatientSummaryData(data?.results, []),
    [data?.results]
  )
  const facilityTrivia = useMemo(
    () => processPatientFacilitiesTriviaData(filtered, date),
    [filtered, date]
  )
  const patientCardData = useMemo(
    () => processPatientCardData(filtered),
    [filtered]
  )

  const exportData = useMemo(
    () => processPatientExportData(filtered, new Date(date || new Date())),
    [filtered, date]
  )

  const { handlePageChange, page, paginatedData, totalPage } = usePaginateData({
    data: patientCardData,
    keys: ['facility_name'],
    searchValue,
  })

  if (isLoading) {
    return <PatientSkeleton />
  }

  return (
    <section className="my-4 2xl:max-w-7xl mx-auto px-4">
      <div className="grid gap-1 grid-rows-none mb-8 sm:grid-flow-col-dense sm:grid-rows-1 sm:place-content-end my-5">
        <ValuePill
          title="Facility Count"
          value={facilityTrivia.current.count}
        />
      </div>
      <div className="grid grid-col-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8 ">
        {Object.entries({ ...PATIENT_TYPES }).map(([k, title], i) => {
          const key = k as PatientTypeKeys
          const value = facilityTrivia.current[key]?.total || 0
          const delta = facilityTrivia.current[key].today || 0
          return <InfoCard key={i} title={title} value={value} delta={delta} />
        })}
      </div>
      <div className="my-16">
        <TableExportHeader
          label="Facilities"
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          exportData={exportData}
          className="mb-4"
        />
        <div className="flex gap-4 flex-col">
          {paginatedData.map((data, i) => {
            return <BedsSummery key={i} data={data} />
          })}
        </div>
        <div className="my-4 py-4">
          <Pagination
            curPage={page}
            handlePageChange={handlePageChange}
            totalPages={totalPage}
            resultsPerPage={10}
            resultsLength={patientCardData?.length}
          />
        </div>
      </div>
    </section>
  )
}
