import { Link } from 'raviger'
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
  const {
    facility_name,
    facility_last_updated,
    facility_type,
    phone_number,
    facility_id,
  } = data
  const tableData = getOxygenTableRows(data)
  return (
    <div className={className}>
      <div className="flex justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-4">
          <h1 className="text-slate-900 dark:text-white text-3xl font-medium capitalize">
            <Link
              href={`/facility/${facility_id || ''}`}
              className="text-lg font-medium capitalize"
            >
              {facility_name}
            </Link>
          </h1>
          <span className="bg-primary-300 text-primary-900 font-bold text-sm px-2 rounded">
            {facility_type}
          </span>
        </div>
        <h1 className="text-base text-slate-500 dark:text-slate-400 font-medium">
          <span className="mr-2 text-slate-500">Last Updated</span>{' '}
          {facility_last_updated}
        </h1>
      </div>
      <div className="my-2 flex items-center gap-2">
        <Phone className="text-blue-500 fill-current w-4" fill="" />
        <a href={`tel:${phone_number || ''}`} className="text-blue-500">
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
