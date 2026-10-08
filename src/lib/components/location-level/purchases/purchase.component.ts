import {Component, computed, inject, model, OnInit} from '@angular/core'
import {Badge} from 'primeng/badge'
import {ButtonDirective} from 'primeng/button'
import {Divider} from 'primeng/divider'
import {Tab, TabList, TabPanel, TabPanels, Tabs} from 'primeng/tabs'
import {ContactService} from '../../../api/organization-level/contact/contact.service'
import {PurchaseSearchResultService} from '../../../api/location-level/purchase/purchase-search-result.service'
import {PurchaseSearchSummaryService} from '../../../api/location-level/purchase/purchase-search-summary.service'
import {AutoStretchDirective} from '../../reusable/auto-stretch.directive'
import {LoadingContainerComponent} from '../../reusable/loading-container/loading-container.component'
import {PurchaseFormContext} from './purchase-form/form-utils/purchase-form-context'
import {PurchaseFormComponent} from './purchase-form/purchase-form.component'
import {PurchaseGridComponent} from './purchase-grid/purchase-grid.component'
import {PurchasesFilterComponent} from './purchases-filter/purchases-filter.component'
import {PurchasesFilterReadonlyComponent} from './purchases-filter/purchases-filter-readonly.component'
import {PurchasesFilterState} from './purchases-filter/purchases-filter.state'
import {PurchasesSummaryComponent} from './purchases-summary.component'

@Component({
  selector: 'rts-purchases',
  templateUrl: 'purchase.component.html',
  providers: [PurchaseFormContext],
  imports: [
    ButtonDirective,
    PurchaseGridComponent,
    PurchaseFormComponent,
    LoadingContainerComponent,
    PurchasesFilterComponent,
    PurchasesFilterReadonlyComponent,
    PurchasesSummaryComponent,
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
export class PurchaseComponent implements OnInit {
  private readonly purchaseSearchResultService = inject(PurchaseSearchResultService)
  private readonly purchaseSearchSummaryService = inject(PurchaseSearchSummaryService)
  private readonly contactService = inject(ContactService)
  private readonly filterState = inject(PurchasesFilterState)
  private readonly context = inject(PurchaseFormContext)

  readonly formIsVisible = this.context.formIsVisible
  readonly purchaseCount = this.purchaseSearchSummaryService.purchaseCount

  readonly selectedTab = model<'summary' | 'purchases'>('purchases')

  readonly loading = computed(() =>
    this.purchaseSearchSummaryService.selectLoading()
      || this.contactService.selectLoading()
  )

  ngOnInit() {
    this.onSelectedTabChange(this.selectedTab())
    this.contactService.fetch()
  }

  onSelectedTabChange(tab?: string | number) {
    const selectedTab = tab as 'summary' | 'purchases'
    this.selectedTab.set(selectedTab)
    if (selectedTab === 'purchases') {
      this.purchaseSearchResultService.refetch(this.filterState.filterParams())
    }
  }

  startNewPurchase() {
    this.context.startNewPurchase()
  }

  hideForm() {
    this.context.hideForm()
    this.filterState.refreshResults()
  }
}
