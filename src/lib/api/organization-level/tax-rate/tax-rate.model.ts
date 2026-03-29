import {BaseModel} from '../../util/base-api/base.model'

export interface TaxRate extends BaseModel {
  orgJurisdictionTaxTypeId?: string
  taxLabel?: string
  name?: string
  ratePercentage?: number
  rateFlatAmount?: number
  startDate?: string
  endDate?: string
  parentIsActive?: boolean
}
