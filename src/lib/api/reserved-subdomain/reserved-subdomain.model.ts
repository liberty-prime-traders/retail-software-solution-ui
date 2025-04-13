import {BaseModel} from '../base-api/base.model'
import {ReservedSubdomainStatus} from './reserved-subdomain-status.enum'

export interface ReservedSubdomain extends BaseModel{
    createdBy?: string
    createdOn?: number
    subdomain?: string
    status?: ReservedSubdomainStatus
}
