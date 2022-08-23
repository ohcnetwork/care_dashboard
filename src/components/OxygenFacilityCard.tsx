import React from 'react'
import { Phone } from 'react-feather'
import {
  getOxygenTableRows,
  OxygenCardData,
  oxygenTableColumns,
} from '../utils/facility/oxygen'
import { Table } from './Table'

interface OxygenFacilityCardProps {
  className?: string
  data: OxygenCardData
}
export const OxygenFacilityCard: React.FC<OxygenFacilityCardProps> = ({
  className,
  data,
}) => {
  const { facility_name, facility_last_updated, facility_type, phone_number } =
    data
  const tableData = getOxygenTableRows(data)
  return (
    <div className={className}>
      <div className="flex justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-4">
          <h1 className="dark:text-white text-3xl font-medium capitalize">
            {facility_name}
          </h1>
          <span className="font-medium text-sm border-blue-700 dark:bg-blue-900 bg-blue-200 rounded-full py-1 px-2 text-black dark:text-white">
            {facility_type}
          </span>
        </div>
        <h1 className="text-base text-slate-400 font-medium">
          <span className="mr-2 text-slate-500">Last Updated</span>{' '}
          {facility_last_updated}
        </h1>
      </div>
      <div className="my-2 flex items-center gap-2">
        <Phone className="text-blue-500 fill-current w-4" fill="" />
        <a
          href={`tel:${phone_number || ''}`}
          className="text-black dark:text-blue-500"
        >
          {phone_number}
        </a>
      </div>
      <div className="mt-4">
        <Table
          columns={oxygenTableColumns}
          data={tableData}
          scroll={{ x: '900px' }}
        />{' '}
      </div>
    </div>
  )
}
