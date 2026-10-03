import {computed, effect, inject, Injectable, signal, untracked} from '@angular/core'
import {form} from '@angular/forms/signals'
import {SaleSearchResultService} from '../../../../api/location-level/sale-summary/sale-search-result.service'
import {SaleSearchSummaryService} from '../../../../api/location-level/sale-summary/sale-search-summary.service'
import {SaleSessionService} from '../../../../api/location-level/sale_session/sale-session.service'
import {OrgMembershipUserService} from '../../../../api/organization-level/membership/org-membership-user.service'
import {ContactService} from '../../../../api/organization-level/contact/contact.service'
import {PrettifyEnumPipe} from '../../../../utils/pipes/prettify-enum.pipe'
import {debouncedSignal, runOnSignalChange} from '../../../../utils/signals'
import {ZonedDatesService} from '../../../../utils/services/zoned-dates.service'
import {SalesFilterFormDefinition} from './sales-filter-form.definition'

@Injectable({providedIn: 'root'})
export class SalesFilterState {
  private readonly contactService = inject(ContactService)
  private readonly orgMembershipUserService = inject(OrgMembershipUserService)
  private readonly saleSearchSummaryService = inject(SaleSearchSummaryService)
  private readonly saleSearchResultService = inject(SaleSearchResultService)
  private readonly saleSessionService = inject(SaleSessionService)
  private readonly zonedDatesService = inject(ZonedDatesService)

  readonly maxSaleReferenceNumbers = SalesFilterFormDefinition.MAX_SALE_REFERENCE_NUMBERS

  readonly customers = this.contactService.customers
  readonly soldByUsers = this.orgMembershipUserService.selectAll

  readonly filterFormValue = signal(SalesFilterFormDefinition.createDefaultSalesFilterFormModel())
  readonly filterForm = form(this.filterFormValue, SalesFilterFormDefinition.salesFilterFormSchema)

  readonly customerNames = computed(() => {
    const namesById = new Map(this.customers().map(customer => [customer.id, customer.fullName]))
    return this.filterFormValue().contactIds
      .map(id => namesById.get(id))
      .filter((name): name is string => !!name)
  })

  readonly soldByUserNames = computed(() => {
    const namesById = new Map(this.soldByUsers().map(user => [user.userId, user.fullName]))
    return this.filterFormValue().soldByUserIds
      .map(id => namesById.get(id))
      .filter((name): name is string => !!name)
  })

  readonly saleStatusLabels = computed(() =>
    this.filterFormValue().saleStatuses.map(status => PrettifyEnumPipe.prototype.transform(status))
  )

  readonly paymentStatusLabels = computed(() =>
    this.filterFormValue().paymentStatuses.map(status => PrettifyEnumPipe.prototype.transform(status))
  )

  private readonly debouncedFilterFormValue = debouncedSignal(this.filterFormValue, 1500)

  readonly filterParams = computed(() =>
    SalesFilterFormDefinition.convertToFilterParams(this.debouncedFilterFormValue(), this.zonedDatesService)
  )

  private readonly refetchSummaryOnFilterChange = effect(() => {
    const filterParams = this.filterParams()
    untracked(() => this.saleSearchSummaryService.refetch(filterParams))
  })

  // Force a reload whenever a sale is actually confirmed/voided/paid (see SaleSessionService.saleMutated).
  // The sale form is a full-page overlay that destroys/recreates the sales page on close, so by the
  // time the page remounts there's no component state left to know a reload is warranted — and since
  // the filter params themselves haven't changed, the usual change-detected `refetch` would skip it.
  private readonly refreshResultsOnSaleMutation =
    runOnSignalChange(this.saleSessionService.saleMutated, () => this.refreshResults())

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
    this.filterFormValue.set(SalesFilterFormDefinition.createDefaultSalesFilterFormModel())
  }

  private refreshResults() {
    const filterParams = this.filterParams()
    this.saleSearchResultService.forceRefetch(filterParams)
    this.saleSearchSummaryService.forceRefetch(filterParams)
  }
}
