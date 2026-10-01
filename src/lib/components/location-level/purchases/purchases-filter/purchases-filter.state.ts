import {computed, effect, inject, Injectable, signal, untracked} from '@angular/core'
import {form} from '@angular/forms/signals'
import {ContactService} from '../../../../api/organization-level/contact/contact.service'
import {PurchaseSearchResultService} from '../../../../api/location-level/purchase/purchase-search-result.service'
import {PurchaseSearchSummaryService} from '../../../../api/location-level/purchase/purchase-search-summary.service'
import {PrettifyEnumPipe} from '../../../../utils/pipes/prettify-enum.pipe'
import {debouncedSignal} from '../../../../utils/signals'
import {ZonedDatesService} from '../../../../utils/services/zoned-dates.service'
import {PurchasesFilterFormDefinition} from './purchases-filter-form.definition'

@Injectable({providedIn: 'root'})
export class PurchasesFilterState {
  private readonly contactService = inject(ContactService)
  private readonly purchaseSearchSummaryService = inject(PurchaseSearchSummaryService)
  private readonly purchaseSearchResultService = inject(PurchaseSearchResultService)
  private readonly zonedDatesService = inject(ZonedDatesService)

  readonly maxPurchaseReferenceNumbers = PurchasesFilterFormDefinition.MAX_PURCHASE_REFERENCE_NUMBERS

  readonly suppliers = this.contactService.suppliers

  readonly filterFormValue = signal(PurchasesFilterFormDefinition.createDefaultPurchasesFilterFormModel())
  readonly filterForm = form(this.filterFormValue, PurchasesFilterFormDefinition.purchasesFilterFormSchema)

  readonly supplierNames = computed(() => {
    const namesById = new Map(this.suppliers().map(supplier => [supplier.id, supplier.fullName]))
    return this.filterFormValue().supplierIds
      .map(id => namesById.get(id))
      .filter((name): name is string => !!name)
  })

  readonly purchaseStatusLabels = computed(() =>
    this.filterFormValue().purchaseStatuses.map(status => PrettifyEnumPipe.prototype.transform(status))
  )

  readonly paymentStatusLabels = computed(() =>
    this.filterFormValue().paymentStatuses.map(status => PrettifyEnumPipe.prototype.transform(status))
  )

  private readonly debouncedFilterFormValue = debouncedSignal(this.filterFormValue, 1500)

  readonly filterParams = computed(() =>
    PurchasesFilterFormDefinition.convertToFilterParams(this.debouncedFilterFormValue(), this.zonedDatesService)
  )

  private readonly refetchSummaryOnFilterChange = effect(() => {
    const filterParams = this.filterParams()
    untracked(() => this.purchaseSearchSummaryService.refetch(filterParams))
  })

  addPurchaseReferenceNumbers(rawValue: string) {
    const candidates = rawValue.split(/[\n,]/).map(value => value.trim()).filter(Boolean)
    if (candidates.length === 0) {
      return
    }

    const purchaseReferenceNumbers = this.filterForm.purchaseReferenceNumbers().value
    const merged = Array.from(new Set([...purchaseReferenceNumbers(), ...candidates])).slice(0, this.maxPurchaseReferenceNumbers)
    purchaseReferenceNumbers.set(merged)
  }

  removePurchaseReferenceNumber(referenceNumber: string) {
    const purchaseReferenceNumbers = this.filterForm.purchaseReferenceNumbers().value
    purchaseReferenceNumbers.set(purchaseReferenceNumbers().filter(value => value !== referenceNumber))
  }

  resetFilters() {
    this.filterFormValue.set(PurchasesFilterFormDefinition.createDefaultPurchasesFilterFormModel())
  }

  refreshResults() {
    const filterParams = this.filterParams()
    this.purchaseSearchResultService.forceRefetch(filterParams)
    this.purchaseSearchSummaryService.forceRefetch(filterParams)
  }
}
