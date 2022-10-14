import { Fragment, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { Check, ChevronDown, X } from 'react-feather'
import clsx from 'clsx'

export interface Option {
  label: string
  value: string | number
}

interface Props {
  options: Option[]
  selectedOptions: string[]
  setSelectedOptions: (opt: string[]) => void
}

const MultiSelect: React.FC<Props> = ({
  options,
  selectedOptions,
  setSelectedOptions,
}) => {
  const [query, setQuery] = useState('')

  const optionMap = options.reduce(
    (acc, option) => ({ ...acc, [option.value]: option.label }),
    {} as Record<string, string>
  )
  const filteredOptions =
    query === ''
      ? options
      : options.filter((option) =>
          option.label
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        )

  return (
    <div className="">
      <Combobox
        value={selectedOptions}
        onChange={(opt) => setSelectedOptions(opt)}
        multiple
      >
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg text-left sm:text-sm">
            <div className="flex flex-wrap gap-2 items-center">
              {selectedOptions.length ? (
                <div>
                  <ul className="flex flex-wrap gap-2">
                    {selectedOptions.map((opt, i) => {
                      return (
                        <li
                          key={i}
                          className="text-white rounded-full w-max px-2 bg-primary-500 flex py-1 gap-2"
                        >
                          <span>{optionMap[opt]}</span>
                          <button
                            onClick={() =>
                              setSelectedOptions(
                                selectedOptions.filter((item) => item !== opt)
                              )
                            }
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ) : null}
              <div className="relative w-full flex items-center">
                <Combobox.Input
                  className="min-w-[96px] input py-2 px-2"
                  placeholder={'Search facility type'}
                  onChange={(event) => setQuery(event.target.value)}
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2 text-slate-900 dark:text-white">
                  <ChevronDown />
                </Combobox.Button>
              </div>
            </div>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className="z-10 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-slate-800 border dark:border-slate-700 border-slate-300 py-1 text-base sm:text-sm shadow-xl">
              {filteredOptions.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none py-2 px-4 text-slate-700">
                  Nothing found.
                </div>
              ) : (
                filteredOptions.map((option, i) => (
                  <Combobox.Option
                    key={i}
                    className={({ active }) =>
                      clsx(
                        'relative cursor-default select-none py-2 pl-10 pr-4',
                        active
                          ? 'bg-primary-500 text-white'
                          : 'text-slate-900 dark:text-white'
                      )
                    }
                    value={option.value}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {option.label}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? 'text-white' : 'text-primary-500'
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
        </div>
      </Combobox>
    </div>
  )
}

export default MultiSelect
