import { Database, Activity, Clock, AlertTriangle } from 'react-feather'
import { Inventory } from '../../api/queries/useFacilitySummary'

export const inventoryToUsageData = (data: Inventory) => [
  {
    icon: <Database className="text-blue-500 mr-4" size="40px" />,
    label: data.item_name,
    value: data.stock,
    unit: data.unit,
  },
  {
    icon: <Activity className="text-yellow-400 mr-4" size="40px" />,
    label: 'Burn Rate',
    value: data.burn_rate?.toFixed(2),
    unit: `${data.unit} / Hr`,
  },
  {
    icon: <Clock className="text-green-500 mr-4" size="40px" />,
    label: 'Time to Empty',
    value: data.burn_rate ? (data.stock / data.burn_rate)?.toFixed(2) : '---',
    unit: 'Hours',
  },
]
