import clsx from 'clsx'
import { ReactNode, useState } from 'react'

interface Props {
  children: ReactNode
  className?: string
  text: ReactNode
  position?: 'TOP' | 'BOTTOM' | 'LEFT' | 'RIGHT'
}

const ToolTip: React.FC<Props> = (props) => {
  const { position, className } = props

  const [status, show] = useState(false)

  const style = clsx(
    'absolute bg-slate-200 dark:bg-slate-900 backdrop-blur rounded text-slate-700 dark:text-slate-200 transition px-2 py-1 z-50 w-fit text-center block',
    position === 'TOP' && 'bottom-[calc(100%+5px)] left-[calc(50%-75px)]',
    position === 'BOTTOM' && 'top-[calc(100%+5px)] left-[calc(50%-75px)]',
    position === 'LEFT' && 'right-[calc(100%+5px)] top-[calc(50%-75px)]',
    position === 'RIGHT' && 'left-[calc(100%+5px)] top-[calc(50%-75px)]',
    status === true
      ? 'visible opacity-100 -translate-y-1'
      : 'invisible opacity-0 translate-y-0'
  )

  return (
    <div
      className={clsx('relative', className)}
      onMouseEnter={() => show(true)}
      onMouseLeave={() => show(false)}
    >
      <div className={style}>{props.text}</div>
      {props.children}
    </div>
  )
}

ToolTip.defaultProps = {
  position: 'TOP',
  className: '',
}

export default ToolTip
