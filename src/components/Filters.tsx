import clsx from 'clsx'
import { omit } from 'lodash-es'
import { useQueryParams } from 'raviger'
import React, { useEffect, useState } from 'react'
import { X } from 'react-feather'
import { UrlQuery } from '../types/urlQuery'
import { facilityOptions } from '../utils/constants'
import { stringToDate, toDateString } from '../utils/date'
import DatePicker from './DatePicker'
import MultiSelect from './MultiSelect'
import SlideOver from './SlideOver'

interface Props {
  tep?: string
}

export const Filters: React.FC<Props> = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [urlQuery, setURLQuery] = useQueryParams<UrlQuery>()

  const [tempUrlQuery, setTempURLQuery] = useState<UrlQuery>(urlQuery)

  const [dateFilterType, setDateFilterType] = useState<'SINGLE' | 'RANGE'>(
    'SINGLE'
  )

  useEffect(() => {
    if (selectedOptions.length)
      setTempURLQuery({
        ...tempUrlQuery,
        facility_type: selectedOptions.join(','),
      })
    else setTempURLQuery(omit(urlQuery, 'facility_type'))
  }, [selectedOptions])

  return (
    <section className="flex flex-row-reverse mt-4 mr-4">
      <button className="btn" onClick={() => setIsOpen(true)}>
        Filters
      </button>
      <SlideOver open={isOpen} setOpen={setIsOpen}>
        <div className="flex gap-4 justify-between items-center text-slate-900 dark:text-white ">
          <h1 className="text-2xl font-bold">Filters</h1>
          <button onClick={() => setIsOpen(false)}>
            <X />
          </button>
        </div>
        <div className="py-3">
          <MultiSelect
            selectedOptions={selectedOptions}
            setSelectedOptions={(options) => setSelectedOptions(options)}
            options={facilityOptions}
          />
        </div>
        <div className="text-slate-900 dark:text-slate-100 my-4">
          <div className="flex items-center justify-between gap-2 mb-4">
            <h1 className="text-lg">Filter By Date</h1>
            <div className="dark:text-white flex items-center justify-between gap-1 rounded-lg p-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
              <button
                className={clsx(
                  'px-2 rounded hover:bg-slate-200 hover:text-black dark:hover:text-white dark:hover:bg-slate-700',
                  dateFilterType === 'SINGLE' && 'bg-primary-700 text-white'
                )}
                onClick={() => setDateFilterType('SINGLE')}
              >
                Single
              </button>
              <button
                className={clsx(
                  'px-2 rounded hover:bg-slate-200 hover:text-black dark:hover:text-white dark:hover:bg-slate-700',
                  dateFilterType === 'RANGE' && 'bg-primary-700 text-white'
                )}
                onClick={() => setDateFilterType('RANGE')}
              >
                Range
              </button>
            </div>
          </div>
          {dateFilterType === 'SINGLE' ? (
            <DatePicker
              value={stringToDate(tempUrlQuery.date)}
              onChange={(date) =>
                setTempURLQuery(
                  omit(
                    {
                      ...tempUrlQuery,
                      date: toDateString(date),
                    },
                    'start_date',
                    'end_date'
                  )
                )
              }
              position="LEFT"
            />
          ) : (
            <div className="flex gap-2">
              <DatePicker
                value={stringToDate(tempUrlQuery.start_date)}
                onChange={(date) =>
                  setTempURLQuery(
                    omit(
                      {
                        ...tempUrlQuery,
                        start_date: toDateString(date),
                      },
                      'date'
                    )
                  )
                }
                position="LEFT"
              />
              <DatePicker
                value={stringToDate(tempUrlQuery.end_date)}
                onChange={(date) =>
                  setTempURLQuery(
                    omit(
                      {
                        ...tempUrlQuery,
                        end_date: toDateString(date),
                      },
                      'date'
                    )
                  )
                }
                position="RIGHT"
                disabled={!tempUrlQuery.start_date}
              />
            </div>
          )}
        </div>
        <div className="flex gap-2 mt-8">
          <button
            className="btn bg-slate-800 hover:bg-slate-700"
            onClick={() => {
              setURLQuery(
                omit(
                  urlQuery,
                  'date',
                  'start_date',
                  'end_date',
                  'facility_type'
                )
              )
              setIsOpen(false)
            }}
          >
            Reset
          </button>
          <button
            className="btn"
            onClick={() => {
              setURLQuery(tempUrlQuery)
              setIsOpen(false)
            }}
          >
            Apply
          </button>
        </div>
      </SlideOver>
    </section>
  )
}
