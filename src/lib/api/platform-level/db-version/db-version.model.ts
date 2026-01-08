import {BaseModel} from '../../util/base-api/base.model'

export interface DbVersion extends Omit<BaseModel, 'referenceNumber'> {
  versionNumber?: string
  sequenceNumber?: number
  prevVersion?: string
  activatedOn?: string
}
