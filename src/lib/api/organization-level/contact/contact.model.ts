import {BaseModel} from '../../util/base-api/base.model'
import {ContactStatus} from './contact-status.enum'
import {ContactType} from './contact-type.enum'
import {IdentityType} from './identity-type.enum'

export interface Contact extends BaseModel {
  createdBy?: string
  createdOn?: number
  contactType?: ContactType
  identityType?: IdentityType
  firstName?: string
  lastName?: string
  companyName?: string
  fullName?: string
  email?: string
  phone?: string
  address?: string
  creditLimit?: number
  notes?: string
  status?: ContactStatus
}
