import dayjs from 'dayjs'

export const toDateString = (date: Date) => {
  return dayjs(date).format('YYYY-MM-DD')
}

export const stringToDate = (date?: string) => {
  if (!date) return new Date()
  const [year, month, day] = date.split('-')
  return new Date(Number(year), Number(month) - 1, Number(day))
}

export const getNDateBefore = (d: string | number | Date, n: number) => {
  const dt = new Date(d)
  dt.setDate(dt.getDate() - n)
  return dt
}

export const getNDateAfter = (d: string | number | Date, n: number) => {
  const dt = new Date(d)
  dt.setDate(dt.getDate() + n)
  return dt
}

export const getDateFromQuery = (queryDate: string | undefined) =>
  queryDate && dayjs(queryDate || null, 'YYYY-MM-DD').isValid()
    ? new Date(queryDate)
    : new Date()
