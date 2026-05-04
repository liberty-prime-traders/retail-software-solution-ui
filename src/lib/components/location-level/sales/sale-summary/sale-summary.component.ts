import {CurrencyPipe} from '@angular/common'
import {Component, computed, inject} from '@angular/core'
import {Badge} from 'primeng/badge'
import {Button} from 'primeng/button'
import {Card} from 'primeng/card'
import {Divider} from 'primeng/divider'
import {Tab, TabList, TabPanel, TabPanels, Tabs} from 'primeng/tabs'
import {SaleStatus} from '../../../../api/location-level/sale/sale-status.enum'
import {Sale} from '../../../../api/location-level/sale/sale.model'
import {SaleService} from '../../../../api/location-level/sale/sale.service'
import {ErrorSummaryComponent} from '../../../reusable/error-summary/error-summary.component'
import {SaleFormContext} from '../form-utils/sale-form-context'
import {SaleFormDefinition} from '../form-utils/sale-form.definition'
import {SalePaymentFormComponent} from '../sale-payment-form/sale-payment-form.component'
import {SalePaymentsGridComponent} from '../sale-payments-grid/sale-payments-grid.component'

@Component({
  selector: 'rts-sale-payment-summary',
  templateUrl: 'sale-summary.component.html',
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
  private readonly saleService = inject(SaleService)

  readonly saleForm = this.context.saleForm
  readonly saleFormFieldMap = SaleFormDefinition.fieldMap
  readonly orderTotal = this.context.orderTotal
  readonly totalPaid = this.context.totalPaid
  readonly balanceDue = this.context.balanceDue
  readonly originalSale =  this.context.originalSale
  readonly paymentsCount = computed(() => this.context.payments().length)
  readonly originalSaleStatus = computed(() => this.originalSale()?.status)
  readonly failureMessages = this.saleService.selectFailureMessages

  readonly canMakeChangesToTheSale = computed(() =>
    !this.originalSale() || this.originalSaleStatus() === SaleStatus.DRAFT
  )

  readonly canAddPaymentsToSale = computed(() => {
    if (!this.originalSale() || this.originalSaleStatus() === SaleStatus.DRAFT) {
      return true
    }
    if ([SaleStatus.VOIDED, SaleStatus.DISCARDED].includes(this.originalSaleStatus()!)) {
      return false
    }
    return this.balanceDue() > 0
  })

  saveDraft() {
    const payload = this.context.getSavableFormValue()
    if (payload.id) {
      this.saleService.updateDraft(payload, {onSuccess: this.onSuccessfulSave})
    } else {
      this.saleService.createDraft(payload, {onSuccess: this.onSuccessfulSave})
    }
  }

  completeSale() {
    const payload = this.context.getSavableFormValue()
    if (payload.id) {
      this.saleService.convertDraftToSale(payload, {onSuccess: this.onSuccessfulSave})
    } else {
      this.saleService.createSale(payload, {onSuccess: this.onSuccessfulSave})
    }
  }

  private readonly onSuccessfulSave = (savedSale: Sale) => {
    this.context.initializeForm(savedSale)
  }
}
