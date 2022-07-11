import { Capacity } from '../../api/queries/useFacilitySummary'

interface GetColorArgs {
  color1?: string
  color2?: string
  ratio: number
}

type GetColor = (args: GetColorArgs) => string

export const getColor: GetColor = ({
  color1 = '00FF00',
  color2 = 'FF0000',
  ratio,
}) => {
  const hex = (color: number) => {
    const colorString = color.toString(16)
    return colorString.length === 1 ? `0${colorString}` : colorString
  }
  const r = Math.ceil(
    Number.parseInt(color2.slice(0, 2), 16) * ratio +
      Number.parseInt(color1.slice(0, 2), 16) * (1 - ratio)
  )
  const g = Math.ceil(
    Number.parseInt(color2.slice(2, 4), 16) * ratio +
      Number.parseInt(color1.slice(2, 4), 16) * (1 - ratio)
  )
  const b = Math.ceil(
    Number.parseInt(color2.slice(4, 6), 16) * ratio +
      Number.parseInt(color1.slice(4, 6), 16) * (1 - ratio)
  )
  return `#${hex(r)}${hex(g)}${hex(b)}`
}

type ColorClasses = (args: Capacity | undefined) => string

export const colorClasses: ColorClasses = (capacity) => {
  if (capacity) {
    const percent =
      (+capacity?.current_capacity / +capacity.total_capacity) * 100
    if (percent < 70.0) {
      return 'fill-current text-green-500'
    } else if (percent === 100.0) {
      return 'fill-current text-red-700'
    } else {
      return 'fill-current text-yellow-400'
    }
  } else {
    return 'fill-current text-blue-500'
  }
}

interface CanShowBedArgs {
  capacity?: { room_type?: number | string; total_capacity: number | string }
  filter: string
}

type CanShowBed = (args: CanShowBedArgs) => boolean

export const canShowBed: CanShowBed = ({ capacity, filter }) => {
  if (String(filter) === 'All') {
    return true
  }
  if (capacity && String(capacity.room_type) === String(filter)) {
    return capacity.total_capacity !== 0
  } else {
    return false
  }
}

export const bedClasses = (zoom: number) => {
  if (zoom < 11) {
    return 'w-6 h-6'
  } else if (zoom < 14) {
    return 'w-8 h-8'
  } else {
    return 'w-10 h-10'
  }
}

export const selectedButtonClasses = (isSelected: boolean) => {
  const base = ' px-4 py-3 rounded-lg shadow text-lg '
  return (
    base +
    (isSelected
      ? 'bg-green-500 text-white'
      : 'dark:hover:bg-green-500 hover:text-white hover:bg-green-500 bg-white dark:bg-black text-gray-800 dark:text-gray-300 ')
  )
}
