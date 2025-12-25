import {BaseModel} from '../../util/base-api/base.model'

export interface DbVersion extends BaseModel {
  versionNumber?: string
  sequenceNumber?: number
  prevVersion?: string
  activatedOn?: string
}
