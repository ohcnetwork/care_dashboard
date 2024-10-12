import clsx from 'clsx'
import React from 'react'

interface Props {
  title: string
  value: string | number
  isLoading?: boolean
}

export const ValuePill: React.FC<Props> = ({ title, value, isLoading }) => {
  return (
    <div
      className={clsx(
        'shadow-xs ne rounded-lg translate-x-0',
        isLoading
          ? 'bg-slate-200 dark:bg-slate-800 animate-pulse'
          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-gray-200 opacity-100'
      )}
    >
      <div
        className={clsx(
          'flex nn items-center justify-between rounded-lg transition-all',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
      >
        <span className="block mx-3 text-xs font-medium xl:text-base py-1">
          {title}
        </span>
        <div className="flex items-center text-xs font-medium bg-primary-500 dark:bg-opacity-50 rounded-md xl:text-base m-1">
          <span className="inline-flex items-center justify-center align-bottom px-3 py-1 text-white leading-5 rounded-md shadow-xs">
            {value}
          </span>
        </div>
      </div>
    </div>
  )
}
