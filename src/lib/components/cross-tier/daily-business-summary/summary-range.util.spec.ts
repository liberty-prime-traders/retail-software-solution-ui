import {DateRangePreset} from './date-range-preset.enum'
import {isRangeTooLong, MAXIMUM_RANGE_DAYS, resolvePresetRange} from './summary-range.util'

describe('summary range', () => {
  const today = '2026-03-10'

  it('yesterday loads the 14 days ending yesterday and opens that day', () => {
    expect(resolvePresetRange(DateRangePreset.YESTERDAY, today))
      .toEqual({from: '2026-02-24', before: '2026-03-10', focusDate: '2026-03-09'})
  })

  it('last 7 and 14 days end yesterday', () => {
    expect(resolvePresetRange(DateRangePreset.LAST_7_DAYS, today)).toEqual({from: '2026-03-03', before: today, focusDate: null})
    expect(resolvePresetRange(DateRangePreset.LAST_14_DAYS, today)).toEqual({from: '2026-02-24', before: today, focusDate: null})
  })

  it('this month runs through today and last month covers the whole previous month', () => {
    expect(resolvePresetRange(DateRangePreset.THIS_MONTH, today)).toEqual({from: '2026-03-01', before: '2026-03-11', focusDate: null})
    expect(resolvePresetRange(DateRangePreset.LAST_MONTH, today)).toEqual({from: '2026-02-01', before: '2026-03-01', focusDate: null})
    expect(resolvePresetRange(DateRangePreset.LAST_MONTH, '2026-01-15'))
      .toEqual({from: '2025-12-01', before: '2026-01-01', focusDate: null})
  })

  it('a custom range has no preset resolution', () => {
    expect(resolvePresetRange(DateRangePreset.CUSTOM, today)).toBeNull()
  })

  it('rejects a range longer than the maximum', () => {
    expect(isRangeTooLong({from: '2026-01-01', before: '2026-04-04'})).toBeTrue()
    expect(isRangeTooLong({from: '2026-01-01', before: '2026-04-03'})).toBeFalse()
    expect(MAXIMUM_RANGE_DAYS).toBe(92)
  })
})
