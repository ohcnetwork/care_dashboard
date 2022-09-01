import React from 'react'
import clsx from 'clsx'
import { ArrowDown, ArrowUp } from 'react-feather'
import { animated, config, useSpring } from '@react-spring/web'

type UsedTotal = {
  used: number
  total: number
}

interface RadialCardProps {
  label: string
  current: UsedTotal
  previous: UsedTotal
  className?: string
  reverseIndicator?: boolean
  isLoading?: boolean
}

const CIRCLE_PATH = `M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831`

export const RadialCard: React.FC<RadialCardProps> = ({
  label,
  current,
  previous,
  className,
  reverseIndicator,
  isLoading,
}) => {
  const current_used = current.total
    ? Math.round((current.used / current.total) * 100)
    : 0
  const previous_used = previous.total
    ? Math.round((previous.used / previous.total) * 100)
    : 0
  const diff = current_used - previous_used

  const _p = current.total
    ? Math.round((current.used / current.total) * 100)
    : 0

  const isPositive = (value: number) =>
    !Number.isNaN(value) && value !== 0 && value > 0

  const { used, total, progress, innerProgress } = useSpring({
    from: { used: 0, total: 0, progress: '0, 100', innerProgress: 0 },
    to: {
      used: current.used,
      total: current.total,
      progress: `${Number.isNaN(_p) ? 0 : _p}, 100`,
      innerProgress: Number.isNaN(_p) ? 0 : _p,
    },
    delay: 0,
    config: config.slow,
  })

  return (
    <div
      className={clsx(
        isLoading
          ? 'bg-slate-800 animate-pulse'
          : 'bg-white dark:bg-slate-800 border border-slate-700 dark:text-gray-200 opacity-100',
        'shadow-sm dark:shadow-none rounded-xl flex flex-col justify-between',
        className
      )}
      style={{ padding: 'clamp(0.75rem,5vw,1.5rem)' }}
    >
      <div className={isLoading ? 'opacity-0' : 'opacity-100'}>
        <p className="dark:text-slate-100 text-slate-900 font-medium text-xl mb-2 md:mb-4 text-center">
          {label}
        </p>

        <div className="flex items-center justify-center">
          <div className="relative flex content-center justify-center m-2 w-4/5">
            <svg viewBox="0 0 36 36" className="w-full">
              <path
                className="text-slate-200 dark:text-slate-900 stroke-current stroke-[4px]"
                fill="none"
                d={CIRCLE_PATH}
              />
              <animated.path
                className="text-primary-500 stroke-current stroke-[3px]"
                fill="none"
                strokeDasharray={progress}
                d={CIRCLE_PATH}
              />
            </svg>
            <div className="absolute inline-flex flex-col items-center justify-center self-center w-3/5 text-center text-sm xl:text-lg">
              <div className="space-x-1">
                <animated.span className="text-center text-4xl dark:text-slate-200 text-slate-700 font-semibold">
                  {innerProgress.to((x: number) => `${Math.round(x) || 0}%`)}
                </animated.span>
              </div>
              {
                <div className="mt-2 text-center">
                  <span
                    className={clsx('text-xl font-medium', {
                      'text-green-600 dark:text-green-400': reverseIndicator
                        ? !isPositive(diff)
                        : isPositive(diff),
                      'text-red-600 dark:text-red-500': reverseIndicator
                        ? isPositive(diff)
                        : !isPositive(diff),
                    })}
                  >
                    {diff ? (
                      isPositive(diff) ? (
                        <ArrowUp className="inline h-full" />
                      ) : (
                        <ArrowDown className="inline h-full" />
                      )
                    ) : null}
                    {Math.abs(diff)}%
                  </span>
                </div>
              }
            </div>
          </div>
        </div>
        <div className="flex text-center mt-4">
          <div className="w-1/2">
            <p className="dark:text-slate-400 text-slate-500 font-medium text-lg xl:text-xl">
              Used
              <animated.span className="ml-2 dark:text-slate-200 text-slate-700 font-semibold text-lg  xl:text-xl">
                {used.to((x: number) => Math.round(x))}
              </animated.span>
            </p>
          </div>
          <div className="w-1/2">
            <p className="dark:text-slate-400 text-slate-500 font-medium text-lg xl:text-xl">
              Total
              <animated.span className="ml-2 dark:text-slate-200 text-slate-700 text-lg font-semibold xl:text-xl">
                {total.to((x: number) => Math.round(x))}
              </animated.span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RadialCard
