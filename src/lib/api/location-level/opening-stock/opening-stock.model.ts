import {BaseModel} from '../../util/base-api/base.model'

export interface OpeningStockLine extends BaseModel {
  locationProductId: string
  quantity: number
  unitId?: string
  unitCost: number
  productLabel?: string
  declaredBy?: string
  declaredAt?: string
}
