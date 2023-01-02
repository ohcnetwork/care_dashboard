import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { Check, ChevronDown } from 'react-feather'

type Option = Record<string, any>

interface IDropDownProps {
  options?: Option[]
  selected?: Option | null
  onSelect?: (option: Option) => void
  className?: string
  placeholder?: string
}

export default function DropDown({
  options = [],
  selected = null,
  onSelect,
  className = '',
  placeholder = '',
}: IDropDownProps) {
  return (
    <div className={'w-72 ' + className}>
      <Listbox value={selected} onChange={onSelect}>
        <div className="relative">
          <Listbox.Button className="relative w-full h-8 p-2 cursor-default rounded-lg bg-white dark:bg-slate-700 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none sm:text-sm">
            <span className="block truncate text-gray-700 dark:text-white text-center z-10">
              {!selected ? placeholder : selected?.label || selected?.name}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDown
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-slate-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {options.map((option, idx) => (
                <Listbox.Option
                  key={idx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 dark:text-white ${
                      active ? 'bg-primary-500 text-white' : 'text-gray-900'
                    }`
                  }
                  value={option}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {option?.label || option?.name}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600">
                          <Check className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}
