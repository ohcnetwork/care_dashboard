import { setQueryParamsOptions } from 'raviger'
import * as React from 'react'
import { Check, X } from 'react-feather'
import FacilityMultiSelect from '../common/FacilityMultiSelect'
import { UrlQuery } from '../types/urlQuery'

interface FiltersProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  selectedFacilities: any
  setSelectedFacilities: React.Dispatch<React.SetStateAction<any>>
}

const Filters: React.FC<FiltersProps> = ({
  setOpen,
  selectedFacilities,
  setSelectedFacilities,
}) => {
  const handleClearFilter = () => {
    setSelectedFacilities([])
    setOpen(false)
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
          <div className="mb-4">Date</div>
        </div>
      </div>
    </div>
  )
}

export default Filters
