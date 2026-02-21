import {ContactStatus} from './contact-status.enum'
import {ContactType} from './contact-type.enum'
import {IdentityType} from './identity-type.enum'
import {BaseModel} from '../../util/base-api/base.model'

export interface Contact extends BaseModel {
  createdBy?: string
  createdOn?: number
  contactType?: ContactType
  identityType?: IdentityType
  firstName?: string
  lastName?: string
  companyName?: string
  email?: string
  phone?: string
  address?: string
  creditLimit?: number
  notes?: string
  status?: ContactStatus
}
