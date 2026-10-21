import {addDays, daysBetween, firstOfMonth, firstOfPreviousMonth} from '../../../utils/dates'
import {DateRangePreset} from './date-range-preset.enum'

export const MAXIMUM_RANGE_DAYS = 92
export const YESTERDAY_TREND_DAYS = 14

export interface SummaryRange {
  from: string
  before: string
  focusDate: string | null
}

export const isRangeTooLong = (range: Pick<SummaryRange, 'from' | 'before'>): boolean =>
  daysBetween(range.from, range.before) > MAXIMUM_RANGE_DAYS

export const resolvePresetRange = (preset: DateRangePreset, today: string): SummaryRange | null => {
  const yesterday = addDays(today, -1)
  switch (preset) {
    case DateRangePreset.YESTERDAY:
      return {from: addDays(today, -YESTERDAY_TREND_DAYS), before: today, focusDate: yesterday}
    case DateRangePreset.LAST_7_DAYS:
      return {from: addDays(today, -7), before: today, focusDate: null}
    case DateRangePreset.LAST_14_DAYS:
      return {from: addDays(today, -14), before: today, focusDate: null}
    case DateRangePreset.THIS_MONTH:
      return {from: firstOfMonth(today), before: addDays(today, 1), focusDate: null}
    case DateRangePreset.LAST_MONTH:
      return {from: firstOfPreviousMonth(today), before: firstOfMonth(today), focusDate: null}
    case DateRangePreset.CUSTOM:
      return null
  }
}
