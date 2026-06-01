import {Component, computed, inject} from '@angular/core'
import {Badge} from 'primeng/badge'
import {Card} from 'primeng/card'
import {Divider} from 'primeng/divider'
import {Tab, TabList, TabPanel, TabPanels, Tabs} from 'primeng/tabs'
import {SaleSessionService} from '../../../../api/location-level/sale_session/sale-session.service'
import {AutoStretchService} from '../../../reusable/auto-stretch.service'
import {ErrorSummaryComponent} from '../../../reusable/error-summary/error-summary.component'
import {SaleFormContext} from '../form-utils/sale-form-context'
import {SaleFormDefinition} from '../form-utils/sale-form.definition'
import {SalePaymentFormComponent} from './sale-payment-form/sale-payment-form.component'
import {SalePaymentsGridComponent} from './sale-payments-grid/sale-payments-grid.component'
import {SaleTotalsComponent} from './sale-totals/sale-totals.component'

@Component({
  selector: 'rts-sale-form-summary',
  templateUrl: 'sale-form-summary.component.html',
  styleUrl: 'sale-form-summary.component.scss',
  imports: [
    Card,
    SalePaymentFormComponent,
    SalePaymentsGridComponent,
    Tabs,
    TabList,
    Tab,
    TabPanel,
    TabPanels,
    Badge,
    Divider,
    ErrorSummaryComponent,
    SaleTotalsComponent
  ]
})
export class SaleFormSummaryComponent {
  private readonly context = inject(SaleFormContext)
  private readonly saleSessionService = inject(SaleSessionService)
  private readonly autoStretchService = inject(AutoStretchService)

  readonly saleSession =  this.context.saleSession
  readonly saleForm = this.context.saleForm
  readonly paymentsCount = computed(() => this.context.payments().length)
  readonly failureMessages = this.saleSessionService.selectFailureMessages
  readonly canAddPaymentsToSale = computed(() => this.saleSession()?.uiOptions.canAddPaymentsToSale)
  readonly saleFormFieldMap = SaleFormDefinition.fieldMap

  onTabChange() {
    this.autoStretchService.triggerStretch()
  }
}
