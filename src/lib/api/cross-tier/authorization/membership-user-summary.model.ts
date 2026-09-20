import {BaseModel} from '../../util/base-api/base.model'

export interface MembershipUserSummary extends BaseModel {
  userId: string
  fullName?: string
  email?: string
  membershipCount: number
  active: boolean
}
