import { filter } from 'lodash-es'
import { useQueryParams } from 'raviger'
import { useState, useMemo } from 'react'
import {
  FacilitySummaryQuery,
  useFacilitySummary,
} from '../../api/queries/useFacilitySummary'
import { FacilityBedMap } from '../../components/FacilityBedMap'
import { UrlQuery } from '../../types/urlQuery'
import {
  getDateFromQuery,
  toDateString,
  getNDateBefore,
  getNDateAfter,
} from '../../utils/date'
import { processFacilityData } from '../../utils/facility/capacity'
import { getDistrictByName } from '../../utils/url'

interface Props {
  districtName?: string
}

export default function Map({ districtName }: Props) {
  const [{ date }, setQuery] = useQueryParams<UrlQuery>()
  const [searchValue, setSearchValue] = useState('')

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
  const todayFiltered = useMemo(
    () => filter(filtered, (f) => f.date === toDateString(queryDate)),
    [queryDate, filtered]
  )

  return (
    <section className="my-4">
      <div className="2xl:max-w-7xl mx-auto px-4">
        <FacilityBedMap
          isLoading={isLoading}
          facilities={todayFiltered}
          district={getDistrictByName(districtName)}
        />
      </div>
    </section>
  )
}
