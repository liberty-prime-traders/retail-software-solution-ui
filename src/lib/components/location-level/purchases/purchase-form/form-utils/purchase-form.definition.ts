import {Purchase} from '../../../../../api/location-level/purchase/purchase.model'
import {PurchaseGeneralFieldsFormDefinition} from './purchase-general-fields-form.definition'
import {PurchaseLineFormDefinition} from './purchase-line-form.definition'

export namespace PurchaseFormDefinition {

  export interface PurchaseFormModel {
    generalFields: PurchaseGeneralFieldsFormDefinition.PurchaseGeneralFieldsModel
    purchaseLines: PurchaseLineFormDefinition.PurchaseLineModel[]
  }

  export const convertToFormModel = (purchase: Purchase | undefined): PurchaseFormModel => ({
    generalFields: PurchaseGeneralFieldsFormDefinition.convertToFormModel(purchase),
    purchaseLines: PurchaseLineFormDefinition.convertLinesToFormModel(purchase?.lines ?? [])
  })

  export const convertToBackendModel = (formValue: PurchaseFormModel): Partial<Purchase> => ({
    ...PurchaseGeneralFieldsFormDefinition.convertToBackendModel(formValue.generalFields),
    lines: PurchaseLineFormDefinition.convertLinesToBackendModel(formValue.purchaseLines)
  })
}
