import {BaseModel} from '../../util/base-api/base.model'
import {SysUserStatus} from './sys-user-status.enum'

export interface SysUser extends BaseModel {
	status: SysUserStatus
	firstName: string
	lastName: string
	email: string
}
