import {JsonObject} from '@angular-devkit/core/src/json/utils'

export interface CategoryBulkUploadDto extends JsonObject {
  name: string
}

export interface ProductGroupBulkUploadDto extends JsonObject {
  name: string
  categoryName: string
}

export interface ProductBulkUploadDto extends JsonObject {
  name: string
  description: string | null
  groupName: string
  unitCode: string
}

export interface ProductBulkUploadRequest extends JsonObject {
  categories: CategoryBulkUploadDto[]
  productGroups: ProductGroupBulkUploadDto[]
  products: ProductBulkUploadDto[]
}
