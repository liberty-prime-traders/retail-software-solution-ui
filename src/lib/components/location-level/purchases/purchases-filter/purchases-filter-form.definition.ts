import {schema} from '@angular/forms/signals'
import {PaymentStatus} from '../../../../api/location-level/purchase/payment-status.enum'
import {PurchaseSearchParameters} from '../../../../api/location-level/purchase/purchase-search-parameters.model'
import {PurchaseStatus} from '../../../../api/location-level/purchase/purchase-status.enum'
import {getToday} from '../../../../utils/dates'
import {ZonedDatesService} from '../../../../utils/services/zoned-dates.service'

export namespace PurchasesFilterFormDefinition {
  export interface PurchasesFilterFormModel {
    recordedFrom: Date | null
    recordedBefore: Date | null
    purchaseDateFrom: Date | null
    purchaseDateBefore: Date | null
    supplierIds: string[]
    purchaseStatuses: PurchaseStatus[]
    paymentStatuses: PaymentStatus[]
    minAmount: number | null
    maxAmount: number | null
    purchaseReferenceNumbers: string[]
  }

  export const MAX_PURCHASE_REFERENCE_NUMBERS = 20

  export const createDefaultPurchasesFilterFormModel = (): PurchasesFilterFormModel => {
    const tomorrow = getToday()
    tomorrow.setDate(tomorrow.getDate() + 1)

    const sevenDaysAgo = getToday()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    return {
      recordedFrom: sevenDaysAgo,
      recordedBefore: tomorrow,
      purchaseDateFrom: null,
      purchaseDateBefore: null,
      supplierIds: [],
      purchaseStatuses: [],
      paymentStatuses: [],
      minAmount: null,
      maxAmount: null,
      purchaseReferenceNumbers: []
    }
  }

  export const purchasesFilterFormSchema = schema<PurchasesFilterFormModel>(() => {})

  export const convertToFilterParams = (
    formValue: PurchasesFilterFormModel, zonedDatesService: ZonedDatesService
  ): PurchaseSearchParameters => ({
    recordedFrom: zonedDatesService.atOrgZone(formValue.recordedFrom) || undefined,
    recordedBefore: zonedDatesService.atOrgZone(formValue.recordedBefore) || undefined,
    purchaseDateFrom: zonedDatesService.atOrgZone(formValue.purchaseDateFrom) || undefined,
    purchaseDateBefore: zonedDatesService.atOrgZone(formValue.purchaseDateBefore) || undefined,
    supplierIds: formValue.supplierIds.length ? formValue.supplierIds : undefined,
    purchaseStatuses: formValue.purchaseStatuses.length ? formValue.purchaseStatuses : undefined,
    paymentStatuses: formValue.paymentStatuses.length ? formValue.paymentStatuses : undefined,
    minAmount: formValue.minAmount ?? undefined,
    maxAmount: formValue.maxAmount ?? undefined,
    purchaseReferenceNumbers: formValue.purchaseReferenceNumbers.length ? formValue.purchaseReferenceNumbers : undefined
  })
}
