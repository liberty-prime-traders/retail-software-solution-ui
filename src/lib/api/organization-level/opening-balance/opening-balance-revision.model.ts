import {BaseModel} from '../../util/base-api/base.model'

export interface OpeningBalanceRevision extends BaseModel {
  accountCode: string
  amount: number
  changedBy: string
  changedAt: string
}
