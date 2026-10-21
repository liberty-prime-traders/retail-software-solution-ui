
export const getTodayStr = () => toLocaleDateString(getToday())

export const getToday = (): Date => {
  const dateObj = new Date()
  dateObj.setHours(0, 0, 0, 0)
  return dateObj
}

export const getTomorrow = (): Date => {
  const dateObj = getToday()
  dateObj.setDate(dateObj.getDate() + 1)
  return dateObj
}

export const toLocaleDateString = (date: string | Date | null): string => {
  if (!date) {
    return ''
  }
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const minDateFrom = (startDate: Date | string | null | undefined): Date => {
  const today = getToday()
  const start = toLocaleDate(startDate)
  if (!start) return today
  return start > today ? start : today
}

export const toLocaleDate = (date: Date | string | null | undefined): Date | null => {
  if (!date) {
    return null
  }
  if (date instanceof Date) {
    return date
  }
  const regex = /^(\d{4})-(\d{2})-(\d{2})$/
  const match = date.match(regex)
  if (!match) {
    throw new Error(`Invalid date format: ${date}. Expected format is YYYY-MM-DD.`)
  }
  const [_, year, month, day] = match
  return new Date(Number(year), Number(month) - 1, Number(day))
}

const MILLISECONDS_PER_DAY = 86_400_000

const dayLabelFormatter = new Intl.DateTimeFormat('en-US', {weekday: 'short', day: 'numeric', month: 'short'})
const fullDayFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
})

export const addDays = (date: string, days: number): string => {
  const shifted = toLocaleDate(date)!
  shifted.setDate(shifted.getDate() + days)
  return toLocaleDateString(shifted)
}

// Rounded because local midnights a daylight-saving change apart are 23 or 25 hours apart.
export const daysBetween = (from: string, before: string): number =>
  Math.round((toLocaleDate(before)!.getTime() - toLocaleDate(from)!.getTime()) / MILLISECONDS_PER_DAY)

/** Every date in `[from, before)`, ascending. */
export const datesInRange = (from: string, before: string): string[] =>
  Array.from({length: Math.max(daysBetween(from, before), 0)}, (_, offset) => addDays(from, offset))

export const firstOfMonth = (date: string): string => `${date.slice(0, 8)}01`

export const firstOfPreviousMonth = (date: string): string => firstOfMonth(addDays(firstOfMonth(date), -1))

/** Weekday, day and month, e.g. `Tue, Mar 10`. */
export const formatDayLabel = (date: string): string => dayLabelFormatter.format(toLocaleDate(date)!)

export const formatFullDay = (date: string): string => fullDayFormatter.format(toLocaleDate(date)!)

export const formatDayRange = (firstDay: string, lastDay: string): string =>
  firstDay === lastDay ? formatDayLabel(firstDay) : `${formatDayLabel(firstDay)} ... ${formatDayLabel(lastDay)}`

