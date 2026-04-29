import {Purchase} from '../../../../../api/location-level/purchase/purchase.model'
import {PurchaseGeneralFieldsFormDefinition} from './purchase-general-fields-form.definition'
import {PurchaseLineFormDefinition} from './purchase-line-form.definition'

export namespace PurchaseFormDefinition {

  export interface PurchaseFormModel {
    generalFields: PurchaseGeneralFieldsFormDefinition.PurchaseGeneralFieldsModel
    purchaseLines: PurchaseLineFormDefinition.PurchaseLineModel[]
  }

  export const createDefaultPurchaseFormModel = (): PurchaseFormModel => ({
    generalFields: PurchaseGeneralFieldsFormDefinition.createDefaultPurchaseGeneralFieldsFormModel(),
    purchaseLines: []
  })

  export const convertToFormModel = (purchase: Purchase | null): PurchaseFormModel => ({
    generalFields: PurchaseGeneralFieldsFormDefinition.convertToFormModel(purchase),
    purchaseLines: PurchaseLineFormDefinition.convertLinesToFormModel(purchase?.lines ?? [])
  })

  export const convertToBackendModel = (formValue: PurchaseFormModel): Partial<Purchase> => {
    const purchaseLines = Array.from(formValue.purchaseLines.values())
    const linesToAdd = purchaseLines.filter(l => !l.id)
    const linesToUpdate = purchaseLines.filter(l => l.id)
    return  {
      ...PurchaseGeneralFieldsFormDefinition.convertToBackendModel(formValue.generalFields),
      linesToAdd: PurchaseLineFormDefinition.convertLinesToBackendModel(linesToAdd),
      linesToUpdate: PurchaseLineFormDefinition.convertLinesToBackendModel(linesToUpdate)
    }
  }
}
