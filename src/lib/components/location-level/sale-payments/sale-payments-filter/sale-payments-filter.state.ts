import {computed, effect, inject, Injectable, signal, untracked} from '@angular/core'
import {form} from '@angular/forms/signals'
import {ContactService} from '../../../../api/organization-level/contact/contact.service'
import {PaymentOptionService} from '../../../../api/organization-level/payment-option/payment-option.service'
import {SalePaymentSummaryService} from '../../../../api/location-level/sale-payment/sale-payment-summary.service'
import {PrettifyEnumPipe} from '../../../../utils/pipes/prettify-enum.pipe'
import {debouncedSignal} from '../../../../utils/signals'
import {ZonedDatesService} from '../../../../utils/services/zoned-dates.service'
import {SalePaymentsFilterFormDefinition} from './sale-payments-filter-form.definition'

@Injectable()
export class SalePaymentsFilterState {
  private readonly contactService = inject(ContactService)
  private readonly paymentOptionService = inject(PaymentOptionService)
  private readonly salePaymentSummaryService = inject(SalePaymentSummaryService)
  private readonly zonedDatesService = inject(ZonedDatesService)

  readonly maxSaleReferenceNumbers = SalePaymentsFilterFormDefinition.MAX_SALE_REFERENCE_NUMBERS

  readonly customers = this.contactService.customers
  readonly paymentMethods = this.paymentOptionService.selectAll

  readonly filterFormValue = signal(SalePaymentsFilterFormDefinition.createDefaultSalePaymentsFilterFormModel())
  readonly filterForm = form(this.filterFormValue, SalePaymentsFilterFormDefinition.salePaymentsFilterFormSchema)

  readonly customerNames = computed(() => {
    const namesById = new Map(this.customers().map(customer => [customer.id, customer.fullName]))
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

  readonly statusLabels = computed(() =>
    this.filterFormValue().statuses.map(status => PrettifyEnumPipe.prototype.transform(status))
  )

  private readonly debouncedFilterFormValue = debouncedSignal(this.filterFormValue, 1500)

  private readonly refetchSummaryOnFilterChange = effect(() => {
    const filterParams = SalePaymentsFilterFormDefinition.convertToFilterParams(
      this.debouncedFilterFormValue(), this.zonedDatesService
    )
    untracked(() => this.salePaymentSummaryService.refetch(filterParams))
  })

  addSaleReferenceNumbers(rawValue: string) {
    const candidates = rawValue.split(/[\n,]/).map(value => value.trim()).filter(Boolean)
    if (candidates.length === 0) {
      return
    }

    const saleReferenceNumbers = this.filterForm.saleReferenceNumbers().value
    const merged = Array.from(new Set([...saleReferenceNumbers(), ...candidates])).slice(0, this.maxSaleReferenceNumbers)
    saleReferenceNumbers.set(merged)
  }

  removeSaleReferenceNumber(referenceNumber: string) {
    const saleReferenceNumbers = this.filterForm.saleReferenceNumbers().value
    saleReferenceNumbers.set(saleReferenceNumbers().filter(value => value !== referenceNumber))
  }

  resetFilters() {
    this.filterFormValue.set(SalePaymentsFilterFormDefinition.createDefaultSalePaymentsFilterFormModel())
  }
}
