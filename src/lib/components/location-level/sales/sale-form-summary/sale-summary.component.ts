import {CurrencyPipe} from '@angular/common'
import {Component, computed, inject} from '@angular/core'
import {Badge} from 'primeng/badge'
import {Button} from 'primeng/button'
import {Card} from 'primeng/card'
import {Divider} from 'primeng/divider'
import {Tab, TabList, TabPanel, TabPanels, Tabs} from 'primeng/tabs'
import {SaleSessionService} from '../../../../api/location-level/sale_session/sale-session.service'
import {ErrorSummaryComponent} from '../../../reusable/error-summary/error-summary.component'
import {SaleFormContext} from '../form-utils/sale-form-context'
import {SaleFormDefinition} from '../form-utils/sale-form.definition'
import {SalePaymentFormComponent} from '../sale-payment-form/sale-payment-form.component'
import {SalePaymentsGridComponent} from '../sale-payments-grid/sale-payments-grid.component'

@Component({
  selector: 'rts-sale-payment-summary',
  templateUrl: 'sale-summary.component.html',
  styleUrl: 'sale-summary.component.scss',
  imports: [
    Button,
    Card,
    CurrencyPipe,
    SalePaymentFormComponent,
    ErrorSummaryComponent,
    SalePaymentsGridComponent,
    Divider,
    Tabs,
    TabList,
    Tab,
    TabPanel,
    TabPanels,
    Badge
  ]
})
export class SaleSummaryComponent {

  private readonly context = inject(SaleFormContext)
  private readonly saleSessionService = inject(SaleSessionService)

  readonly saleForm = this.context.saleForm
  readonly saleFormFieldMap = SaleFormDefinition.fieldMap
  readonly saleSession =  this.context.saleSession
  readonly paymentsCount = computed(() => this.context.payments().length)
  readonly failureMessages = this.saleSessionService.selectFailureMessages
  readonly canMakeChangesToTheSale = computed(() => this.saleSession()?.uiOptions.canMakeChangesToTheSale)
  readonly canAddPaymentsToSale = computed(() => this.saleSession()?.uiOptions.canAddPaymentsToSale)

  saveDraft() {
    this.saleSessionService.saveAsDraft({onSuccess: this.context.loadSession})
  }

  completeSale() {
    this.saleSessionService.confirmSession({onSuccess: this.context.loadSession})
  }
}
