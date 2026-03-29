import {BaseModel} from '../../util/base-api/base.model'

export interface Jurisdiction extends BaseModel {
  name?: string
  createdOn?: string
  jurisdictionTypeId?: string
  jurisdictionType?: string
  parentJurisdictionId?: string
  parentJurisdiction?: string,
  taxTypesToAddOrReactivate?: string[]
  taxTypesToDiscontinue?: string[],
  taxTypes?: string[]
}
