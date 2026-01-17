import {required, schema} from '@angular/forms/signals'
import {Product} from '../../../../api/organization-level/product/product.model'

export namespace ProductFormDefinition {
  export interface ProductFormModel {
    id: string
    productName: string
    description: string
    productGroupId: string
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
    baseUnitId: '',
    tagsToAdd: new Set<string>(),
    tagsToRemove: new Set<string>()
  }

  export const productFormSchema = schema<ProductFormModel>((path) => {
    required(path.productName)
    required(path.productGroupId)
    required(path.baseUnitId)
  })

  export const convertToFormModel = (product?: Product): ProductFormModel => ({
    id: product?.id as string ?? '',
    productName: product?.productName ?? '',
    description: product?.description ?? '',
    productGroupId: product?.productGroupId ?? '',
    baseUnitId: product?.baseUnitId ?? '',
    tagsToAdd: new Set<string>(),
    tagsToRemove: new Set<string>()
  })

  export const convertToBackendModel = (formValue: ProductFormModel): Partial<Product> => ({
    id: formValue.id,
    productName: formValue.productName,
    description: formValue.description,
    productGroupId: formValue.productGroupId,
    baseUnitId: formValue.baseUnitId,
    tagsToAdd: Array.from(formValue.tagsToAdd),
    tagsToRemove: Array.from(formValue.tagsToRemove)
  })
}
