/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import clsx from 'clsx'
import { ColumnType, DefaultRecordType } from 'rc-table/lib/interface'
import relativeTime from 'dayjs/plugin//relativeTime'
import dayjs from 'dayjs'
import { Database, Activity, Clock, AlertTriangle } from 'react-feather'
import {
  clone,
  mapValues,
  entries,
  filter,
  keys,
  reduce,
  sumBy,
  values,
  map,
  flatMap,
} from 'lodash-es'
import { Inventory } from '../../api/queries/useFacilitySummary'
import { Nullable } from '../../types'
import {
  OXYGEN_INVENTORY_ENUM,
  OXYGEN_INVENTORY_MAP,
  OXYGEN_INVENTORY_NAME,
  OXYGEN_INVENTORY_STRING_ENUM,
} from '../constants'
import { toDateString } from '../date'
import { ProcessFacilityDataReturn } from './capacity'

dayjs.extend(relativeTime)

interface OxygenType<T = unknown> {
  oxygen_capacity: Nullable<T>
  type_d_cylinders: Nullable<T>
  type_c_cylinders: Nullable<T>
  type_b_cylinders: Nullable<T>
}

export interface OxygenCardData {
  facility_id: Nullable<string>
  facility_name: Nullable<string>
  facility_type: Nullable<string>
  phone_number: Nullable<string>
  facility_last_updated: Nullable<string>
  last_updated: OxygenType<string>
  quantity: OxygenType<string>
  burn_rate: OxygenType<string>
  time_to_empty: OxygenType<string>
  quantity_unit: OxygenType<string>
  is_low: OxygenType<boolean>
}

type GetOxygenCardData = (
  data?: ProcessFacilityDataReturn,
  filter?: {
    date?: string
  }
) => OxygenCardData[]

const initialValue = {
  oxygen_capacity: null,
  type_d_cylinders: null,
  type_c_cylinders: null,
  type_b_cylinders: null,
}
const processFacilityOxygenCardData = (
  facility: ProcessFacilityDataReturn[number]
) => {
  const last_updated: OxygenType<string> = clone(initialValue)
  const quantity: OxygenType<string> = clone(initialValue)
  const burn_rate: OxygenType<string> = clone(initialValue)
  const time_to_empty: OxygenType<string> = clone(initialValue)
  const quantity_unit: OxygenType<string> = clone(initialValue)
  const is_low: OxygenType<boolean> = clone(initialValue)

  entries(OXYGEN_INVENTORY_MAP).forEach(([k, id]) => {
    const inventory = facility?.inventory?.[id]

    if (inventory) {
      const last_updated_date = dayjs(
        facility.inventory?.[id].modified_date
      ).fromNow()

      const curType = OXYGEN_INVENTORY_ENUM[
        id
      ] as unknown as keyof typeof OXYGEN_INVENTORY_ENUM

      const quantity_info = `${
        facility.inventory?.[id]?.stock?.toFixed(2) || ''
      } / ${
        curType === 'oxygen_capacity'
          ? (facility[curType] * 0.8778).toFixed(2)
          : facility[curType]
      }`

      const cur_quantity_unit = inventory.unit
      const cur_burn_rate =
        inventory.burn_rate > 0 ? inventory.burn_rate?.toFixed(2) : ''
      const time_info =
        inventory.burn_rate > 0
          ? (inventory.stock / inventory.burn_rate).toFixed(2)
          : ''

      const key = k as keyof typeof OXYGEN_INVENTORY_MAP

      last_updated[key] = last_updated_date
      quantity[key] = quantity_info
      quantity_unit[key] = cur_quantity_unit
      burn_rate[key] = cur_burn_rate
      time_to_empty[key] = time_info
      is_low[key] = inventory.is_low
    }
  })

  const data = {
    last_updated,
    quantity,
    burn_rate,
    time_to_empty,
    quantity_unit,
    is_low,
  }

  return data
}

export const getOxygenCardData: GetOxygenCardData = (data, filter = {}) => {
  const { date } = filter
  return reduce(
    data,
    (acc, cur) => {
      if (cur.date === (date || toDateString(new Date()))) {
        if (
          cur.inventory &&
          keys(cur.inventory).length !== 0 &&
          keys(cur.inventory).some((key) =>
            Object.values(OXYGEN_INVENTORY_ENUM).includes(+key)
          )
        ) {
          return [
            ...acc,
            {
              facility_id: cur.id,
              facility_name: cur.name,
              facility_type: cur.facility_type,
              phone_number: cur.phone_number,
              facility_last_updated: dayjs(
                cur.inventory_modified_date
              ).fromNow(),
              ...processFacilityOxygenCardData(cur),
            },
          ]
        }
        return acc
      }
      return acc
    },
    [] as OxygenCardData[]
  )
}

export const getOxygenFlatData = (
  data?: ProcessFacilityDataReturn,
  filterDate?: string
): Inventory[] => {
  const p1 = filter(data, (c) => {
    return !!(
      c.date === (filterDate || toDateString(new Date())) &&
      c.inventory &&
      Object.keys(c.inventory).length !== 0 &&
      Object.keys(c.inventory).some((key) =>
        Object.values(OXYGEN_INVENTORY_ENUM).includes(Number(key))
      )
    )
  })
  const p2 = map(p1, (c) => values(c.inventory))
  return flatMap(p2)
}
export const getOxygenSummeryConfig = (data: Inventory[]) => {
  return Object.values(OXYGEN_INVENTORY_NAME).map((name) => {
    const entries = filter(data, (f) => f.item_name === name)
    const stock = sumBy(entries, (f) => f.stock)
    const valid_entries = filter(entries, (a) => !!a?.burn_rate)
    const valid_nonzero_entries = filter(valid_entries, (a) => a.stock !== 0)
    const burn_rate = sumBy(valid_nonzero_entries, 'burn_rate')
    const facilities_with_less_than_5_hrs_of_oxygen = filter(
      valid_nonzero_entries,
      (p) => p.stock / p.burn_rate < 5
    )

    const config = [
      {
        icon: <Database className="text-blue-500 mr-4" size="40px" />,
        label: name,
        value: stock - Math.floor(stock) !== 0 ? +stock.toFixed(2) : stock,
        unit: entries[0]?.unit,
      },
      {
        icon: <Activity className="text-yellow-400 mr-4" size="40px" />,
        label: 'Burn Rate',
        value: +(burn_rate?.toFixed(2) || 0),
        unit: entries[0]?.unit ? `${entries[0]?.unit} / hour` : '',
      },
      {
        icon: <Clock className="text-green-500 mr-4" size="40px" />,
        label: 'Time to Empty',
        value: burn_rate > 0 ? +(stock / burn_rate).toFixed(2) : 0,
        unit: 'Hours',
      },
      {
        icon: <AlertTriangle className="text-red-500 mr-4" size="40px" />,
        label: 'High Alerts',
        value: `${facilities_with_less_than_5_hrs_of_oxygen.length}`,
        unit: 'Facilities',
      },
    ]
    return config
  })
}

type OxygenMapKeys = keyof OxygenType<string>

export const getOxygenTableRows = (data: OxygenCardData) => {
  return [
    {
      name: (
        <h1 className="dark:text-white text-base" key="last-updated">
          Last Updated
        </h1>
      ),
      ...mapValues(data.last_updated, (val, key) => {
        return (
          <span key={`last-${key}`} className="text-slate-300 text-base">
            {val || '---'}
          </span>
        )
      }),
    },
    {
      name: (
        <div className="flex" key="quantity">
          <Database className="text-blue-500 mr-4" />
          <h1 className="dark:text-white text-base">Quantity</h1>
        </div>
      ),

      ...mapValues(data.quantity, (val, key: OxygenMapKeys) => {
        const isLow = data.is_low[key]
        return (
          <div key={`q-${key}`}>
            <h1
              className={clsx(
                'text-base text-slate-300',
                isLow && 'text-red-500'
              )}
            >
              {val || '---'}{' '}
              <span className="text-base text-slate-500">
                {data.quantity_unit[key] || ''}
              </span>
            </h1>
          </div>
        )
      }),
    },
    {
      name: (
        <div className="flex" key="burn-rate">
          <Activity className="text-yellow-400 mr-4" />
          <h1 className="dark:text-white text-base">Burn Rate</h1>
        </div>
      ),
      ...mapValues(data.burn_rate, (val, key: OxygenMapKeys) => {
        const unit = data.quantity_unit[key]
        const isLow = data.is_low[key]
        return (
          <div key={`burn-${key}`}>
            <h1
              className={clsx(
                'text-base text-slate-300',
                isLow && 'text-red-500'
              )}
            >
              {val || '---'}{' '}
              <span className="text-base text-slate-500">
                {unit && val ? `${unit} / Hr` : ''}
              </span>{' '}
            </h1>
          </div>
        )
      }),
    },
    {
      name: (
        <div className="flex" key={'time-to-empty'}>
          <Clock className="text-green-500 mr-4" />
          <h1 className="dark:text-white text-base">Time To Empty</h1>
        </div>
      ),
      ...mapValues(data.time_to_empty, (val, key: OxygenMapKeys) => {
        const isLow = data.is_low[key]
        return (
          <div key={`time-${key}`} className={clsx(val && isLow && 'pulse')}>
            <h1 className="text-base text-slate-300">
              {val || '---'}{' '}
              {val && <span className="text-base text-slate-500">Hr</span>}
            </h1>
          </div>
        )
      }),
    },
  ]
}

/*s
export const processOxygenExportData = (
  facilityData: ProcessFacilityDataReturn,
  date: Date
) => {
  const filename = 'oxygen_export.csv'

  const data = reduce(
    facilityData,
    (a, c) => {
      if (c.date !== toDateString(date)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return a
      }

      if (
        !(
          c.inventory &&
          keys(c.inventory).length !== 0 &&
          keys(c.inventory).some((e) => values(OXYGEN_INVENTORY).includes(+e))
        )
      ) {
        return a
      }

      const additionalData = values(OXYGEN_INVENTORY).reduce((acc, cur) => {
        const copy = cloneDeep(acc)

        if (c.inventory?.[cur]?.item_name) {
          copy[`Opening Stock ${c.inventory?.[cur]?.item_name}`] =
            c.inventory[cur]?.start_stock || 0
          copy[`Stock Added Today ${c.inventory[cur]?.item_name}`] =
            c.inventory[cur]?.total_added || 0
          copy[`Closing Stock ${c.inventory[cur]?.item_name}`] =
            c.inventory[cur]?.end_stock || 0
          copy[`Total Consumed ${c.inventory[cur]?.item_name}`] =
            c.inventory[cur]?.total_consumed || 0
          copy[`Current Stock ${c.inventory[cur]?.item_name}`] =
            c.inventory[cur]?.stock || 0
          copy[`Unit ${c.inventory[cur]?.item_name}`] =
            c.inventory[cur]?.unit || 0
          copy[`Is Low ${c.inventory[cur]?.item_name}`] =
            c.inventory[cur]?.is_low || 0
          copy[`Burn Rate ${c.inventory[cur]?.item_name}`] =
            c.inventory[cur]?.burn_rate || 0
          copy[`Updated at ${c.inventory[cur]?.item_name}`] =
            c.inventory[cur]?.modified_date || 0
        }
        return copy
      }, {} as any)

      const newData = {
        'Govt/Pvt': c.facility_type,
        'Hops/CFLTC':
          c.facility_type === 'First Line Treatment Centre' ? 'CFLTC' : 'Hops',
        'Hospital/CFLTC Address': c.address,
        'Hospital/CFLTC Name': c.name,
        Mobile: c.phone_number,
        'Expected Liquid Oxygen': c.expected_oxygen_requirement,
        'Expected Type B Cylinders': c.expected_type_b_cylinders,
        'Expected Type C Cylinders': c.expected_type_c_cylinders,
        'Expected Type D Cylinders': c.expected_type_d_cylinders,
        'Capacity Liquid Oxygen': c.oxygen_capacity,
        'Capacity Type B Cylinders': c.type_b_cylinders,
        'Capacity Type C Cylinders': c.type_c_cylinders,
        'Capacity Type D Cylinders': c.type_d_cylinders,
        ...additionalData,
      }

      return [...a, newData]
    },
    [] as unknown[]
  )

  return { data, filename }
}
*/

export const oxygenTableColumns: ColumnType<DefaultRecordType>[] = [
  {
    title: '',
    dataIndex: 'name',
    width: '1rem',
    align: 'left',
  },
  {
    title: 'LIQUID OXYGEN',
    key: OXYGEN_INVENTORY_STRING_ENUM.oxygen_capacity,
    dataIndex: OXYGEN_INVENTORY_STRING_ENUM.oxygen_capacity,
    width: '1rem',
    align: 'right',
  },
  {
    title: 'CYLINDER D',
    key: OXYGEN_INVENTORY_STRING_ENUM.type_d_cylinders,
    dataIndex: OXYGEN_INVENTORY_STRING_ENUM.type_d_cylinders,
    width: '1rem',
    align: 'right',
  },
  {
    title: 'CYLINDER C',
    key: OXYGEN_INVENTORY_STRING_ENUM.type_c_cylinders,
    dataIndex: OXYGEN_INVENTORY_STRING_ENUM.type_c_cylinders,
    width: '1rem',
    align: 'right',
  },
  {
    title: 'CYLINDER B',
    key: OXYGEN_INVENTORY_STRING_ENUM.type_b_cylinders,
    dataIndex: OXYGEN_INVENTORY_STRING_ENUM.type_b_cylinders,
    width: '1rem',
    align: 'right',
  },
]
