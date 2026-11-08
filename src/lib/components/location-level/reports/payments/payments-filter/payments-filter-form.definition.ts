import {schema} from '@angular/forms/signals'
import {PaymentVoidStatus} from '../../../../../api/location-level/payment/payment-void-status.enum'
import {PaymentSummaryParams} from '../../../../../api/location-level/payment/payment-summary-params.model'
import {PaymentType} from '../../../../../api/location-level/payment/payment-type.enum'
import {getToday, getTomorrow} from '../../../../../utils/dates'
import {ZonedDatesService} from '../../../../../utils/services/zoned-dates.service'

export namespace PaymentsFilterFormDefinition {
  export interface PaymentsFilterFormModel {
    selectedTypes: PaymentType[]
    recordedFrom: Date | null
    recordedBefore: Date | null
    paymentDateFrom: Date | null
    paymentDateBefore: Date | null
    contactIds: string[]
    paymentMethodIds: string[]
    statuses: PaymentVoidStatus[]
    minAmount: number | null
    maxAmount: number | null
    referenceNumbersByType: Record<PaymentType, string[]>
  }

  export const MAX_REFERENCE_NUMBERS = 20

  export const ALL_TYPES: PaymentType[] = Object.values(PaymentType)

  const createEmptyReferenceNumbersByType = () =>
    Object.fromEntries(ALL_TYPES.map(type => [type, []])) as unknown as Record<PaymentType, string[]>

  export const createDefaultPaymentsFilterFormModel = (): PaymentsFilterFormModel => {
    return {
      selectedTypes: [...ALL_TYPES],
      recordedFrom: getToday(),
      recordedBefore: getTomorrow(),
      paymentDateFrom: null,
      paymentDateBefore: null,
      contactIds: [],
      paymentMethodIds: [],
      statuses: [PaymentVoidStatus.ACTIVE],
      minAmount: null,
      maxAmount: null,
      referenceNumbersByType: createEmptyReferenceNumbersByType()
    }
  }

  export const paymentsFilterFormSchema = schema<PaymentsFilterFormModel>(() => {})

  export const convertToFilterParams = (
    formValue: PaymentsFilterFormModel, zonedDatesService: ZonedDatesService
  ): PaymentSummaryParams => ({
    // An empty array must be sent: an omitted `types` makes the backend include every type.
    types: formValue.selectedTypes,
    recordedFrom: zonedDatesService.pickedDateAtOrgZone(formValue.recordedFrom) || undefined,
    recordedBefore: zonedDatesService.pickedDateAtOrgZone(formValue.recordedBefore) || undefined,
    paymentDateFrom: zonedDatesService.pickedDateAtOrgZone(formValue.paymentDateFrom) || undefined,
    paymentDateBefore: zonedDatesService.pickedDateAtOrgZone(formValue.paymentDateBefore) || undefined,
    contactIds: formValue.contactIds.length ? formValue.contactIds : undefined,
    paymentMethodIds: formValue.paymentMethodIds.length ? formValue.paymentMethodIds : undefined,
    statuses: formValue.statuses.length ? formValue.statuses : undefined,
    minAmount: formValue.minAmount ?? undefined,
    maxAmount: formValue.maxAmount ?? undefined,
    referenceNumbersByType: referenceNumbersByTypeParam(formValue.referenceNumbersByType)
  })

  const referenceNumbersByTypeParam = (referenceNumbersByType: Record<PaymentType, string[]>) => {
    const filledEntries = Object.entries(referenceNumbersByType).filter(([, referenceNumbers]) => referenceNumbers.length)
    return filledEntries.length ? Object.fromEntries(filledEntries) : undefined
  }
}
