import React from 'react'
import Example from '../common/SlideOver'
import * as Icon from 'react-feather'
interface FilterProps {
  setOpen: () => void
}

const FilterButton: React.FC<FilterProps> = ({ setOpen }) => {
  return (
    <button className="btn" onClick={setOpen}>
      <Icon.Filter size={14} />
      <span className="ml-2 text-lg">Filters</span>
    </button>
  )
}

export default FilterButton
