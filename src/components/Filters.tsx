import { omit } from 'lodash-es'
import { useQueryParams } from 'raviger'
import React, { useEffect, useState } from 'react'
import { X } from 'react-feather'
import { UrlQuery } from '../types/urlQuery'
import { facilityOptions } from '../utils/constants'
import MultiSelect from './MultiSelect'
import SlideOver from './SlideOver'

interface Props {
  tep?: string
}

export const Filters: React.FC<Props> = () => {
  const [isOpen, setIsOpen] = useState(true)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [urlQuery, setURLQuery] = useQueryParams<UrlQuery>()
  useEffect(() => {
    if (selectedOptions.length)
      setURLQuery({
        ...urlQuery,
        facility_type: selectedOptions.join(','),
      })
    else setURLQuery(omit(urlQuery, 'facility_type'))
  }, [selectedOptions])

  return (
    <section>
      <button className="btn" onClick={() => setIsOpen(true)}>
        Filters
      </button>
      <SlideOver open={isOpen} setOpen={setIsOpen}>
        <div className="flex gap-4 justify-between items-center text-slate-900 dark:text-white ">
          <h1 className="text-2xl font-bold">Filters</h1>
          <button onClick={() => setIsOpen(false)}>
            <X />
          </button>
        </div>
        <div className="py-3">
          <MultiSelect
            selectedOptions={selectedOptions}
            setSelectedOptions={(options) => setSelectedOptions(options)}
            options={facilityOptions}
          />
        </div>
      </SlideOver>
    </section>
  )
}
