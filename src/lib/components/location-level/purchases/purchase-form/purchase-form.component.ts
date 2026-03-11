import {Component, computed, inject, input, Input, OnInit} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {Button} from 'primeng/button'
import {Tab, TabList, TabPanel, TabPanels, Tabs} from 'primeng/tabs'
import {Purchase} from '../../../../api/location-level/purchase/purchase.model'
import {PurchaseService} from '../../../../api/location-level/purchase/purchase.service'
import {AutoStretchDirective} from '../../../reusable/auto-stretch.directive'
import {LoadingContainerComponent} from '../../../reusable/loading-container/loading-container.component'
import {PurchaseFormContext} from './form-utils/purchase-form-context'
import {PurchaseFormGeneralFieldsComponent} from './general-fields/general-fields.component'
import {DeliveryGridComponent} from './purchase-deliveries/delivery-grid/delivery-grid.component'
import {PurchaseLinesComponent} from './purchase-lines/purchase-lines.component'

@Component({
  selector: 'rts-purchase-form',
  templateUrl: 'purchase-form.component.html',
  styleUrl: 'purchase-form.component.scss',
  providers: [PurchaseFormContext],
  imports: [
    FormsModule,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    PurchaseLinesComponent,
    DeliveryGridComponent,
    AutoStretchDirective,
    Button,
    LoadingContainerComponent,
    PurchaseFormGeneralFieldsComponent
  ]
})
export class PurchaseFormComponent implements OnInit {

  private readonly purchaseService = inject(PurchaseService)
  private readonly purchaseFormContext = inject(PurchaseFormContext)

  readonly purchaseIsLoading = this.purchaseService.selectLoading
  readonly purchaseForm = this.purchaseFormContext.purchaseForm
  readonly isDraftOrNew = this.purchaseFormContext.isDraftOrNew
  readonly isEditingLines = this.purchaseFormContext.isEditingLines
  readonly canPlaceOrder = computed(() =>
    this.purchaseFormContext.purchaseLinesArray().some((line) => line.quantityExpected > 0)
  )
  readonly isCreating = input(false)

  @Input()
  set purchase(purchase: Purchase | null) {
    this.purchaseFormContext.initializeForm(purchase)
  }

  ngOnInit() {
    this.purchaseService.fetch()
  }

  resetForm() {
    this.purchaseFormContext.resetForm()
  }

  saveDraft() {
    const payload = this.purchaseFormContext.getSavableFormValue()
    if (payload.id) {
      this.purchaseService.updateDraft(payload)
    } else {
      this.purchaseService.createDraft(payload)
    }
  }

  placeOrder() {
    const payload = this.purchaseFormContext.getSavableFormValue()
    if (payload.id) {
      this.purchaseService.convertDraftToOrder(payload)
    } else {
      this.purchaseService.createOrder(payload)
    }
  }
}
