import clsx from 'clsx'
import React from 'react'
import { ArrowDown, ArrowUp } from 'react-feather'
import { animated, config, useSpring } from '@react-spring/web'

interface InfoCardProps {
  title: string
  value: number
  delta?: number
  small?: boolean
  unit?: string | JSX.Element
  className?: string
}

const InfoCard: React.FC<InfoCardProps> = ({
  title = '',
  value = 0,
  delta = 0,
  small = false,
  unit = '',
  className = 'bg-white dark:bg-slate-800',
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

  if (!value || isNaN(value)) return null

  return (
    <div
      className={clsx(
        'rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm',
        small ? 'p-1' : 'p-3',
        className
      )}
    >
      <div className="flex flex-col">
        <div>
          <p
            className={clsx(
              small ? 'mb-1 text-xs md:text-base' : 'mb-3 text-sm md:text-lg',
              'dark:text-slate-400 text-slate-600 font-medium'
            )}
          >
            {title}
          </p>
          <div className="flex items-center">
            <animated.p
              className={clsx(
                small ? 'text-2xl' : 'text-4xl',
                'dark:text-slate-200 text-slate-700'
              )}
            >
              {_value.to((x) => Math.round(x))}
            </animated.p>
            {unit && <span className="ml-2">{unit}</span>}
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

export default InfoCard
