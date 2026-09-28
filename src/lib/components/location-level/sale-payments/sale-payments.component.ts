import {Component, computed, inject, model, OnInit} from '@angular/core'
import {Badge} from 'primeng/badge'
import {Divider} from 'primeng/divider'
import {Tab, TabList, TabPanel, TabPanels, Tabs} from 'primeng/tabs'
import {ContactService} from '../../../api/organization-level/contact/contact.service'
import {PaymentOptionService} from '../../../api/organization-level/payment-option/payment-option.service'
import {SalePaymentSummaryService} from '../../../api/location-level/sale-payment/sale-payment-summary.service'
import {AutoStretchDirective} from '../../reusable/auto-stretch.directive'
import {LoadingContainerComponent} from '../../reusable/loading-container/loading-container.component'
import {SalePaymentsFilterComponent} from './sale-payments-filter/sale-payments-filter.component'
import {SalePaymentsFilterReadonlyComponent} from './sale-payments-filter/sale-payments-filter-readonly.component'
import {SalePaymentsFilterState} from './sale-payments-filter/sale-payments-filter.state'
import {SalePaymentsSummaryGridComponent} from './sale-payments-summary-grid.component'
import {SalePaymentsSummaryComponent} from './sale-payments-summary.component'

@Component({
  selector: 'rts-sale-payments',
  imports: [
    LoadingContainerComponent,
    SalePaymentsFilterComponent,
    SalePaymentsFilterReadonlyComponent,
    Divider,
    Tab,
    Tabs,
    TabList,
    Badge,
    TabPanels,
    TabPanel,
    SalePaymentsSummaryComponent,
    SalePaymentsSummaryGridComponent,
    AutoStretchDirective
  ],
  providers: [SalePaymentsFilterState],
  templateUrl: 'sale-payments.component.html'
})
export class SalePaymentsComponent implements OnInit {
  private readonly salePaymentSummaryService = inject(SalePaymentSummaryService)
  private readonly paymentOptionService = inject(PaymentOptionService)
  private readonly contactService = inject(ContactService)

  readonly activePaymentsCount = this.salePaymentSummaryService.activePaymentsCount
  readonly voidedPaymentsCount = this.salePaymentSummaryService.voidedPaymentsCount
  readonly paymentsCount = computed(() => this.activePaymentsCount() + this.voidedPaymentsCount())

  readonly selectedTab = model<'summary' | 'payments'>('summary')

  readonly loading = computed(() =>
    this.salePaymentSummaryService.selectLoading()
      || this.paymentOptionService.selectLoading()
      || this.contactService.selectLoading()
  )

  ngOnInit() {
    this.paymentOptionService.fetch()
    this.contactService.fetch()
  }
}
