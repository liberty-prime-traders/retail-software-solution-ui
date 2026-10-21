import {addDays, datesInRange, daysBetween, firstOfMonth, firstOfPreviousMonth, formatDayRange} from './dates'

describe('date helpers', () => {
  it('adds days across month and year boundaries', () => {
    expect(addDays('2026-02-28', 1)).toBe('2026-03-01')
    expect(addDays('2026-01-01', -1)).toBe('2025-12-31')
  })

  it('counts days and lists one date per day of a half-open range', () => {
    expect(daysBetween('2026-03-01', '2026-03-11')).toBe(10)
    expect(datesInRange('2026-02-27', '2026-03-02')).toEqual(['2026-02-27', '2026-02-28', '2026-03-01'])
    expect(datesInRange('2026-03-02', '2026-03-02')).toEqual([])
  })

  it('finds month starts', () => {
    expect(firstOfMonth('2026-03-10')).toBe('2026-03-01')
    expect(firstOfPreviousMonth('2026-01-15')).toBe('2025-12-01')
  })

  it('labels a single day and a range', () => {
    expect(formatDayRange('2026-03-10', '2026-03-10')).toBe('Tue, Mar 10')
    expect(formatDayRange('2026-03-09', '2026-03-10')).toBe('Mon, Mar 9 to Tue, Mar 10')
  })
})
