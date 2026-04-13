import {TaxRecoveryType} from '../../platform-level/tax-type/tax-recovery-type.enum'
import {BaseModel} from '../../util/base-api/base.model'
import {OrgTaxTypeStatus} from './org-tax-type-status.enum'

export interface OrgTaxType extends BaseModel {
  createdOn?: string
  jurisdictionTaxTypeId?: string
  platformTaxId?: string
  taxLabel?: string
  taxRecoveryType: TaxRecoveryType
  status?: OrgTaxTypeStatus
  payableAccountCode?: string
  recoverableAccountCode?: string
}
