import clsx from 'clsx'
import React from 'react'
import { ArrowDown, ArrowUp, ChevronsUp } from 'react-feather'
import { animated, config, useSpring } from '@react-spring/web'

interface InfoCardProps {
  title: string
  value: number
  delta?: number
  small?: boolean
  unit?: string
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title = '',
  value = 0,
  delta = 0,
  small = false,
}) => {
  const { _value, _delta } = useSpring({
    from: { _value: 0, _delta: 0 },
    to: {
      _value: value,
      _delta: delta,
    },
    delay: 0,
    config: config.slow,
  })

  const isDeltaPositive = delta > 0

  return (
    <div
      className={clsx(
        'bg-white dark:bg-slate-800',
        'rounded-xl',
        small ? 'p-0' : 'md:p-3'
      )}
    >
      <div className="flex flex-col">
        <div>
          <p
            className={clsx(
              small ? 'mb-1 text-xs md:text-base' : 'mb-3 text-sm md:text-lg',
              'dark:text-gray-400 text-gray-600 font-medium'
            )}
          >
            {title}
          </p>
          <div className="flex">
            <animated.p
              className={clsx(
                small ? 'text-2xl' : 'text-4xl',
                'dark:text-gray-200 text-gray-700'
              )}
            >
              {_value.to((x) => Math.round(x))}
            </animated.p>
            {delta !== 0 && (
              <div
                className={clsx(
                  'flex items-start ml-2',
                  isDeltaPositive
                    ? 'text-green-400 dark:text-green-500'
                    : 'text-red-500'
                )}
              >
                {isDeltaPositive ? (
                  <ArrowUp strokeWidth="1.5px" />
                ) : (
                  <ArrowDown strokeWidth="1.5px" />
                )}

                <animated.span
                  className={clsx(small ? 'text-sm' : 'text-base')}
                >
                  {_delta.to((y) => {
                    const x = Math.abs(Math.round(y))
                    return x
                  })}
                </animated.span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
