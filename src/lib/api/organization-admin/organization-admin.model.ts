import {BaseModel} from '../base-api/base.model'

export interface OrganizationAdmin extends BaseModel {
  organizationId?: string
  admin?: string
  startOn?: number
  endOn?: number
  name?: string
}
