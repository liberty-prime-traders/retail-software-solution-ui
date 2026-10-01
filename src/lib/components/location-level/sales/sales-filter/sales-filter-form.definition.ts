import {schema} from '@angular/forms/signals'
import {PaymentStatus} from '../../../../api/location-level/purchase/payment-status.enum'
import {SaleSearchParameters} from '../../../../api/location-level/sale-summary/sale-search-parameters.model'
import {SaleStatus} from '../../../../api/location-level/sale-summary/sale-status.enum'
import {getToday} from '../../../../utils/dates'
import {ZonedDatesService} from '../../../../utils/services/zoned-dates.service'

export namespace SalesFilterFormDefinition {
  export interface SalesFilterFormModel {
    createdFrom: Date | null
    createdBefore: Date | null
    contactIds: string[]
    soldByUserIds: string[]
    saleStatuses: SaleStatus[]
    paymentStatuses: PaymentStatus[]
    minReceivableTotal: number | null
    maxReceivableTotal: number | null
    minDiscountTotal: number | null
    maxDiscountTotal: number | null
    saleReferenceNumbers: string[]
  }

  export const MAX_SALE_REFERENCE_NUMBERS = 20

  export const createDefaultSalesFilterFormModel = (): SalesFilterFormModel => {
    const tomorrow = getToday()
    tomorrow.setDate(tomorrow.getDate() + 1)

    return {
      createdFrom: getToday(),
      createdBefore: tomorrow,
      contactIds: [],
      soldByUserIds: [],
      saleStatuses: [],
      paymentStatuses: [],
      minReceivableTotal: null,
      maxReceivableTotal: null,
      minDiscountTotal: null,
      maxDiscountTotal: null,
      saleReferenceNumbers: []
    }
  }

  export const salesFilterFormSchema = schema<SalesFilterFormModel>(() => {})

  export const convertToFilterParams = (
    formValue: SalesFilterFormModel, zonedDatesService: ZonedDatesService
  ): SaleSearchParameters => ({
    createdFrom: zonedDatesService.atOrgZone(formValue.createdFrom) || undefined,
    createdBefore: zonedDatesService.atOrgZone(formValue.createdBefore) || undefined,
    contactIds: formValue.contactIds.length ? formValue.contactIds : undefined,
    soldByUserIds: formValue.soldByUserIds.length ? formValue.soldByUserIds : undefined,
    saleStatuses: formValue.saleStatuses.length ? formValue.saleStatuses : undefined,
    paymentStatuses: formValue.paymentStatuses.length ? formValue.paymentStatuses : undefined,
    minReceivableTotal: formValue.minReceivableTotal ?? undefined,
    maxReceivableTotal: formValue.maxReceivableTotal ?? undefined,
    minDiscountTotal: formValue.minDiscountTotal ?? undefined,
    maxDiscountTotal: formValue.maxDiscountTotal ?? undefined,
    saleReferenceNumbers: formValue.saleReferenceNumbers.length ? formValue.saleReferenceNumbers : undefined
  })
}
