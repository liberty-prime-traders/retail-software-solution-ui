import {BaseModel} from '../../util/base-api/base.model'
import {UserPermission} from '../../cross-tier/authorization/user-permission.enum'
import {UserRole} from '../../cross-tier/authorization/user-role.enum'

export interface StandalonePermission extends BaseModel {
  permission: UserPermission
  role: UserRole
}
