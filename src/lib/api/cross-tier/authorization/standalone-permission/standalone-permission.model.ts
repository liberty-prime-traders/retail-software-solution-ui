import {BaseModel} from '../../../util/base-api/base.model'
import {UserPermission} from '../user-permission.enum'
import {UserRole} from '../user-role.enum'

export interface StandalonePermission extends BaseModel {
  permission: UserPermission
  role: UserRole
}
