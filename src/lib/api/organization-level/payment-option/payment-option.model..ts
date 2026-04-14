import {BaseModel} from '../../util/base-api/base.model'

export interface PaymentOption extends BaseModel{
  createdBy?: string
  createdOn?: number
  name: string
  description?: string
  accountCode?: string
  linkedAccount?: string
}
