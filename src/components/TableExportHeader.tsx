import clsx from 'clsx'
import React from 'react'
import { CSVLink } from 'react-csv'
import { ExportData } from '../types/exportData'

interface TableExportHeaderProps {
  label: string
  exportData?: ExportData
  searchValue: string
  setSearchValue: (value: string) => void
  className?: string
}

export const TableExportHeader: React.FC<TableExportHeaderProps> = ({
  exportData,
  label,
  searchValue,
  setSearchValue,
  className,
}) => {
  return (
    <div
      className={clsx(
        'items-center flex flex-col gap-4 justify-between md:flex-row',
        className
      )}
    >
      <h1 className="dark:text-gray-100 text-2xl font-bold">{label}</h1>
      <div className="flex max-w-full gap-4">
        {exportData && (
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          <CSVLink data={exportData?.data} filename={exportData?.filename}>
            <button className="btn" disabled={!exportData}>
              Export
            </button>
          </CSVLink>
        )}

        <input
          className="input"
          placeholder="Search Facility"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
        />
      </div>
    </div>
  )
}
