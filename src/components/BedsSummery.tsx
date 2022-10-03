import { Link } from 'raviger'
import React from 'react'
import { PatientCardDataForCapacity } from '../utils/facility/patient'
import InfoCard from './InfoCard'

interface BedsSummeryProps {
  data: PatientCardDataForCapacity
}

const BedsSummery: React.FC<BedsSummeryProps> = ({ data }) => {
  return (
    <div className="p-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl dark:text-white text-slate-900">
      <div className="flex gap-2 items-center justify-between flex-wrap">
        <div className="flex gap-2 flex-wrap items-center">
          <Link
            href={`/facility/${data.id || ''}`}
            className="text-lg font-medium capitalize"
          >
            {data.facility_name}
          </Link>
          <span className="bg-primary-300 text-primary-900 font-bold text-sm px-2 rounded">
            {data.facility_type}
          </span>
        </div>
        <div className="flex gap-4">
          <h1 className="text-sm">
            <span className="mr-2 text-slate-500 dark:text-slate-400">
              Last Updated
            </span>{' '}
            <span className="text-base font-bold">{data.last_updated}</span>
          </h1>
        </div>
      </div>
      <div className="mt-1">
        <a
          className="text-blue-500 font-medium"
          href={`tel:+${data.phone_number || ''}`}
        >
          {data.phone_number}
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4">
        <div>
          <h1 className="text-lg dark:text-slate-200 mb-4">ISOLATION</h1>
          <div className="grid grid-cols-1 gap-2">
            <InfoCard
              className="bg-slate-50 dark:bg-slate-900"
              title="Home Isolation"
              value={data.home_isolation?.total || 0}
              delta={data.home_isolation?.today || 0}
            />
            <InfoCard
              className="bg-slate-50 dark:bg-slate-900"
              title="Isolation Room"
              value={data.isolation?.total || 0}
              delta={data.isolation?.today || 0}
            />
          </div>
        </div>

        <div>
          <h1 className="text-lg dark:text-slate-200 mb-4">OXYGEN BEDS</h1>
          <div className="grid grid-cols-1 gap-2">
            <InfoCard
              className="bg-slate-50 dark:bg-slate-900"
              title="Oxygen Bed"
              value={data.oxygen_bed?.total || 0}
              delta={data.oxygen_bed?.today || 0}
            />
          </div>
        </div>
        <div>
          <h1 className="text-lg dark:text-slate-200 mb-4">ICU</h1>
          <div className="grid grid-cols-2 gap-2">
            <InfoCard
              className="bg-slate-50 dark:bg-slate-900"
              title="ICU"
              value={data.icu?.total || 0}
              delta={data.icu?.today || 0}
            />
            <InfoCard
              className="bg-slate-50 dark:bg-slate-900"
              title="Oxygen Supports"
              value={data.oxygen_bed?.today || 0}
            />
            <InfoCard
              className="bg-slate-50 dark:bg-slate-900"
              title="Non Invasive Ventilator"
              value={data.icu_with_non_invasive_ventilator?.total || 0}
              delta={data.icu_with_non_invasive_ventilator?.today || 0}
            />
            <InfoCard
              className="bg-slate-50 dark:bg-slate-900"
              title="Invasive Ventilator"
              value={data.icu_with_invasive_ventilator?.total || 0}
              delta={data.icu_with_invasive_ventilator?.today || 0}
            />
          </div>
        </div>
        <div>
          <h1 className="text-lg dark:text-slate-200 mb-4">WARDS</h1>
          <div className="grid grid-cols-1 gap-2">
            <InfoCard
              className="bg-slate-50 dark:bg-slate-900"
              title="Gynecology Ward"
              value={data.gynaecology_ward?.total || 0}
              delta={data.gynaecology_ward?.today || 0}
            />
            <InfoCard
              className="bg-slate-50 dark:bg-slate-900"
              title="Paediatric Ward"
              value={data.paediatric_ward?.total || 0}
              delta={data.paediatric_ward?.today || 0}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BedsSummery
