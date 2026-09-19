import {BaseModel} from '../../util/base-api/base.model'

export interface AuthorityHolder extends BaseModel {
  fullName?: string
  grantedOn: string
  authorityName: string
}
