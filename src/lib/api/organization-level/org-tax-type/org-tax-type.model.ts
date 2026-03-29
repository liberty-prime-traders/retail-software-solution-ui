import {BaseModel} from '../../util/base-api/base.model'
import {OrgTaxTypeStatus} from './org-tax-type-status.enum'

export interface OrgTaxType extends BaseModel {
  createdOn?: string
  jurisdictionTaxTypeId?: string
  platformTaxId?: string
  taxLabel?: string
  status?: OrgTaxTypeStatus
}
