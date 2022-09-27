import clsx from 'clsx'
import { Link } from 'raviger'
import React from 'react'
import { CapacityCardDataForCapacity } from '../utils/facility/capacity'

interface Props {
  data: CapacityCardDataForCapacity
}

export const FacilityCapacityTableCard = (props: Props) => {
  const {
    facility_id,
    facility_name,
    facility_type,
    last_updated,
    patient_discharged,
    phone_number,
    covid,
    final_total,
    non_covid,
  } = props.data
  return (
    <div className="p-4 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 mb-2 rounded-2xl dark:text-white overflow-x-auto">
      <div className="flex gap-2 items-center justify-between flex-wrap">
        <div className="flex gap-2 flex-wrap items-center">
          <Link
            href={`/facility/${facility_id || ''}`}
            className="text-lg font-medium capitalize"
          >
            {facility_name}
          </Link>
          <span className="bg-primary-300 text-primary-900 font-bold text-sm px-2 rounded">
            {facility_type}
          </span>
        </div>
        <div className="flex gap-4">
          <h1 className="text-sm">
            <span className="mr-2 text-slate-400">Last Updated</span>{' '}
            <span className="text-base font-bold">{last_updated}</span>
          </h1>
          <h1 className="text-sm">
            <span className="mr-2 text-slate-400"> Patient Discharged</span>
            <span className="text-base font-bold">{patient_discharged}</span>
          </h1>
        </div>
      </div>
      <div className="mt-1">
        <a
          className="text-blue-500 font-medium"
          href={`tel:+${phone_number || ''}`}
        >
          {phone_number}
        </a>
      </div>
      <div className="mt-2">
        <table>
          <thead>
            <tr className="opacity-80">
              <th></th>
              <th colSpan={3}>Ordinary Beds</th>
              <th colSpan={3} className="border-l dark:border-slate-600">
                Oxygen Beds
              </th>
              <th colSpan={3} className="border-l dark:border-slate-600">
                ICU
              </th>
              <th colSpan={3} className="border-l dark:border-slate-600">
                Ventilators
              </th>
            </tr>
            <tr>
              <th></th>
              <th className="border-b border-b-slate-600 text-red-500 font-medium">
                Used
              </th>
              <th className="border-b border-b-slate-600 text-green-400">
                Vacant
              </th>
              <th>Total</th>
              <th className="border-l dark:border-slate-600 text-red-500 font-medium">
                Used
              </th>
              <th className="border-b border-b-slate-600 text-green-400">
                Vacant
              </th>
              <th>Total</th>
              <th className="border-l dark:border-slate-600 text-red-500 font-medium">
                Used
              </th>
              <th className="border-b border-b-slate-600 text-green-400">
                Vacant
              </th>
              <th>Total</th>
              <th className="border-l dark:border-slate-600 text-red-500 font-medium">
                Used
              </th>
              <th className="border-b border-b-slate-600 text-green-400">
                Vacant
              </th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-left">Covid</td>
              {covid?.map((d, i) => {
                return (
                  <React.Fragment key={i}>
                    <td
                      className={clsx(
                        i && 'border-l dark:border-slate-600',
                        'text-red-500 font-medium'
                      )}
                    >
                      {d.used}
                    </td>
                    <td className="text-green-300 font-bold">{d.vacant}</td>
                    <td>{d.total}</td>
                  </React.Fragment>
                )
              })}
            </tr>
            <tr>
              <td className="text-left">Non-Covid</td>
              {non_covid?.map((d, i) => {
                return (
                  <React.Fragment key={i}>
                    <td
                      className={clsx(
                        i && 'border-l dark:border-slate-600',
                        'text-red-500 font-medium'
                      )}
                    >
                      {d.used}
                    </td>
                    <td className="text-green-300 font-bold">{d.vacant}</td>
                    <td>{d.total}</td>
                  </React.Fragment>
                )
              })}
            </tr>
            <tr>
              <td className="text-left">Total</td>
              {final_total?.map((d, i) => {
                return (
                  <React.Fragment key={i}>
                    <td
                      className={clsx(
                        i && 'border-l dark:border-slate-600',
                        'text-red-500 font-medium'
                      )}
                    >
                      {d.used}
                    </td>
                    <td className="text-green-300 font-bold">{d.vacant}</td>
                    <td>{d.total}</td>
                  </React.Fragment>
                )
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
