import { useState, useEffect } from 'react'
import {
  format,
  subMonths,
  addMonths,
  subYears,
  addYears,
  isEqual,
  getDaysInMonth,
  getDay,
} from 'date-fns'
import { ArrowLeft, ArrowRight, Calendar } from 'react-feather'
import _ from 'lodash'
import clsx from 'clsx'

type DatePickerType = 'date' | 'month' | 'year'

interface Props {
  value: Date
  onChange: (date: Date) => void
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const DatePicker: React.FC<Props> = ({ value, onChange }) => {
  const [dayCount, setDayCount] = useState<Array<number>>([])
  const [blankDays, setBlankDays] = useState<Array<number>>([])

  const [showDatePicker, setShowDatePicker] = useState(true)
  const [datePickerHeaderDate, setDatePickerHeaderDate] = useState(new Date())
  const [type, setType] = useState<DatePickerType>('date')

  const decrement = () => {
    switch (type) {
      case 'date':
        setDatePickerHeaderDate((prev) => subMonths(prev, 1))
        break
      case 'month':
        setDatePickerHeaderDate((prev) => subYears(prev, 1))
        break
      case 'year':
        setDatePickerHeaderDate((prev) => subMonths(prev, 1))
        break
    }
  }

  const increment = () => {
    switch (type) {
      case 'date':
        setDatePickerHeaderDate((prev) => addMonths(prev, 1))
        break
      case 'month':
        setDatePickerHeaderDate((prev) => addYears(prev, 1))
        break
      case 'year':
        setDatePickerHeaderDate((prev) => subMonths(prev, 1))
        break
    }
  }

  const isSelectedDate = (date: number) =>
    isEqual(new Date(value.getFullYear(), value.getMonth(), date), value)

  const setDateValue = (date: number) => () => {
    onChange(
      new Date(
        datePickerHeaderDate.getFullYear(),
        datePickerHeaderDate.getMonth(),
        date
      )
    )

    setShowDatePicker(false)
  }

  const getDayCount = (date: Date) => {
    const daysInMonth = getDaysInMonth(date)

    const dayOfWeek = getDay(new Date(date.getFullYear(), date.getMonth(), 1))
    const blankDaysArray = []
    for (let i = 1; i <= dayOfWeek; i++) {
      blankDaysArray.push(i)
    }

    const daysArray = []
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push(i)
    }

    setBlankDays(blankDaysArray)
    setDayCount(daysArray)
  }

  const isSelectedMonth = (month: number) =>
    month === datePickerHeaderDate.getMonth()

  const setMonthValue = (month: number) => () => {
    setDatePickerHeaderDate(
      new Date(
        datePickerHeaderDate.getFullYear(),
        month,
        datePickerHeaderDate.getDate()
      )
    )
    setType('date')
  }

  const toggleDatePicker = () => setShowDatePicker((prev) => !prev)

  const showMonthPicker = () => setType('month')

  const showYearPicker = () => setType('date')

  useEffect(() => {
    getDayCount(datePickerHeaderDate)
  }, [datePickerHeaderDate])

  return (
    <div>
      <div className="container mx-auto">
        <div className="relative">
          <input type="hidden" name="date" />
          <input
            type="text"
            readOnly
            className="input text-slate-900 dark:text-white cursor-pointer pl-4 pr-10 py-3 shadow-sm focus:outline-none focus:shadow-outline font-medium"
            placeholder="Select date"
            value={value ? format(value, 'yyyy-MM-dd') : '----/--/--'}
            onClick={toggleDatePicker}
          />
          <div
            className="cursor-pointer absolute top-0 right-0 px-3 py-2"
            onClick={toggleDatePicker}
          >
            <Calendar className="text-slate-500 w-6 h-6" />
          </div>
          {showDatePicker && (
            <div className="z-10 w-72 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow p-4 absolute top-[105%] left-0">
              <div className="flex justify-between items-center w-full mb-4">
                <button
                  type="button"
                  className="transition ease-in-out duration-100 p-2 rounded inline-flex items-center justify-center aspect-square cursor-pointer dark:hover:bg-slate-700 hover:bg-slate-200"
                  onClick={decrement}
                >
                  <ArrowLeft className="text-slate-900 dark:text-slate-100 w-4 h-4" />
                </button>

                <div className="flex items-center justify-center text-sm">
                  {type === 'date' && (
                    <div
                      onClick={showMonthPicker}
                      className="py-1 px-3 font-bold text-slate-900 text-center dark:text-white dark:hover:text-white cursor-pointer dark:hover:bg-slate-700 hover:bg-slate-200 rounded"
                    >
                      {format(datePickerHeaderDate, 'MMMM')}
                    </div>
                  )}
                  <div
                    onClick={showYearPicker}
                    className="py-1 px-3 font-bold text-gray-900 dark:text-white dark:hover:text-white cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
                  >
                    <p className="text-center">
                      {format(datePickerHeaderDate, 'yyyy')}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="transition ease-in-out duration-100 h-full p-2 rounded inline-flex items-center justify-center aspect-square cursor-pointer dark:hover:bg-slate-700 hover:bg-slate-200"
                  onClick={increment}
                >
                  <ArrowRight className="text-slate-900 dark:text-slate-100 w-4 h-4" />
                </button>
              </div>
              {type === 'date' && (
                <>
                  <div className="flex flex-wrap">
                    {DAYS.map((day, i) => (
                      <div key={day} className="aspect-square w-[14.26%]">
                        <div className="text-slate-600 dark:text-slate-400 font-medium text-center text-sm">
                          {day}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap">
                    {blankDays.map((_, i) => (
                      <div
                        key={i}
                        className="aspect-square w-[14.26%] text-center border p-1 border-transparent text-sm"
                      />
                    ))}
                    {dayCount.map((d, i) => (
                      <div key={i} className="aspect-square w-[14.26%]">
                        <div
                          onClick={setDateValue(d)}
                          className={clsx(
                            'cursor-pointer flex items-center justify-center text-center h-full text-sm rounded leading-loose transition ease-in-out duration-100 text-slate-900 dark:text-slate-100 dark:hover:bg-slate-700 hover:bg-slate-200',
                            value &&
                              isSelectedDate(d) &&
                              'bg-primary-500 text-slate-100 dark:text-white font-bold'
                          )}
                        >
                          {d}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {type === 'month' && (
                <div className="flex flex-wrap">
                  {Array(12)
                    .fill(null)
                    .map((_, i) => (
                      <div
                        key={i}
                        className={clsx(
                          'cursor-pointer w-1/4 font-semibold py-4 px-2 dark:text-white text-center text-sm rounded-lg dark:hover:bg-slate-700 hover:bg-slate-200',
                          value && isSelectedMonth(i)
                            ? 'bg-primary-500 text-white'
                            : 'text-slate-700 hover:bg-primary-600'
                        )}
                        onClick={setMonthValue(i)}
                      >
                        {format(
                          new Date(
                            datePickerHeaderDate.getFullYear(),
                            i,
                            datePickerHeaderDate.getDate()
                          ),
                          'MMM'
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DatePicker
