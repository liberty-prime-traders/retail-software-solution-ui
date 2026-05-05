import {BaseModel} from '../../util/base-api/base.model'
import {CalculationMethod} from './calculation-method.enum'
import {TaxApplicationLevel} from './tax-application-level.enum'
import {TaxRecoveryType} from './tax-recovery-type.enum'
import {TaxTrigger} from './tax-trigger.enum'


export interface TaxType extends BaseModel {
  name?: string
  description?: string
  calculationMethod: CalculationMethod
  taxRecoveryType: TaxRecoveryType
  taxApplicationLevel: TaxApplicationLevel
  taxTriggers: TaxTrigger[]
  createdOn?: string
}
