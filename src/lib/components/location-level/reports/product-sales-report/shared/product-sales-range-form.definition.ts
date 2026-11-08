import {schema} from '@angular/forms/signals'
import {getToday, toLocaleDateString} from '../../../../../utils/dates'
import {ZonedDatesService} from '../../../../../utils/services/zoned-dates.service'

export namespace ProductSalesRangeFormDefinition {
  export interface ProductSalesRangeFormModel {
    from: Date | null
    /** Inclusive: the whole day is part of the range. */
    to: Date | null
  }

  export interface ProductSalesRange {
    from: string
    before: string
  }

  /** Both inclusive, as yyyy-MM-dd calendar days. */
  export interface ProductSalesDates {
    from: string
    to: string
  }

  export const DEFAULT_RANGE_DAYS = 7

  export const createDefaultProductSalesRangeFormModel = (
    rangeDays: number = DEFAULT_RANGE_DAYS
  ): ProductSalesRangeFormModel => {
    const today = getToday()
    const firstDay = getToday()
    firstDay.setDate(today.getDate() - (rangeDays - 1))
    return {from: firstDay, to: today}
  }

  export const productSalesRangeFormSchema = schema<ProductSalesRangeFormModel>(() => {})

  const dayAfter = (date: Date): Date => {
    const nextDay = new Date(date)
    nextDay.setDate(nextDay.getDate() + 1)
    return nextDay
  }

  const oneYearAfter = (date: Date): Date => {
    const sameDayNextYear = new Date(date)
    sameDayNextYear.setFullYear(sameDayNextYear.getFullYear() + 1)
    return sameDayNextYear
  }

  export const rangeErrors = (formValue: ProductSalesRangeFormModel): string[] => {
    if (!formValue.from || !formValue.to) {
      return ['Select both dates']
    }
    if (formValue.from > formValue.to) {
      return ['"From" must not be after "to"']
    }
    if (dayAfter(formValue.to) > oneYearAfter(formValue.from)) {
      return ['The range can span at most one year']
    }
    return []
  }

  export const convertToDates = (formValue: ProductSalesRangeFormModel): ProductSalesDates | null =>
    rangeErrors(formValue).length > 0
      ? null
      : {from: toLocaleDateString(formValue.from), to: toLocaleDateString(formValue.to)}

  export const convertToRange = (
    formValue: ProductSalesRangeFormModel, zonedDatesService: ZonedDatesService
  ): ProductSalesRange | null => {
    if (rangeErrors(formValue).length > 0) {
      return null
    }
    return {
      from: zonedDatesService.pickedDateAtOrgZone(formValue.from),
      before: zonedDatesService.pickedDateAtOrgZone(dayAfter(formValue.to!))
    }
  }
}
