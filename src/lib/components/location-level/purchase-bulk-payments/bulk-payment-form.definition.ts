import {min, required, schema} from '@angular/forms/signals'
import {
  PurchaseBulkPaymentCreateRequest,
  PurchaseBulkPaymentSearchRequest
} from '../../../api/location-level/purchase-bulk-payment/purchase-bulk-payment.model'
import {getToday} from '../../../utils/dates'
import {ZonedDatesService} from '../../../utils/services/zoned-dates.service'

export namespace BulkPaymentFormDefinition {
  export interface BulkPaymentFormModel {
    supplierId: string
    orderedFrom: Date | null
    /** Inclusive: the whole day is searched. */
    orderedTo: Date | null
    paymentMethodId: string
    paymentDate: Date | null
    amount: number | null
    notes: string
  }

  export const fieldMap = new Map<keyof BulkPaymentFormModel, string>([
    ['supplierId', 'Supplier'],
    ['paymentMethodId', 'Payment Method'],
    ['paymentDate', 'Payment Date'],
    ['amount', 'Amount'],
    ['notes', 'Notes']
  ])

  const DEFAULT_SEARCH_RANGE_MONTHS = 6

  const monthsBefore = (date: Date, months: number): Date => {
    const earlier = new Date(date)
    earlier.setMonth(earlier.getMonth() - months)
    return earlier
  }

  export const createDefaultBulkPaymentFormModel = (): BulkPaymentFormModel => ({
    supplierId: '',
    orderedFrom: monthsBefore(getToday(), DEFAULT_SEARCH_RANGE_MONTHS),
    orderedTo: getToday(),
    paymentMethodId: '',
    paymentDate: getToday(),
    amount: null,
    notes: ''
  })

  export const bulkPaymentFormSchema = schema<BulkPaymentFormModel>((path) => {
    required(path.supplierId)
    required(path.orderedFrom)
    required(path.orderedTo)
    required(path.paymentMethodId)
    required(path.paymentDate)
    required(path.amount)
    min(path.amount, 0.01)
  })

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

  /** Mirrors the server: the exclusive end may be at most one calendar year after the start. */
  export const hasSearchableRange = (formValue: BulkPaymentFormModel): boolean => {
    if (!formValue.orderedFrom || !formValue.orderedTo) return false
    const exclusiveEnd = dayAfter(formValue.orderedTo)
    return exclusiveEnd > formValue.orderedFrom && exclusiveEnd <= oneYearAfter(formValue.orderedFrom)
  }

  export const convertToSearchRequest = (
    formValue: BulkPaymentFormModel, zonedDatesService: ZonedDatesService
  ): PurchaseBulkPaymentSearchRequest => ({
    supplierId: formValue.supplierId,
    orderedFrom: zonedDatesService.pickedDateAtOrgZone(formValue.orderedFrom),
    orderedBefore: zonedDatesService.pickedDateAtOrgZone(dayAfter(formValue.orderedTo!))
  })

  export const convertToCreateRequest = (
    formValue: BulkPaymentFormModel, purchaseIds: string[], zonedDatesService: ZonedDatesService
  ): PurchaseBulkPaymentCreateRequest => ({
    supplierId: formValue.supplierId,
    purchaseIds,
    amount: formValue.amount!,
    paymentMethodId: formValue.paymentMethodId,
    paymentDate: zonedDatesService.pickedDateAtOrgZone(formValue.paymentDate),
    notes: formValue.notes || undefined
  })
}
