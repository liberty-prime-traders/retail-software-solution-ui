import {BaseModel} from '../base-api/base.model'
import {JoinRequestStatus} from './join-request-status.enum'

export interface JoinRequest extends BaseModel {
  requestedDate: number
  status: JoinRequestStatus
}
