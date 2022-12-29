import { Filters } from './Filters'
import { ValuePill } from './ValuePill'
import clsx from 'clsx'
import DropDown from './DropDown'
import { ACTIVATED_DISTRICTS } from '../utils/constants'
import { getDistrictByName, parameterize } from '../utils/url'

interface IPill {
  title: string
  value: string | number
}

interface ITitleBarProps {
  isLoading?: boolean
  district?: string
  endpoint?: string
  pills?: IPill[]
}

export default function TitleBar({
  isLoading = false,
  district = 'all',
  endpoint = 'capacity',
  pills = [],
}: ITitleBarProps) {
  return (
    <>
      <div className="relative">
        {isLoading ? (
          <div className="absolute top-0 left-0 h-full rounded-xl animate-pulse bg-slate-200 dark:bg-slate-800 w-32"></div>
        ) : null}
        <div
          className={clsx(
            'flex gap-2 justify-between items-center',
            isLoading && 'opacity-0 pointer-events-none'
          )}
        >
          <div className="flex">
            <h1 className="text-xl text-slate-900 dark:text-white font-medium capitalize">
              {endpoint}
            </h1>

            <DropDown
              className="ml-4 !w-48"
              placeholder="Change District"
              options={ACTIVATED_DISTRICTS}
              selected={getDistrictByName(district)}
              onSelect={(option) =>
                (window.location.href = `/district/${parameterize(
                  option.name as string
                )}/${endpoint}`)
              }
            />
          </div>
          <Filters />
        </div>
      </div>

      <div className="grid gap-1 grid-rows-none mb-8 sm:grid-flow-col-dense sm:grid-rows-1 sm:place-content-end my-5">
        {pills?.map(({ title, value }) => (
          <ValuePill
            key={title}
            isLoading={isLoading}
            title={title}
            value={value}
          />
        ))}
      </div>
    </>
  )
}
