import React, { useState } from 'react'
import { Calendar, Check, X } from 'react-feather'
import SelectDate from '../common/SelectDate'
import FacilityMultiSelect from '../common/FacilityMultiSelect'
import { useQueryParams } from 'raviger'
import { UrlQuery } from '../types/urlQuery'
import _ from 'lodash'
interface FiltersProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  selectedFacilities: any
  setSelectedFacilities: React.Dispatch<React.SetStateAction<any>>
  selectedDate: any
  setSelectedDate: React.Dispatch<React.SetStateAction<any>>
  selectedEndDate: any
  setSelectedEndDate: any
}

const Filters: React.FC<FiltersProps> = ({
  setOpen,
  selectedFacilities,
  setSelectedFacilities,
  selectedDate,
  setSelectedDate,
  selectedEndDate,
  setSelectedEndDate,
}) => {
  const [urlQuery, setURLQuery] = useQueryParams<UrlQuery>()
  const [range, setRange] = useState<boolean>(false)

  const handleToggle = (val: boolean) => {
    if (val) {
      setRange(true)
    } else {
      setURLQuery(_.omit(urlQuery, 'end_date'))
      setRange(false)
    }
  }

  const handleClearFilter = () => {
    setSelectedFacilities([])
    setSelectedDate(null)
    setSelectedEndDate(null)
    setOpen(false)
    setURLQuery({})
  }

  return (
    <div className="">
      <div className="flex flex-wrap justify-between">
        <button
          className="btn bg-red-500 hover:bg-red-700 mr-1 my-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          onClick={() => setOpen(false)}
        >
          <X />
          <span className="ml-2">Cancel</span>
        </button>
        <button
          className="btn bg-red-500 hover:bg-red-700 mx-1 my-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          onClick={handleClearFilter}
        >
          <X />
          <span className="ml-2">Clear Filter</span>
        </button>
        <button className="btn ml-1 my-1" onClick={() => setOpen(false)}>
          <Check />
          <span className="ml-2">Apply</span>
        </button>
      </div>
      <div className="mt-4 text-white">
        <div className="">Filter by:</div>
        <div className="mt-8">
          <div className="mb-4">Facility Type</div>
          <FacilityMultiSelect
            selectedFacilities={selectedFacilities}
            setSelectedFacilities={setSelectedFacilities}
          />
        </div>
        <div className="mt-8">
          <div className="flex justify-between">
            <div className="mb-4">Date</div>
            <div className="flex flex-row-reverse">
              <button
                onClick={() => {
                  handleToggle(true)
                }}
                className={`btn rounded-l-none mb-2 ${
                  range && 'bg-primary-700'
                }`}
              >
                Range
              </button>
              <button
                onClick={() => {
                  handleToggle(false)
                }}
                className={`btn rounded-r-none mb-2 ${
                  !range && 'bg-primary-700'
                }`}
              >
                Single
              </button>
            </div>
          </div>
          <div className="mb-4">
            {range && <span className="mb-2">Start date:</span>}
            <SelectDate
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              query={'date'}
            />
          </div>
          {range && (
            <div className="">
              <span className="mb-2">End date:</span>
              <SelectDate
                selectedDate={selectedEndDate}
                setSelectedDate={setSelectedEndDate}
                query={'end_date'}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Filters
