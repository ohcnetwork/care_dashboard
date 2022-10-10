import RCTable from 'rc-table'
import { ColumnsType, DefaultRecordType } from 'rc-table/lib/interface'

interface GenericTableProps {
  data: DefaultRecordType[]
  columns: ColumnsType<DefaultRecordType>
  scroll?: {
    x?: string | number | true
    y?: string | number
  }
}

export const Table: React.FC<GenericTableProps> = (props) => {
  // eslint-disable-next-line react/prop-types
  const { data, columns, scroll } = props
  return <RCTable data={data} columns={columns} scroll={scroll} sticky={true} />
}
