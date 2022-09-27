import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import {
  ACTIVATED_DISTRICTS,
  AVAILABILITY_TYPES,
  AVAILABILITY_TYPES_ORDERED,
  GMAP_KEY,
} from '../utils/constants'
import { processFacilityData } from '../utils/facility/capacity'
import GoogleMapReact from 'google-map-react'
import { mapTheme } from '../utils/map/theme'
import {
  canShowBed,
  colorClasses,
  bedClasses,
  getColor,
} from '../utils/map/colors'
import clsx from 'clsx'
import { Triangle } from 'react-feather'
import { filter } from 'lodash-es'
import { Progress } from './Progress'
import { useTheme } from '../utils/hooks/useTheme'

interface Props {
  district?: typeof ACTIVATED_DISTRICTS[number]
  className?: string
  facilities: ReturnType<typeof processFacilityData>
  isLoading?: boolean
}

interface PopUpProps {
  data: ReturnType<typeof processFacilityData>[number]
  open: boolean
}

const PopUp: React.FC<PopUpProps> = ({ data, open }) => {
  return (
    <div
      className={clsx(
        'absolute z-10 bottom-10 left-50 -translate-x-1/2 bg-white dark:bg-slate-900 shadow-2xl dark:text-white p-3 rounded-xl transition-all w-80',
        open
          ? 'opacity-100  translate-y-0'
          : 'translate-y-4 opacity-0 pointer-events-none'
      )}
    >
      <Triangle className="absolute rotate-180 -bottom-4 left-1/2 -translate-x-1/2 fill-current text-white dark:text-slate-900" />
      <div>
        <h1 className="mb-1 font-black text-lg">{data.name}</h1>
        <div className="text-base">
          <div className="">
            <div>
              <p className="font-medium text-sm text-slate-500">
                Oxygen capacity :
                <span className="text-base font-bold dark:text-white ">
                  {data.oxygen_capacity}
                </span>
              </p>
            </div>
            <div>
              <p className="font-medium text-sm text-slate-500">
                Live Patients
                <span className="text-base font-bold dark:text-white ml-2">
                  {data.actual_live_patients}
                </span>
              </p>
            </div>
            <div>
              <p className="font-medium text-sm text-slate-500">
                Discharged Patients
                <span className="text-base font-bold dark:text-white ml-2">
                  {data.actual_discharged_patients}
                </span>
              </p>
            </div>
          </div>
          <div className="mt-4">
            {AVAILABILITY_TYPES_ORDERED.map((a) => {
              const current = data?.capacity?.[a]?.current_capacity || 1
              const total = data?.capacity?.[a]?.total_capacity || 1

              const used = ((+current / +total) * 100).toFixed(2)

              if (total == 1) {
                return null
              }

              return (
                <div key={a} className="mb-2">
                  <p className="text-sm text-slate-500 font-semibold">
                    {
                      AVAILABILITY_TYPES[
                        a as unknown as keyof typeof AVAILABILITY_TYPES
                      ]
                    }
                  </p>
                  {data.capacity?.[a]?.total_capacity ? (
                    <>
                      <div className="flex gap-2 justify-between items-center">
                        <p>
                          <span className="font-bold">{current}</span> /{' '}
                          <span className="text-sm">{total}</span>
                        </p>
                        <p
                          className="font-bold"
                          style={{
                            color: getColor({
                              ratio: +current / +total,
                            }),
                          }}
                        >
                          {used}%
                        </p>
                      </div>
                      <Progress
                        current={+current}
                        total={+total}
                        className="h-1"
                      />
                    </>
                  ) : (
                    <p key={a} className="text-white">
                      Not available
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

interface Center {
  lat: number
  lng: number
}

interface MarkerProps {
  data: ReturnType<typeof processFacilityData>[number]
  setFocus: (center: Center, zoom: number) => void
  lat: number
  lng: number
  selectedBedType: string
  zoom: number
}
export const Marker: React.FC<MarkerProps> = (props) => {
  const [isPopUpOpen, setIsPopUpOpen] = React.useState(false)
  const { data, lat, lng, selectedBedType, setFocus, zoom } = props
  const handleClick = () => {
    const center = { lat, lng }
    const zoom = 13
    setFocus(center, zoom)
  }

  const isMarkerVisible = canShowBed({
    capacity: data.capacity?.[selectedBedType],
    filter: selectedBedType,
  })

  return (
    <div
      className="relative"
      onMouseLeave={() => setIsPopUpOpen(false)}
      onClick={handleClick}
    >
      <div onMouseEnter={() => setIsPopUpOpen(true)}>
        {isMarkerVisible ? (
          <div
            className={clsx(
              colorClasses(data.capacity?.[selectedBedType]),
              'z-0'
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="bed"
              role="img"
              className={clsx(
                colorClasses(data.capacity?.[selectedBedType]),
                bedClasses(zoom),
                'absolute bottom-1/2 left-1/2 -translate-x-1/2'
              )}
              viewBox="0 0 640 512"
            >
              <path
                fill="inherit"
                d="M176 256c44.11 0 80-35.89 80-80s-35.89-80-80-80-80 35.89-80 80 35.89 80 80 80zm352-128H304c-8.84 0-16 7.16-16 16v144H64V80c0-8.84-7.16-16-16-16H16C7.16 64 0 71.16 0 80v352c0 8.84 7.16 16 16 16h32c8.84 0 16-7.16 16-16v-48h512v48c0 8.84 7.16 16 16 16h32c8.84 0 16-7.16 16-16V240c0-61.86-50.14-112-112-112z"
              />
            </svg>
          </div>
        ) : null}
      </div>

      <PopUp data={data} open={isPopUpOpen} />
    </div>
  )
}

export const FacilityBedMap = (props: Props) => {
  const { facilities, className, district, isLoading } = props
  const [selectedBedType, setSelectedBedType] = useState('All')
  const [theme, _] = useTheme()
  const [state, setState] = useState({
    assets: [],
    showAddressSuggestion: false,
    center: {
      lat: district?.lat || 10.148_547_6,
      lng: district?.lng || 76.500_752_4,
    },
    zoom: district?.zoom || 5,
  })

  useEffect(() => {
    district &&
      setState({
        ...state,
        center: {
          lat: district.lat,
          lng: district.lng,
        },
        zoom: district.zoom,
      })
  }, [district])

  return (
    <div
      className={clsx(
        'rounded-xl overflow-hidden relative',
        'h-[90vh] w-full',
        className
      )}
    >
      {!isLoading ? (
        <>
          <GoogleMapReact
            bootstrapURLKeys={{
              key: GMAP_KEY,
            }}
            defaultCenter={{
              lat: 10.148_547_6,
              lng: 76.500_752_4,
            }}
            defaultZoom={8}
            center={state.center}
            zoom={state.zoom}
            options={{
              styles: mapTheme(theme),
            }}
          >
            {facilities
              .filter((f) => f.latitude && f.longitude)
              .map((f) => (
                <Marker
                  key={f.id}
                  data={f}
                  lat={f.latitude as number}
                  lng={f.longitude as number}
                  zoom={state.zoom}
                  selectedBedType={selectedBedType}
                  setFocus={(center, zoom) =>
                    setState((prev) => ({ ...prev, center, zoom }))
                  }
                />
              ))}
          </GoogleMapReact>
          <select
            name="bed-type"
            className="select absolute top-2 left-3 z-10 p-2 rounded-lg text-black"
            onChange={(e) => setSelectedBedType(e.target.value)}
          >
            <option value={'All'} className="text-black">
              All
            </option>
            {filter(
              AVAILABILITY_TYPES_ORDERED,
              (key) => ![40, 50, 60, 70].includes(key)
            ).map((a) => (
              <option className="text-black " key={a} value={String(a)}>
                {
                  AVAILABILITY_TYPES[
                    a as unknown as keyof typeof AVAILABILITY_TYPES
                  ]
                }
              </option>
            ))}
          </select>
        </>
      ) : (
        <div className="animate-pulse w-full bg-slate-200 dark:bg-slate-800 h-full" />
      )}
    </div>
  )
}
