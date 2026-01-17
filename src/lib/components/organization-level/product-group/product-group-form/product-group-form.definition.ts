import {required, schema} from '@angular/forms/signals'
import {ProductGroup} from '../../../../api/organization-level/product-group/product-group.model'

export namespace ProductGroupFormDefinition {
  export interface ProductGroupFormModel {
    id: string
    groupName: string
    description: string
    categoryId: string
  }

  export const fieldMap = new Map<keyof ProductGroupFormModel, string>(
    [
      ['groupName', 'Group Name'],
      ['description', 'Description'],
      ['categoryId', 'Category']
    ]
  )

  export const defaultProductGroupFormModel: ProductGroupFormModel = {
    id: '',
    groupName: '',
    description: '',
    categoryId: ''
  }

  export const productGroupFormSchema = schema<ProductGroupFormModel>((path) => {
    required(path.groupName)
    required(path.categoryId)
  })

  export const convertToFormModel = (productGroup?: ProductGroup): ProductGroupFormModel => ({
    id: productGroup?.id as string ?? '',
    groupName: productGroup?.groupName ?? '',
    description: productGroup?.description ?? '',
    categoryId: productGroup?.categoryId ?? ''
  })

  export const convertToBackendModel = (formValue: ProductGroupFormModel): Partial<ProductGroup> => ({
    id: formValue.id,
    groupName: formValue.groupName,
    description: formValue.description,
    categoryId: formValue.categoryId
  })
}
