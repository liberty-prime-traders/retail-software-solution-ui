import {BaseModel} from '../../util/base-api/base.model'

export interface PlatformSysUser extends BaseModel {
  initials: string
	fullName: string
	email: string
}
