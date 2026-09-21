import {UserPermission} from '../../cross-tier/authorization/user-permission.enum'
import {UserRole} from '../../cross-tier/authorization/user-role.enum'
import {BaseModel} from '../../util/base-api/base.model'
import {PlatformSysUser} from '../sys-user/platform-sys-user.model'

export enum IdentityProvider {
  GOOGLE = 'GOOGLE'
}

export interface LoginResponse extends BaseModel {
  sessionToken: string
  verifiedRoles: UserRole[]
  verifiedPermissions: UserPermission[]
  user: PlatformSysUser
}

export interface LoginRequest {
  provider: IdentityProvider,
  credential: string,
  rolesToVerify: UserRole[],
  permissionsToVerify: UserPermission[]
}
