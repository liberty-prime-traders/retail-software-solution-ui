import {computed, effect, inject, Injectable, signal, untracked} from '@angular/core'
import {form} from '@angular/forms/signals'
import {ContactService} from '../../../../../api/organization-level/contact/contact.service'
import {PaymentOptionService} from '../../../../../api/organization-level/payment-option/payment-option.service'
import {PaymentSummaryService} from '../../../../../api/location-level/payment/payment-summary.service'
import {PaymentType} from '../../../../../api/location-level/payment/payment-type.enum'
import {PrettifyEnumPipe} from '../../../../../utils/pipes/prettify-enum.pipe'
import {debouncedSignal} from '../../../../../utils/signals'
import {ZonedDatesService} from '../../../../../utils/services/zoned-dates.service'
import {PaymentsFilterFormDefinition} from './payments-filter-form.definition'

@Injectable({providedIn: 'root'})
export class PaymentsFilterState {
  private readonly contactService = inject(ContactService)
  private readonly paymentOptionService = inject(PaymentOptionService)
  private readonly paymentSummaryService = inject(PaymentSummaryService)
  private readonly zonedDatesService = inject(ZonedDatesService)

  readonly maxReferenceNumbers = PaymentsFilterFormDefinition.MAX_REFERENCE_NUMBERS
  readonly types: PaymentType[] = PaymentsFilterFormDefinition.ALL_TYPES

  readonly contacts = this.contactService.selectAll
  readonly paymentMethods = this.paymentOptionService.selectAll

  readonly filterFormValue = signal(PaymentsFilterFormDefinition.createDefaultPaymentsFilterFormModel())
  readonly filterForm = form(this.filterFormValue, PaymentsFilterFormDefinition.paymentsFilterFormSchema)

  readonly contactNames = computed(() => {
    const namesById = new Map(this.contacts().map(contact => [contact.id, contact.fullName]))
    return this.filterFormValue().contactIds
      .map(id => namesById.get(id))
      .filter((name): name is string => !!name)
  })

  readonly paymentMethodNames = computed(() => {
    const namesById = new Map(this.paymentMethods().map(paymentMethod => [paymentMethod.id, paymentMethod.name]))
    return this.filterFormValue().paymentMethodIds
      .map(id => namesById.get(id))
      .filter((name): name is string => !!name)
  })

  readonly typeLabels = computed(() =>
    this.filterFormValue().selectedTypes.map(type => PrettifyEnumPipe.prototype.transform(type))
  )

  readonly statusLabels = computed(() =>
    this.filterFormValue().statuses.map(status => PrettifyEnumPipe.prototype.transform(status))
  )

  private readonly debouncedFilterFormValue = debouncedSignal(this.filterFormValue, 1500)

  readonly filterParams = computed(() =>
    PaymentsFilterFormDefinition.convertToFilterParams(this.debouncedFilterFormValue(), this.zonedDatesService)
  )

  private readonly refetchSummaryOnFilterChange = effect(() => {
    const filterParams = this.filterParams()
    untracked(() => this.paymentSummaryService.refetch(filterParams))
  })

  addReferenceNumbers(type: PaymentType, rawValue: string) {
    const candidates = rawValue.split(/[\n,]/).map(value => value.trim()).filter(Boolean)
    if (candidates.length === 0) {
      return
    }
    this.updateReferenceNumbers(type, current =>
      Array.from(new Set([...current, ...candidates])).slice(0, this.maxReferenceNumbers)
    )
  }

  removeReferenceNumber(type: PaymentType, referenceNumber: string) {
    this.updateReferenceNumbers(type, current => current.filter(value => value !== referenceNumber))
  }

  private updateReferenceNumbers(type: PaymentType, update: (current: string[]) => string[]) {
    this.filterFormValue.update(formValue => ({
      ...formValue,
      referenceNumbersByType: {
        ...formValue.referenceNumbersByType,
        [type]: update(formValue.referenceNumbersByType[type])
      }
    }))
  }

  resetFilters() {
    this.filterFormValue.set(PaymentsFilterFormDefinition.createDefaultPaymentsFilterFormModel())
  }
}
