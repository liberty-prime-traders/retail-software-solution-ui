import {Component, computed, effect, inject, model, OnInit, untracked} from '@angular/core'
import {Badge} from 'primeng/badge'
import {Divider} from 'primeng/divider'
import {Tab, TabList, TabPanel, TabPanels, Tabs} from 'primeng/tabs'
import {SaleSearchResultService} from '../../../api/location-level/sale-summary/sale-search-result.service'
import {SaleSearchSummaryService} from '../../../api/location-level/sale-summary/sale-search-summary.service'
import {OrgMembershipUserService} from '../../../api/organization-level/membership/org-membership-user.service'
import {ContactService} from '../../../api/organization-level/contact/contact.service'
import {UserContextService} from '../../../utils/services/auth/user-context.service'
import {AutoStretchDirective} from '../../reusable/auto-stretch.directive'
import {LoadingContainerComponent} from '../../reusable/loading-container/loading-container.component'
import {SaleGridComponent} from './sales-grid/sale-grid.component'
import {SalesFilterComponent} from './sales-filter/sales-filter.component'
import {SalesFilterReadonlyComponent} from './sales-filter/sales-filter-readonly.component'
import {SalesFilterState} from './sales-filter/sales-filter.state'
import {SalesSummaryComponent} from './sales-summary.component'

@Component({
  selector: 'rts-sales',
  templateUrl: 'sales.component.html',
  imports: [
    SaleGridComponent,
    LoadingContainerComponent,
    SalesFilterComponent,
    SalesFilterReadonlyComponent,
    SalesSummaryComponent,
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
export class SalesComponent implements OnInit {
  private readonly saleSearchResultService = inject(SaleSearchResultService)
  private readonly saleSearchSummaryService = inject(SaleSearchSummaryService)
  private readonly contactService = inject(ContactService)
  private readonly orgMembershipUserService = inject(OrgMembershipUserService)
  private readonly filterState = inject(SalesFilterState)
  private readonly userContextService = inject(UserContextService)

  readonly salesGridOnly = computed(() => !this.userContextService.isLibertyAdmin())

  readonly saleCount = this.saleSearchSummaryService.saleCount

  readonly selectedTab = model<'summary' | 'sales'>('sales')

  readonly loading = computed(() =>
    this.saleSearchSummaryService.selectLoading()
      || this.contactService.selectLoading()
      || this.orgMembershipUserService.selectLoading()
  )

  private readonly refetchSalesOnFilterChange = effect(() => {
    const filterParams = this.filterState.filterParams()
    if (this.salesGridOnly()) {
      untracked(() => this.saleSearchResultService.refetch(filterParams))
    }
  })

  ngOnInit() {
    this.onSelectedTabChange(this.selectedTab())
    this.contactService.fetch()
    this.orgMembershipUserService.fetch()
  }

  onSelectedTabChange(tab?: string | number) {
    const selectedTab = tab as 'summary' | 'sales'
    this.selectedTab.set(selectedTab)
    if (selectedTab === 'sales') {
      this.saleSearchResultService.refetch(this.filterState.filterParams())
    }
  }
}
