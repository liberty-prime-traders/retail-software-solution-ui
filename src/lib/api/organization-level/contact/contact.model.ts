import {ContactStatus} from '../../../utils/types/contact-status.enum'
import {ContactType} from '../../../utils/types/contact-type.enum'
import {IdentityType} from '../../../utils/types/identity-type.enum'
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
