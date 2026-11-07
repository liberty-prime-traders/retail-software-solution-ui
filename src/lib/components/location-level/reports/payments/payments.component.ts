import {Component, computed, inject, model, OnInit} from '@angular/core'
import {Badge} from 'primeng/badge'
import {Divider} from 'primeng/divider'
import {Tab, TabList, TabPanel, TabPanels, Tabs} from 'primeng/tabs'
import {ContactService} from '../../../../api/organization-level/contact/contact.service'
import {PaymentOptionService} from '../../../../api/organization-level/payment-option/payment-option.service'
import {PaymentSearchResultService} from '../../../../api/location-level/payment/payment-search-result.service'
import {PaymentSummaryService} from '../../../../api/location-level/payment/payment-summary.service'
import {AutoStretchDirective} from '../../../reusable/auto-stretch.directive'
import {LoadingContainerComponent} from '../../../reusable/loading-container/loading-container.component'
import {PaymentsFilterComponent} from './payments-filter/payments-filter.component'
import {PaymentsFilterReadonlyComponent} from './payments-filter/payments-filter-readonly.component'
import {PaymentsFilterState} from './payments-filter/payments-filter.state'
import {PaymentsGridComponent} from './payments-grid.component'
import {PaymentsSummaryComponent} from './payments-summary.component'

@Component({
  selector: 'rts-payments',
  imports: [
    LoadingContainerComponent,
    PaymentsFilterComponent,
    PaymentsFilterReadonlyComponent,
    Divider,
    Tab,
    Tabs,
    TabList,
    Badge,
    TabPanels,
    TabPanel,
    PaymentsSummaryComponent,
    PaymentsGridComponent,
    AutoStretchDirective
  ],
  templateUrl: 'payments.component.html'
})
export class PaymentsComponent implements OnInit {
  private readonly paymentSummaryService = inject(PaymentSummaryService)
  private readonly paymentSearchResultService = inject(PaymentSearchResultService)
  private readonly paymentOptionService = inject(PaymentOptionService)
  private readonly contactService = inject(ContactService)
  private readonly filterState = inject(PaymentsFilterState)

  readonly activePaymentsCount = this.paymentSummaryService.activePaymentsCount
  readonly voidedPaymentsCount = this.paymentSummaryService.voidedPaymentsCount
  readonly paymentsCount = computed(() => this.activePaymentsCount() + this.voidedPaymentsCount())

  readonly selectedTab = model<'summary' | 'payments'>('summary')

  readonly loading = computed(() =>
    this.paymentSummaryService.selectLoading()
      || this.paymentOptionService.selectLoading()
      || this.contactService.selectLoading()
  )

  ngOnInit() {
    this.paymentOptionService.fetch()
    this.contactService.fetch()
  }

  onSelectedTabChange(tab?: string | number) {
    const selectedTab = tab as 'summary' | 'payments'
    this.selectedTab.set(selectedTab)
    if (selectedTab === 'payments') {
      this.paymentSearchResultService.refetch(this.filterState.filterParams())
    }
  }
}
