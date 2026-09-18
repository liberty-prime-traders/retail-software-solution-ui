import {UserRole} from '../../../utils/types/user-role.enum'
import {BaseModel} from '../../util/base-api/base.model'
import {SysUser} from '../sys-user/sys-user.model'

export enum IdentityProvider {
  GOOGLE = 'GOOGLE'
}

export interface LoginResponse extends BaseModel {
  sessionToken: string
  verifiedRoles: UserRole[]
  user: SysUser
}

export interface LoginRequest {
  provider: IdentityProvider,
  credential: string,
  rolesToVerify: UserRole[]
}
