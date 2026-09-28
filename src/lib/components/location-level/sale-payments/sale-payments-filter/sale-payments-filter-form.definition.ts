import {schema} from '@angular/forms/signals'
import {SalePaymentStatus} from '../../../../api/location-level/sale-payment/sale-payment-status.enum'
import {SalePaymentSummaryParams} from '../../../../api/location-level/sale-payment/sale-payment-summary-params.model'
import {getToday} from '../../../../utils/dates'
import {ZonedDatesService} from '../../../../utils/services/zoned-dates.service'

export namespace SalePaymentsFilterFormDefinition {
  export interface SalePaymentsFilterFormModel {
    recordedFrom: Date | null
    recordedBefore: Date | null
    paymentDateFrom: Date | null
    paymentDateBefore: Date | null
    contactIds: string[]
    paymentMethodIds: string[]
    statuses: SalePaymentStatus[]
    minAmount: number | null
    maxAmount: number | null
    saleReferenceNumbers: string[]
  }

  export const MAX_SALE_REFERENCE_NUMBERS = 20

  export const createDefaultSalePaymentsFilterFormModel = (): SalePaymentsFilterFormModel => {
    const tomorrow = getToday()
    tomorrow.setDate(tomorrow.getDate() + 1)

    return {
      recordedFrom: getToday(),
      recordedBefore: tomorrow,
      paymentDateFrom: null,
      paymentDateBefore: null,
      contactIds: [],
      paymentMethodIds: [],
      statuses: [SalePaymentStatus.ACTIVE],
      minAmount: null,
      maxAmount: null,
      saleReferenceNumbers: []
    }
  }

  export const salePaymentsFilterFormSchema = schema<SalePaymentsFilterFormModel>(() => {})

  export const convertToFilterParams = (
    formValue: SalePaymentsFilterFormModel, zonedDatesService: ZonedDatesService
  ): SalePaymentSummaryParams => ({
    recordedFrom: zonedDatesService.atOrgZone(formValue.recordedFrom) || undefined,
    recordedBefore: zonedDatesService.atOrgZone(formValue.recordedBefore) || undefined,
    paymentDateFrom: zonedDatesService.atOrgZone(formValue.paymentDateFrom) || undefined,
    paymentDateBefore: zonedDatesService.atOrgZone(formValue.paymentDateBefore) || undefined,
    contactIds: formValue.contactIds.length ? formValue.contactIds : undefined,
    paymentMethodIds: formValue.paymentMethodIds.length ? formValue.paymentMethodIds : undefined,
    statuses: formValue.statuses.length ? formValue.statuses : undefined,
    minAmount: formValue.minAmount ?? undefined,
    maxAmount: formValue.maxAmount ?? undefined,
    saleReferenceNumbers: formValue.saleReferenceNumbers.length ? formValue.saleReferenceNumbers : undefined
  })
}
