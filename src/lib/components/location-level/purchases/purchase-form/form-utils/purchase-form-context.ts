import {computed, effect, Injectable, signal, untracked} from '@angular/core'
import {apply, form} from '@angular/forms/signals'
import {PurchaseStatus} from '../../../../../api/location-level/purchase/purchase-status.enum'
import {Purchase} from '../../../../../api/location-level/purchase/purchase.model'
import {PurchaseFormDefinition} from './purchase-form.definition'
import {PurchaseGeneralFieldsFormDefinition} from './purchase-general-fields-form.definition'

@Injectable()
export class PurchaseFormContext {

  private readonly originalPurchase = signal<Purchase | null>(null)
  readonly formIsVisible = signal(false)

  private readonly purchaseFormValue = signal(PurchaseFormDefinition.createDefaultPurchaseFormModel())

  readonly purchaseForm = form(this.purchaseFormValue, s => {
    apply(s.generalFields, PurchaseGeneralFieldsFormDefinition.purchaseGeneralFieldsFormSchema)
  })

  readonly purchaseLinesArray = computed(() => this.purchaseForm.purchaseLines().value())
  readonly purchaseStatus = computed(() => this.originalPurchase()?.purchaseStatus)
  readonly purchaseId = computed(() => this.originalPurchase()?.id)
  readonly deliveries = computed(() => this.originalPurchase()?.deliveries ?? [])

  readonly keysForLinesBeingEdited = signal<Record<string, boolean>>({})
  readonly isEditingLines = computed(() => Object.keys(this.keysForLinesBeingEdited()).length > 0)

  readonly isDraftOrNew = computed(() => {
    const purchaseStatus = this.purchaseStatus()
    return !purchaseStatus || purchaseStatus === PurchaseStatus.DRAFT
  })

  readonly isOrderedOrPartiallyDelivered = computed(() => {
    const purchaseStatus = this.purchaseStatus()
    return purchaseStatus === PurchaseStatus.ORDERED || purchaseStatus === PurchaseStatus.PARTIALLY_DELIVERED
  })

  private readonly totalEffect = effect(() => {
    const lines = this.purchaseForm.purchaseLines().value()

    untracked(() => {
      const total = lines.reduce((sum, l) => sum + l.lineTotal, 0)
      this.purchaseForm.generalFields.orderTotal().value.set(total)
    })
  })

  initializeForm(purchase: Purchase | null) {
    if (purchase) {
      this.formIsVisible.set(true)
      this.originalPurchase.set(purchase)
      this.purchaseForm().reset(PurchaseFormDefinition.convertToFormModel(purchase))
    }
  }

  startNewPurchase() {
    this.formIsVisible.set(true)
    this.originalPurchase.set(null)
    this.purchaseForm().reset(PurchaseFormDefinition.createDefaultPurchaseFormModel())
  }

  hideForm() {
    this.formIsVisible.set(false)
  }

  resetForm() {
    this.purchaseForm().reset(PurchaseFormDefinition.convertToFormModel(this.originalPurchase()))
  }

  getSavableFormValue(): Partial<Purchase> {
    return PurchaseFormDefinition.convertToBackendModel(this.purchaseFormValue())
  }

}
