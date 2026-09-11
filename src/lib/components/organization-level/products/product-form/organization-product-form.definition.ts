import {disabled, required, schema} from '@angular/forms/signals'
import {OrganizationProduct} from '../../../../api/organization-level/product/organization-product.model'

export namespace OrganizationProductFormDefinition {
  export interface ProductFormModel {
    id: string
    productName: string
    description: string
    productGroupId: string
    baseUnitGroupId: string
    baseUnitId: string
    tagsToAdd: Set<string>
    tagsToRemove: Set<string>
  }

  export const fieldMap = new Map<keyof ProductFormModel, string>(
    [
      ['productName', 'Product Name'],
      ['description', 'Description'],
      ['productGroupId', 'Product Group'],
      ['baseUnitId', 'Base Unit']
    ]
  )

  export const defaultProductFormModel: ProductFormModel = {
    id: '',
    productName: '',
    description: '',
    productGroupId: '',
    baseUnitGroupId: '',
    baseUnitId: '',
    tagsToAdd: new Set<string>(),
    tagsToRemove: new Set<string>()
  }

  export const productFormSchema = schema<ProductFormModel>((path) => {
    required(path.productName)
    required(path.productGroupId)
    required(path.baseUnitId, {when: ({valueOf}) => !valueOf(path.id)})
    disabled(path.baseUnitId, ({valueOf}) => !valueOf(path.baseUnitGroupId))
  })

  export const convertToFormModel = (product?: OrganizationProduct): ProductFormModel => ({
    id: product?.id as string ?? '',
    productName: product?.productName ?? '',
    description: product?.description ?? '',
    productGroupId: product?.productGroupId ?? '',
    baseUnitGroupId: '',
    baseUnitId: product?.baseUnitId ?? '',
    tagsToAdd: new Set<string>(),
    tagsToRemove: new Set<string>()
  })

  export const convertToBackendModel = (formValue: ProductFormModel): Partial<OrganizationProduct> => ({
    id: formValue.id,
    productName: formValue.productName,
    description: formValue.description,
    productGroupId: formValue.productGroupId,
    baseUnitId: formValue.baseUnitId,
    tagsToAdd: Array.from(formValue.tagsToAdd),
    tagsToRemove: Array.from(formValue.tagsToRemove)
  })
}
