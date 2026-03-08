import {BaseModel} from '../../util/base-api/base.model'
import {PassStatus} from './pass-status.enum'
import {PassType} from './pass-type.enum'

export interface AuthorizationPass extends BaseModel {
  passType: PassType
  maxUseCount: number
  usedCount: number
  assignedTo?: string
  assignedToId?: string
  passStatus: PassStatus
  expiresOn?: string
  createdBy?: string
  createdOn?: string
}
