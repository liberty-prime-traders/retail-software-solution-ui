import { BaseModel } from '../base-api/base.model'

export interface PaymentOption extends BaseModel{
    createdBy?: string
    createdOn?: number
    usageCount?: number
    name?: string
    description?: string
}
