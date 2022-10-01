import clsx from 'clsx'
import { useQueryParams } from 'raviger'
import { useMemo } from 'react'
import {
  FacilitySummaryQuery,
  useFacilitySummary,
} from '../../api/queries/useFacilitySummary'
import { usePatientSummary } from '../../api/queries/usePatientSummery'
import { FacilityIcon } from '../../asset/icons/FacilityIcon'
import { FacilityBedMap } from '../../components/FacilityBedMap'
import { InfoCard } from '../../components/InfoCard'
import RadialCard from '../../components/RadialCard'
import { UsageCard } from '../../components/UsageCard'
import { UrlQuery } from '../../types/urlQuery'
import {
  AVAILABILITY_TYPES_TOTAL_ORDERED,
  AVAILABILITY_TYPES_ORDERED,
  AVAILABILITY_TYPES,
} from '../../utils/constants'
import {
  getDateFromQuery,
  toDateString,
  getNDateBefore,
  getNDateAfter,
} from '../../utils/date'
import {
  processFacilityData,
  processFacilityTrivia,
  processCapacityExportData,
  processFacilityCapacityTableData,
} from '../../utils/facility/capacity'
import { inventoryToUsageData } from '../../utils/facility/inventory'
import { getDistrictByName } from '../../utils/url'

interface Props {
  id?: string
}

const FacilityDetailsSkeleton = () => {
  return (
    <>
      <div className="bg-slate-200 dark:bg-slate-800 rounded animate-pulse h-10 w-1/2 mb-6" />
      <div className="bg-slate-200 dark:bg-slate-800 rounded animate-pulse h-4 w-2/3 mb-3" />
      <div className="bg-slate-200 dark:bg-slate-800 rounded animate-pulse h-3 w-1/4 mb-3" />
      <div className="bg-slate-200 dark:bg-slate-800 rounded animate-pulse h-3 w-1/5 mb-3" />
    </>
  )
}

export default function FacilityDetails(props: Props) {
  const [{ date }, setQuery] = useQueryParams<UrlQuery>()

  const queryDate = getDateFromQuery(date)

  const query: FacilitySummaryQuery = {
    facility: props.id,
    start_date: toDateString(getNDateBefore(queryDate, 10)),
    end_date: toDateString(getNDateAfter(queryDate, 1)),
    limit: 1000,
  }

  const { data, isLoading } = useFacilitySummary(query, !!props.id)
  const { data: patientData, isLoading: isPatientDataLoading } =
    usePatientSummary(query, !!props.id)
  const {
    name,
    address,
    facility_type,
    phone_number,
    ward_object,
    cover_image_url,
    local_body_object,
    district_object,
  } = data?.results?.[0]?.facility || {}

  const filtered = useMemo(
    () => processFacilityData(data?.results, []),
    [data?.results]
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

  console.log(patientData)

  // const { handlePageChange, page, paginatedData, totalPage } = usePaginateData({
  //   data: tableData,
  //   keys: ['facility_name'],
  //   searchValue,
  // })
  return (
    <section className="my-4">
      <div className="2xl:max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 lg:gap-12 xl:gap-16">
          <div
            className={clsx(
              'bg-slate-200 dark:bg-slate-800 row-span-1 aspect-square rounded-xl',
              (isLoading || isPatientDataLoading) && 'animate-pulse'
            )}
          >
            {cover_image_url ? (
              <img
                src={cover_image_url}
                alt={`${name || ''} cover image`}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <FacilityIcon className="w-16 h-16 fill-current text-slate-500" />
              </div>
            )}
          </div>
          <div className="col-span-2">
            {isLoading || isPatientDataLoading ? (
              <FacilityDetailsSkeleton />
            ) : (
              <>
                {' '}
                <h1 className="text-slate-900 dark:text-slate-100 font-bold text-4xl mb-6">
                  {name}
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-600 dark:text-slate-400">
                      Phone Number
                    </p>
                    <a
                      href={`tel:${phone_number || ''}`}
                      className="text-blue-500 font-medium text-lg"
                    >
                      {phone_number}
                    </a>
                  </div>
                  <div>
                    <p className="text-slate-600 dark:text-slate-400">
                      Facility Type
                    </p>
                    <p className="text-slate-900 dark:text-slate-100 font-medium text-lg">
                      {facility_type}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-600 dark:text-slate-400">
                      Local body
                    </p>
                    <p className="text-slate-900 dark:text-slate-100 font-medium text-lg">
                      {local_body_object?.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-600 dark:text-slate-400">Ward</p>
                    <p className="text-slate-900 dark:text-slate-100 font-medium text-lg">
                      {ward_object?.name}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-slate-600 dark:text-slate-400">Address</p>
                  <p className="text-slate-900 dark:text-slate-100 font-medium text-lg">
                    {address}
                  </p>
                </div>
              </>
            )}
          </div>
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
        <section id="inventory">
          <h1 className="dark:text-gray-100 text-2xl font-bold mb-4">
            Inventory
          </h1>
          <div>
            {Object.values(data?.results?.[0]?.data?.inventory || {}).length ? (
              Object.values(data?.results?.[0]?.data?.inventory || {})?.map(
                (d, i) => <UsageCard key={i} data={inventoryToUsageData(d)} />
              )
            ) : (
              <h1 className="my-8 text-center text-3xl text-slate-500 font-bold">
                No Data Available
              </h1>
            )}
          </div>
        </section>
        <section id="expected-burn-rate" className="py-4 my-4">
          <h1 className="dark:text-gray-100 text-2xl font-bold mb-4">
            Expected Burn Rate
          </h1>

          {patientData?.results[0]?.data
            ?.total_patients_bed_with_oxygen_support ||
          patientData?.results[0]?.data
            ?.total_patients_icu_with_oxygen_support ||
          patientData?.results[0]?.data
            ?.total_patients_icu_with_invasive_ventilator ||
          patientData?.results[0]?.data
            ?.total_patients_icu_with_non_invasive_ventilator ? (
            <div className="grid grid-cols-3 gap-4">
              <InfoCard
                title="Oxygen Bed"
                key="oxygen-bed"
                value={
                  patientData?.results[0]?.data
                    ?.total_patients_bed_with_oxygen_support *
                  7.4 *
                  8.778
                }
                unit={
                  <span className="ml-1 text-lg font-bold text-gray-300">
                    m<sup>3</sup>/hr
                  </span>
                }
              />
              <InfoCard
                title="ICU"
                key="icu"
                value={
                  patientData?.results[0]?.data
                    ?.total_patients_icu_with_oxygen_support *
                  10 *
                  8.778
                }
                unit={
                  <span className="ml-1 text-lg font-bold text-gray-300">
                    m<sup>3</sup>/hr
                  </span>
                }
              />
              <InfoCard
                title="Ventilator"
                key="ventilator"
                value={
                  (patientData?.results[0]?.data
                    ?.total_patients_icu_with_invasive_ventilator +
                    patientData?.results[0]?.data
                      ?.total_patients_icu_with_non_invasive_ventilator) *
                  10 *
                  8.778
                }
                unit={
                  <span className="ml-1 text-lg font-bold text-gray-300">
                    m<sup>3</sup>/hr
                  </span>
                }
              />
            </div>
          ) : (
            <h1 className="my-8 text-center text-3xl text-slate-500 font-bold">
              No Data Available
            </h1>
          )}
        </section>
        <section id="map">
          <h1 className="dark:text-gray-100 text-2xl font-bold mb-4">Map</h1>
          <FacilityBedMap
            facilities={filtered}
            district={getDistrictByName(district_object?.name)}
            isLoading={isLoading || isPatientDataLoading}
          />
        </section>
      </div>
    </section>
  )
}
