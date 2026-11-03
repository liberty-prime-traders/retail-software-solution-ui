import {Component, computed, inject} from '@angular/core'
import {ButtonDirective} from 'primeng/button'
import {Purchase} from '../../../../api/location-level/purchase/purchase.model'
import {PurchaseService} from '../../../../api/location-level/purchase/purchase.service'
import {PurchaseFormContext} from '../purchase-form/form-utils/purchase-form-context'
import {PurchasesFilterState} from '../purchases-filter/purchases-filter.state'

@Component({
  selector: 'rts-purchase-form-actions',
  imports: [
    ButtonDirective
  ],
  templateUrl: 'purchase-fom-actions.component.html'
})
export class PurchaseFormActionsComponent {
  private readonly purchaseService = inject(PurchaseService)
  private readonly filterState = inject(PurchasesFilterState)
  readonly purchaseFormContext = inject(PurchaseFormContext)

  readonly purchaseForm = this.purchaseFormContext.purchaseForm
  readonly isEditingLines = this.purchaseFormContext.isEditingLines
  readonly isDraftOrNew = this.purchaseFormContext.isDraftOrNew

  readonly canPlaceOrder = computed(() =>
    this.purchaseFormContext.purchaseLinesArray().some((line) => line.quantityExpected > 0)
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
  private readonly onSuccessfulSave = (saved: Purchase)=> {
    this.purchaseFormContext.initializeForm(saved)
    this.filterState.refreshResults()
  }
}
