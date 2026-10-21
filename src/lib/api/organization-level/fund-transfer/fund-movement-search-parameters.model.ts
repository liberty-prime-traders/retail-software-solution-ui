import {FundMovementStatus} from './fund-movement-status.enum'
import {FundMovementType} from './fund-movement-type.enum'

export interface FundMovementSearchParameters {
  createdFrom?: string
  createdBefore?: string
  types?: FundMovementType[]
  accountCodes?: string[]
  movementDateFrom?: string
  movementDateBefore?: string
  statuses?: FundMovementStatus[]
  references?: string[]
}
