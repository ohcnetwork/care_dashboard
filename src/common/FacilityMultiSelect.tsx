import { Fragment, useEffect, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { Check, ChevronDown, X } from 'react-feather'
import { facility_types } from '../utils/constants'
import { UrlQuery } from '../types/urlQuery'
import { useQueryParams } from 'raviger'
import _ from 'lodash'

type Facility = {
  id: number
  facility_type: string
}

interface Props {
  selectedFacilities: Facility[]
  setSelectedFacilities: React.Dispatch<React.SetStateAction<any>>
}

export default function FacilityMultiSelect({
  selectedFacilities,
  setSelectedFacilities,
}: Props) {
  const [query, setQuery] = useState('')
  const [urlQuery, setURLQuery] = useQueryParams<UrlQuery>()

  const filteredFacilities =
    query === ''
      ? facility_types
      : facility_types.filter((facility) =>
          facility.facility_type
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        )

  useEffect(() => {
    if (selectedFacilities.length)
      setURLQuery({
        ...urlQuery,
        facility_type: selectedFacilities.map((i) => i.id).join(','),
      })
    else setURLQuery(_.omit(urlQuery, 'facility_type'))
  }, [selectedFacilities])

  return (
    <div className="">
      <Combobox
        value={selectedFacilities}
        onChange={setSelectedFacilities}
        multiple
      >
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg dark:bg-slate-800 text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              className="input py-3 pl-3 pr-10 focus:ring-0"
              placeholder={'Search facility type'}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2 text-white">
              <ChevronDown />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className="z-10 absolute mt-1 max-h-60 w-full dark:bg-slate-800 overflow-auto rounded-md py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredFacilities.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none py-2 px-4 dark:text-white">
                  Nothing found.
                </div>
              ) : (
                filteredFacilities.map((facility) => (
                  <Combobox.Option
                    key={facility.id}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-2 pl-10 pr-4 text-white ${
                        active ? 'bg-green-500' : 'dark:bg-slate-800'
                      }`
                    }
                    value={facility}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {facility.facility_type}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? 'text-white' : 'text-green-500'
                            }`}
                          >
                            <Check />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
          <div className="mt-4 overflow-y-auto max-h-48">
            <ul className="flex flex-wrap">
              {selectedFacilities.map((i: Facility) => {
                return (
                  <li
                    key={i.facility_type}
                    className="my-1 mr-1 shadow-xs rounded-full bg-white dark:bg-slate-800 border border-slate-700 dark:text-gray-200 opacity-100 flex px-2 items-center"
                  >
                    <span>{i.facility_type}</span>
                    <button
                      className="ml-2 hover:bg-slate-900 rounded-full p-1 flex justify-center items-center"
                      onClick={() => {
                        setSelectedFacilities((p: Facility[]) =>
                          p.filter((item: Facility) => item.id != i.id)
                        )
                      }}
                    >
                      <X size={15} />
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </Combobox>
    </div>
  )
}
