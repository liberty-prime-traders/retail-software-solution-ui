import {BaseModel} from '../../util/base-api/base.model'

export interface ProductCore extends BaseModel {
  productName: string
  productGroupName: string
  baseUnitId: string
}
