import {BaseModel} from '../../util/base-api/base.model'
import {CalculationMethod} from './calculation-method.enum'


export interface TaxType extends BaseModel {
  name?: string
  description?: string
  calculationMethod?: CalculationMethod
  createdOn?: string
}
