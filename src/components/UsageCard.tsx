import React from 'react'

interface ValueCardProps {
  icon: JSX.Element
  label: string
  value: number | string
  unit: string
}

const ValueCard: React.FC<ValueCardProps> = ({
  icon: Icon,
  label,
  unit,
  value,
}) => (
  <div className="flex items-center">
    {Icon}
    <div className="dark:text-white">
      <div>
        <p className="text-slate-400">{label}</p>
        <h1 className="text-4xl my-2">{value || '---'}</h1>
        <h2 className="text-slate-300">{unit}</h2>
      </div>
    </div>
  </div>
)

interface UsageCardProps {
  data: ValueCardProps[]
}

export const UsageCard: React.FC<UsageCardProps> = ({ data }) => (
  <div className="my-2 p-2">
    <div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 ">
        {data.map((props, index) => (
          <ValueCard
            icon={props.icon}
            label={props.label}
            unit={props.unit}
            value={props.value}
            key={index}
          />
        ))}
      </div>
    </div>
  </div>
)
