import {Component, computed, inject} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {Divider} from 'primeng/divider'
import {Tab, TabList, TabPanel, TabPanels, Tabs} from 'primeng/tabs'
import {ExpenseSourceType} from '../../../../api/cross-tier/expense/expense-source-type.enum'
import {
  DeliveryLineRevisionService
} from '../../../../api/location-level/delivery-revision/delivery-line-revision.service'
import {PaymentStatus} from '../../../../api/location-level/purchase/payment-status.enum'
import {PurchaseService} from '../../../../api/location-level/purchase/purchase.service'
import {
  ContextualExpenseGridComponent
} from '../../../cross-tier/expenses/contextual-expense-grid/contextual-expense-grid.component'
import {AutoStretchDirective} from '../../../reusable/auto-stretch.directive'
import {LoadingContainerComponent} from '../../../reusable/loading-container/loading-container.component'
import {HidesSaleButtonComponent} from '../../hides-sale-button.component'
import {PaymentGridComponent} from '../../supplier-payments/payment-grid/payment-grid.component'
import {PurchaseFormContext} from './form-utils/purchase-form-context'
import {PurchaseFormGeneralFieldsComponent} from './general-fields/general-fields.component'
import {DeliveryGridComponent} from '../../purchase-deliveries/delivery-grid/delivery-grid.component'
import {PurchaseLinesComponent} from './purchase-lines/purchase-lines.component'

@Component({
  selector: 'rts-purchase-form',
  templateUrl: 'purchase-form.component.html',
  imports: [
    FormsModule,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    PurchaseLinesComponent,
    DeliveryGridComponent,
    PaymentGridComponent,
    ContextualExpenseGridComponent,
    AutoStretchDirective,
    LoadingContainerComponent,
    PurchaseFormGeneralFieldsComponent,
    Divider
  ]
})
export class PurchaseFormComponent extends HidesSaleButtonComponent {

  private readonly purchaseService = inject(PurchaseService)
  private readonly deliveryLineRevisionService = inject(DeliveryLineRevisionService)
  private readonly purchaseFormContext = inject(PurchaseFormContext)

  readonly ExpenseSourceType = ExpenseSourceType

  readonly isDraftOrNew = this.purchaseFormContext.isDraftOrNew
  readonly purchaseId = computed(() => String(this.purchaseFormContext.purchaseId() ?? ''))
  readonly purchaseReference = this.purchaseFormContext.purchaseReference
  readonly supplierId = this.purchaseFormContext.supplierId

  readonly isLoading = computed(() =>
    this.purchaseService.selectLoading() || this.deliveryLineRevisionService.selectLoading()
  )

  readonly canAddPayments = computed(() =>
    this.purchaseFormContext.purchaseForm.generalFields().value().paymentStatus !== PaymentStatus.FULLY_SETTLED
  )

  reloadFormFromStore() {
    const purchaseRecord = this.purchaseService.selectForId(this.purchaseId())
    if (purchaseRecord) {
      this.purchaseFormContext.initializeForm(purchaseRecord)
    }
  }

}
