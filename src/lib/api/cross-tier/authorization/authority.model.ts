import {EntityId} from '@ngrx/signals/entities'
import {SchemaLevel} from '../../platform-level/table-registry/schema-level.enum'
import {BaseModel} from '../../util/base-api/base.model'
import {UserPermission} from './user-permission.enum'
import {UserRole} from './user-role.enum'

export enum AuthorityType {
  ROLE = 'ROLE',
  PERMISSION = 'PERMISSION',
}

export interface Authority extends BaseModel {
  name: string
  tier: SchemaLevel,
  type: AuthorityType,
  holderCount?: number
}

export interface MembershipPeriod {
  id: string
  since: string
  until?: string
}

export interface GrantedRole {
  role: UserRole
  grantedAt: string
}

export interface GrantedPermission {
  permission: UserPermission
  grantedAt: string
}

export interface UserAccessDetail extends BaseModel {
  userId: string
  memberships: MembershipPeriod[]
  roles: GrantedRole[]
  addOnPermissions: GrantedPermission[]
}

export interface AuthorityAssignmentRequest {
  users: EntityId[]
  roles: UserRole[]
  permissions: UserPermission[]
}

