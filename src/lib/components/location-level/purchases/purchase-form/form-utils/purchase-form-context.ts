import {computed, Injectable, signal} from '@angular/core'
import {apply, applyEach, form} from '@angular/forms/signals'
import {EntityId} from '@ngrx/signals/entities'
import {PurchaseStatus} from '../../../../../api/location-level/purchase/purchase-status.enum'
import {Purchase} from '../../../../../api/location-level/purchase/purchase.model'
import {PurchaseFormDefinition} from './purchase-form.definition'
import {PurchaseGeneralFieldsFormDefinition} from './purchase-general-fields-form.definition'
import {PurchaseLineFormDefinition} from './purchase-line-form.definition'
import PurchaseFormModel = PurchaseFormDefinition.PurchaseFormModel
import PurchaseLineModel = PurchaseLineFormDefinition.PurchaseLineModel

@Injectable()
export class PurchaseFormContext {

  private readonly originalPurchase = signal<Purchase | undefined>(undefined)

  private readonly purchaseFormValue = signal<PurchaseFormModel>({
    generalFields: PurchaseGeneralFieldsFormDefinition.createDefaultPurchaseGeneralFieldsFormModel(),
    purchaseLines: []
  })

  readonly purchaseLines = signal<Map<EntityId, PurchaseLineModel>>(new Map())

  readonly purchaseForm = form(this.purchaseFormValue, s => {
    apply(s.generalFields, PurchaseGeneralFieldsFormDefinition.purchaseGeneralFieldsFormSchema)
    applyEach(s.purchaseLines, PurchaseLineFormDefinition.purchaseLinesSchema)
  })

  readonly isReadOnly = computed(() => {
    const status = this.originalPurchase()?.status
    return status === PurchaseStatus.FULLY_DELIVERED || status === PurchaseStatus.CANCELED
  })

  initializeForm(purchase: Purchase | null) {
    if (purchase) {
      this.originalPurchase.set(purchase)
      this.purchaseFormValue.set(PurchaseFormDefinition.convertToFormModel(purchase))
      this.initializePurchaseLines(this.purchaseFormValue().purchaseLines)
    }
  }

  private initializePurchaseLines(purchaseLines: PurchaseLineModel[]) {
    const linesMap = new Map<EntityId, PurchaseLineModel>()
    purchaseLines.forEach(line => linesMap.set(line.locationProductId, line))
    this.purchaseLines.set(linesMap)
  }

  resetForm() {
    this.purchaseFormValue.set(PurchaseFormDefinition.convertToFormModel(this.originalPurchase()))
  }

  getSavableFormValue(): Partial<Purchase> {
    return PurchaseFormDefinition.convertToBackendModel(this.purchaseFormValue())
  }

  patchFormValue(lines: PurchaseLineModel[], orderTotal: number) {
    const currentValue = this.purchaseFormValue()
    const patchedValue: PurchaseFormModel = {
      ...currentValue,
      purchaseLines: lines,
      generalFields: {
        ...currentValue.generalFields,
        orderTotal
      }
    }
    this.purchaseFormValue.set(patchedValue)
  }
}
