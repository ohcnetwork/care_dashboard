import clsx from 'clsx'
import React from 'react'
import { getColor } from '../utils/map/colors'

interface Props {
  current: number
  total: number
  className?: string
}

export const Progress = ({ current, total, className }: Props) => {
  const percentage = `${Math.round((current / total) * 10) * 10}%`
  console.log(percentage)
  return (
    <div className="bg-slate-800 rounded-lg relative p-[2px]">
      <div
        className={clsx('h-4 bg-primary-500  rounded', percentage, className)}
        style={{
          width: percentage,
          background: getColor({ ratio: current / total }),
        }}
      />
    </div>
  )
}
