import { filter } from 'lodash-es'
import { useQueryParams } from 'raviger'
import { useMemo } from 'react'
import useFacilitySummary, {
  FacilitySummaryQuery,
} from '../../api/queries/useFacilitySummary'
import { FacilityBedMap } from '../../components/FacilityBedMap'
import TitleBar from '../../components/TitleBar'
import { UrlQuery } from '../../types/urlQuery'
import {
  getDateFromQuery,
  toDateString,
  getNDateBefore,
  getNDateAfter,
} from '../../utils/date'
import { processFacilityData } from '../../utils/facility/capacity'
import { getDistrictByName, getFacilitiesFromQuery } from '../../utils/url'

interface Props {
  districtName?: string
}

export default function Map({ districtName }: Props) {
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
  const todayFiltered = useMemo(
    () => filter(filtered, (f) => f.date === toDateString(queryDate)),
    [queryDate, filtered]
  )

  return (
    <section className="my-4">
      <div className="2xl:max-w-7xl mx-auto px-4">
        <TitleBar
          isLoading={isLoading}
          district={districtName}
          endpoint={'map'}
        />

        <FacilityBedMap
          isLoading={isLoading}
          facilities={todayFiltered}
          district={getDistrictByName(districtName)}
        />
      </div>
    </section>
  )
}
