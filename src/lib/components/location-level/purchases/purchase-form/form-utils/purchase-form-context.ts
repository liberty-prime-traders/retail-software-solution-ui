import {computed, effect, Injectable, signal, untracked} from '@angular/core'
import {apply, form} from '@angular/forms/signals'
import {PurchaseStatus} from '../../../../../api/location-level/purchase/purchase-status.enum'
import {Purchase} from '../../../../../api/location-level/purchase/purchase.model'
import {PurchaseFormDefinition} from './purchase-form.definition'
import {PurchaseGeneralFieldsFormDefinition} from './purchase-general-fields-form.definition'
import PurchaseFormModel = PurchaseFormDefinition.PurchaseFormModel

@Injectable()
export class PurchaseFormContext {

  private readonly originalPurchase = signal<Purchase | undefined>(undefined)

  private readonly purchaseFormValue = signal<PurchaseFormModel>({
    generalFields: PurchaseGeneralFieldsFormDefinition.createDefaultPurchaseGeneralFieldsFormModel(),
    purchaseLines: []
  })

  readonly purchaseForm = form(this.purchaseFormValue, s => {
    apply(s.generalFields, PurchaseGeneralFieldsFormDefinition.purchaseGeneralFieldsFormSchema)
  })

  readonly purchaseLinesArray = computed(() => this.purchaseForm.purchaseLines().value())
  readonly status = computed(() => this.originalPurchase()?.status)
  readonly purchaseId = computed(() => this.originalPurchase()?.id)
  readonly deliveries = computed(() => this.originalPurchase()?.deliveries ?? [])

  readonly keysForLinesBeingEdited = signal<Record<string, boolean>>({})
  readonly isEditingLines = computed(() => Object.keys(this.keysForLinesBeingEdited()).length > 0)

  readonly isDraftOrNew = computed(() => {
    const status = this.status()
    return !status || status === PurchaseStatus.DRAFT
  })

  readonly isOrderedOrPartiallyDelivered = computed(() => {
    const status = this.status()
    return status === PurchaseStatus.ORDERED || status === PurchaseStatus.PARTIALLY_DELIVERED
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
      this.originalPurchase.set(purchase)
      this.purchaseFormValue.set(PurchaseFormDefinition.convertToFormModel(purchase))
    }
  }

  resetForm() {
    this.purchaseForm().reset(PurchaseFormDefinition.convertToFormModel(this.originalPurchase()))
  }

  getSavableFormValue(): Partial<Purchase> {
    return PurchaseFormDefinition.convertToBackendModel(this.purchaseFormValue())
  }

}
