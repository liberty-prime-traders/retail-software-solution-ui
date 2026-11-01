import {ZonedDatesService} from '../../../../utils/services/zoned-dates.service'
import {ProductSalesRangeFormDefinition} from './product-sales-range-form.definition'

describe('ProductSalesRangeFormDefinition', () => {
  const zonedDatesService = {atOrgZone: (date?: Date | null) => date ? date.toISOString() : ''} as ZonedDatesService
  const day = (month: number, dayOfMonth: number, year = 2026) => new Date(year, month - 1, dayOfMonth)

  it('opens on the last 7 days ending today', () => {
    const model = ProductSalesRangeFormDefinition.createDefaultProductSalesRangeFormModel()
    const dayCount = Math.round((model.to!.getTime() - model.from!.getTime()) / (24 * 60 * 60 * 1000)) + 1

    expect(dayCount).toBe(ProductSalesRangeFormDefinition.DEFAULT_RANGE_DAYS)
  })

  it('treats "to" as inclusive by ending the range at the start of the following day', () => {
    const range = ProductSalesRangeFormDefinition.convertToRange(
      {from: day(10, 21), to: day(10, 27)}, zonedDatesService
    )

    expect(range).toEqual({from: day(10, 21).toISOString(), before: day(10, 28).toISOString()})
  })

  it('rejects a missing date, a reversed range and a range over one year', () => {
    expect(ProductSalesRangeFormDefinition.rangeErrors({from: null, to: day(10, 27)})).toEqual(['Select both dates'])
    expect(ProductSalesRangeFormDefinition.rangeErrors({from: day(10, 27), to: day(10, 21)}).length).toBe(1)
    expect(ProductSalesRangeFormDefinition.rangeErrors({from: day(1, 1), to: day(12, 31)})).toEqual([])
    expect(ProductSalesRangeFormDefinition.rangeErrors({from: day(1, 1, 2025), to: day(1, 2, 2026)}))
      .toEqual(['The range can span at most one year'])
  })

  it('gives no range to convert when the form is invalid', () => {
    expect(ProductSalesRangeFormDefinition.convertToRange({from: null, to: null}, zonedDatesService)).toBeNull()
  })
})
