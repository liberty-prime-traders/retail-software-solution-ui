import {required, schema} from '@angular/forms/signals'
import {LocationProduct} from '../../../../api/location-level/location-product/location-product.model'

export namespace LocationProductFormDefinition {
  export interface LocationProductFormModel {
    id: string
    minStockLevel: number
    defaultSalePrice: number
  }

  export const fieldMap = new Map<keyof LocationProductFormModel, string>(
    [
      ['minStockLevel', 'Minimum Stock Level'],
      ['defaultSalePrice', 'Default Sale Price']
    ]
  )

  export const defaultLocationProductFormModel: LocationProductFormModel = {
    id: '',
    minStockLevel: 0,
    defaultSalePrice: 0
  }

  export const locationProductFormSchema = schema<LocationProductFormModel>((path) => {
    required(path.minStockLevel)
    required(path.defaultSalePrice)
  })

  export const convertToFormModel = (locationProduct?: LocationProduct): LocationProductFormModel => ({
    id: locationProduct?.id as string ?? '',
    minStockLevel: locationProduct?.minStockLevel ?? 0,
    defaultSalePrice: locationProduct?.defaultSalePrice ?? 0
  })

  export const convertToBackendModel = (formValue: LocationProductFormModel): Partial<LocationProduct> => ({
    id: formValue.id,
    minStockLevel: formValue.minStockLevel,
    defaultSalePrice: formValue.defaultSalePrice
  })
}
