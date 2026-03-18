import {BaseModel} from '../../util/base-api/base.model'

export interface OrgJurisdictionTaxType extends BaseModel {
  createdOn?: string
  jurisdictionTaxType?: string
  jurisdictionTaxTypeId?: string
  startDate?: string
  endDate?: string
}
