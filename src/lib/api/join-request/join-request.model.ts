import {BaseModel} from '../base-api/base.model'

export interface JoinRequest extends BaseModel {
  requestedDate: number
  status: string
}
