import {ActivityStatus} from '../../../utils/types/activity-status.enum'
import {BaseModel} from '../../base-api/base.model'

export interface JoinRequest extends BaseModel {
  requestedDate: number
  status: ActivityStatus
}
