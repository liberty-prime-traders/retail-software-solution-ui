import {required, schema} from '@angular/forms/signals'
import {Product} from '../../../../api/organization-level/product/product.model'

export namespace ProductFormDefinition {
  export interface ProductFormModel {
    id: string
    productName: string
    description: string
    categoryId: string
    baseUnitId: string
    tagsToAdd: Set<string>
    tagsToRemove: Set<string>
  }

  export const fieldMap = new Map<keyof ProductFormModel, string>(
    [
      ['productName', 'Product Name'],
      ['description', 'Description'],
      ['categoryId', 'Category'],
      ['baseUnitId', 'Base Unit']
    ]
  )

  export const defaultProductFormModel: ProductFormModel = {
    id: '',
    productName: '',
    description: '',
    categoryId: '',
    baseUnitId: '',
    tagsToAdd: new Set<string>(),
    tagsToRemove: new Set<string>()
  }

  export const productFormSchema = schema<ProductFormModel>((path) => {
    required(path.productName)
    required(path.categoryId)
    required(path.baseUnitId)
  })

  export const convertToFormModel = (product?: Product): ProductFormModel => ({
    id: product?.id as string ?? '',
    productName: product?.productName ?? '',
    description: product?.description ?? '',
    categoryId: product?.categoryId ?? '',
    baseUnitId: product?.baseUnitId ?? '',
    tagsToAdd: new Set<string>(),
    tagsToRemove: new Set<string>()
  })

  export const convertToBackendModel = (formValue: ProductFormModel): Partial<Product> => ({
    id: formValue.id,
    productName: formValue.productName,
    description: formValue.description,
    categoryId: formValue.categoryId,
    baseUnitId: formValue.baseUnitId,
    tagsToAdd: Array.from(formValue.tagsToAdd),
    tagsToRemove: Array.from(formValue.tagsToRemove)
  })
}
