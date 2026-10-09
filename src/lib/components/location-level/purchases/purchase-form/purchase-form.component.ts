import {Component, computed, inject} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {ButtonDirective} from 'primeng/button'
import {Divider} from 'primeng/divider'
import {Tab, TabList, TabPanel, TabPanels, Tabs} from 'primeng/tabs'
import {ExpenseSourceType} from '../../../../api/cross-tier/expense/expense-source-type.enum'
import {PaymentStatus} from '../../../../api/location-level/purchase/payment-status.enum'
import {Purchase} from '../../../../api/location-level/purchase/purchase.model'
import {PurchaseService} from '../../../../api/location-level/purchase/purchase.service'
import {AutoStretchDirective} from '../../../reusable/auto-stretch.directive'
import {LoadingContainerComponent} from '../../../reusable/loading-container/loading-container.component'
import {ContextualExpenseGridComponent} from '../../../cross-tier/expenses/contextual-expense-grid/contextual-expense-grid.component'
import {HidesSaleButtonComponent} from '../../hides-sale-button.component'
import {PaymentGridComponent} from '../../supplier-payments/payment-grid/payment-grid.component'
import {PurchasesFilterState} from '../purchases-filter/purchases-filter.state'
import {PurchaseFormContext} from './form-utils/purchase-form-context'
import {PurchaseFormGeneralFieldsComponent} from './general-fields/general-fields.component'
import {DeliveryGridComponent} from './purchase-deliveries/delivery-grid/delivery-grid.component'
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
    ButtonDirective,
    LoadingContainerComponent,
    PurchaseFormGeneralFieldsComponent,
    Divider
  ]
})
export class PurchaseFormComponent extends HidesSaleButtonComponent {

  private readonly purchaseService = inject(PurchaseService)
  private readonly purchaseFormContext = inject(PurchaseFormContext)
  private readonly filterState = inject(PurchasesFilterState)

  readonly ExpenseSourceType = ExpenseSourceType

  readonly purchaseIsLoading = this.purchaseService.selectLoading
  readonly purchaseForm = this.purchaseFormContext.purchaseForm
  readonly isDraftOrNew = this.purchaseFormContext.isDraftOrNew
  readonly isEditingLines = this.purchaseFormContext.isEditingLines
  readonly purchaseId = computed(() => String(this.purchaseFormContext.purchaseId() ?? ''))
  readonly purchaseReference = this.purchaseFormContext.purchaseReference
  readonly supplierId = this.purchaseFormContext.supplierId
  readonly canPlaceOrder = computed(() =>
    this.purchaseFormContext.purchaseLinesArray().some((line) => line.quantityExpected > 0)
  )

  readonly canAddPayments = computed(() =>
    this.purchaseFormContext.purchaseForm.generalFields().value().paymentStatus !== PaymentStatus.FULLY_SETTLED
  )

  resetForm() {
    this.purchaseFormContext.resetForm()
  }

  saveDraft() {
    const payload = this.purchaseFormContext.getSavableFormValue()
    if (payload.id) {
      this.purchaseService.updateDraft(payload, {onSuccess: this.onSuccessfulSave})
    } else {
      this.purchaseService.createDraft(payload, {onSuccess: this.onSuccessfulSave})
    }
  }

  placeOrder() {
    const payload = this.purchaseFormContext.getSavableFormValue()
    if (payload.id) {
      this.purchaseService.convertDraftToOrder(payload, {onSuccess: this.onSuccessfulSave})
    } else {
      this.purchaseService.createOrder(payload, {onSuccess: this.onSuccessfulSave})
    }
  }

  reloadFormFromStore() {
    const purchaseRecord = this.purchaseService.selectForId(this.purchaseId())
    if (purchaseRecord) {
      this.purchaseFormContext.initializeForm(purchaseRecord)
    }
  }

  private readonly onSuccessfulSave = (saved: Purchase)=> {
    this.purchaseFormContext.initializeForm(saved)
    this.filterState.refreshResults()
  }
}
