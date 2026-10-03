import {Component, computed, inject, model, OnInit} from '@angular/core'
import {Badge} from 'primeng/badge'
import {Divider} from 'primeng/divider'
import {Tab, TabList, TabPanel, TabPanels, Tabs} from 'primeng/tabs'
import {TaxEntrySearchResultService} from '../../../api/location-level/tax-entry/tax-entry-search-result.service'
import {TaxEntrySearchSummaryService} from '../../../api/location-level/tax-entry/tax-entry-search-summary.service'
import {FiscalPeriodService} from '../../../api/organization-level/fiscal-period/fiscal-period.service'
import {OrgTaxTypeService} from '../../../api/organization-level/org-tax-type/org-tax-type.service'
import {AutoStretchDirective} from '../../reusable/auto-stretch.directive'
import {LoadingContainerComponent} from '../../reusable/loading-container/loading-container.component'
import {TaxEntriesGridComponent} from './tax-entries-grid.component'
import {TaxesFilterReadonlyComponent} from './taxes-filter/taxes-filter-readonly.component'
import {TaxesFilterComponent} from './taxes-filter/taxes-filter.component'
import {TaxesFilterState} from './taxes-filter/taxes-filter.state'
import {TaxesSummaryComponent} from './taxes-summary.component'

@Component({
  selector: 'rts-taxes',
  templateUrl: 'taxes.component.html',
  imports: [
    TaxEntriesGridComponent,
    LoadingContainerComponent,
    TaxesFilterComponent,
    TaxesFilterReadonlyComponent,
    TaxesSummaryComponent,
    Divider,
    Tab,
    Tabs,
    TabList,
    Badge,
    TabPanels,
    TabPanel,
    AutoStretchDirective
  ]
})
export class TaxesComponent implements OnInit {
  private readonly taxEntrySearchResultService = inject(TaxEntrySearchResultService)
  private readonly taxEntrySearchSummaryService = inject(TaxEntrySearchSummaryService)
  private readonly fiscalPeriodService = inject(FiscalPeriodService)
  private readonly orgTaxTypeService = inject(OrgTaxTypeService)
  private readonly filterState = inject(TaxesFilterState)

  readonly entryCount = this.taxEntrySearchSummaryService.entryCount

  readonly selectedTab = model<'summary' | 'entries'>('summary')

  readonly loading = computed(() =>
    this.taxEntrySearchSummaryService.selectLoading()
      || this.fiscalPeriodService.selectLoading()
      || this.orgTaxTypeService.selectLoading()
  )

  ngOnInit() {
    this.fiscalPeriodService.fetch()
    this.orgTaxTypeService.fetch()
  }

  onSelectedTabChange(tab?: string | number) {
    const selectedTab = tab as 'summary' | 'entries'
    this.selectedTab.set(selectedTab)
    if (selectedTab === 'entries') {
      this.taxEntrySearchResultService.refetch(this.filterState.filterParams())
    }
  }
}
