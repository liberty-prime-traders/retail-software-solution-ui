import {required, schema} from '@angular/forms/signals'
import {ProductCategory} from '../../../../api/organization-level/product-category/product-category.model'

export namespace ProductCategoryFormDefinition {
  export interface ProductCategoryFormModel {
    id: string
    categoryName: string
    description: string
  }

  export const fieldMap = new Map<keyof ProductCategoryFormModel, string>(
    [
      ['categoryName', 'Product Category Name'],
      ['description', 'Description']
    ]
  )

  export const defaultProductCategoryFormModel: ProductCategoryFormModel = {
    id: '',
    categoryName: '',
    description: ''
  }

  export const productCategoryFormSchema = schema<ProductCategoryFormModel>(path => {
    required(path.categoryName)
  })

  export const convertToFormModel = (
    productCategory?: ProductCategory
  ): ProductCategoryFormModel => ({
    id: productCategory?.id as string ?? '',
    categoryName: productCategory?.categoryName ?? '',
    description: productCategory?.description ?? ''
  })

  export const convertToBackendModel = (
    formValue: ProductCategoryFormModel
  ): Partial<ProductCategory> => ({
    id: formValue.id || undefined,
    categoryName: formValue.categoryName,
    description: formValue.description
  })
}
