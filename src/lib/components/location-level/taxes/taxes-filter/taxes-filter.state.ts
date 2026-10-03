import {computed, effect, inject, Injectable, signal, untracked} from '@angular/core'
import {form} from '@angular/forms/signals'
import {TaxEntrySearchSummaryService} from '../../../../api/location-level/tax-entry/tax-entry-search-summary.service'
import {FiscalPeriodService} from '../../../../api/organization-level/fiscal-period/fiscal-period.service'
import {OrgTaxTypeService} from '../../../../api/organization-level/org-tax-type/org-tax-type.service'
import {PrettifyEnumPipe} from '../../../../utils/pipes/prettify-enum.pipe'
import {debouncedSignal} from '../../../../utils/signals'
import {TaxesFilterFormDefinition} from './taxes-filter-form.definition'

@Injectable({providedIn: 'root'})
export class TaxesFilterState {
  private readonly fiscalPeriodService = inject(FiscalPeriodService)
  private readonly orgTaxTypeService = inject(OrgTaxTypeService)
  private readonly taxEntrySearchSummaryService = inject(TaxEntrySearchSummaryService)

  readonly maxSourceReferenceNumbers = TaxesFilterFormDefinition.MAX_SOURCE_REFERENCE_NUMBERS

  readonly fiscalPeriods = this.fiscalPeriodService.selectAll
  readonly taxTypes = this.orgTaxTypeService.selectAll

  readonly filterFormValue = signal(TaxesFilterFormDefinition.createDefaultTaxesFilterFormModel())
  readonly filterForm = form(this.filterFormValue, TaxesFilterFormDefinition.taxesFilterFormSchema)

  readonly fiscalPeriodNames = computed(() => {
    const namesById = new Map(this.fiscalPeriods().map(period => [period.id, period.name]))
    return this.filterFormValue().fiscalPeriodIds
      .map(id => namesById.get(id))
      .filter((name): name is string => !!name)
  })

  readonly taxTypeNames = computed(() => {
    const namesById = new Map(this.taxTypes().map(taxType => [taxType.id, taxType.taxLabel]))
    return this.filterFormValue().taxTypeIds
      .map(id => namesById.get(id))
      .filter((name): name is string => !!name)
  })

  readonly sourceTypeLabels = computed(() =>
    this.filterFormValue().sourceTypes.map(sourceType => PrettifyEnumPipe.prototype.transform(sourceType))
  )

  private readonly debouncedFilterFormValue = debouncedSignal(this.filterFormValue, 1500)

  readonly filterParams = computed(() =>
    TaxesFilterFormDefinition.convertToFilterParams(this.debouncedFilterFormValue())
  )

  private readonly refetchSummaryOnFilterChange = effect(() => {
    const filterParams = this.filterParams()
    untracked(() => this.taxEntrySearchSummaryService.refetch(filterParams))
  })

  addSourceReferenceNumbers(rawValue: string) {
    const candidates = rawValue.split(/[\n,]/).map(value => value.trim()).filter(Boolean)
    if (candidates.length === 0) {
      return
    }

    const sourceReferenceNumbers = this.filterForm.sourceReferenceNumbers().value
    const merged = Array.from(new Set([...sourceReferenceNumbers(), ...candidates]))
      .slice(0, this.maxSourceReferenceNumbers)
    sourceReferenceNumbers.set(merged)
  }

  removeSourceReferenceNumber(referenceNumber: string) {
    const sourceReferenceNumbers = this.filterForm.sourceReferenceNumbers().value
    sourceReferenceNumbers.set(sourceReferenceNumbers().filter(value => value !== referenceNumber))
  }

  resetFilters() {
    this.filterFormValue.set(TaxesFilterFormDefinition.createDefaultTaxesFilterFormModel())
  }
}
