import {NgTemplateOutlet} from '@angular/common'
import {Component, computed, inject, input, output, signal} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {MessageService} from 'primeng/api'
import {ButtonDirective} from 'primeng/button'
import {Card} from 'primeng/card'
import {Chip} from 'primeng/chip'
import {DataView} from 'primeng/dataview'
import {Divider} from 'primeng/divider'
import {IconField} from 'primeng/iconfield'
import {InputIcon} from 'primeng/inputicon'
import {InputText} from 'primeng/inputtext'
import {AuthorityAssignmentRequest, AuthorityType} from '../../../api/cross-tier/authorization/authority.model'
import {AuthorityService} from '../../../api/cross-tier/authorization/authority.service'
import {AuthorizationModifierService} from '../../../api/cross-tier/authorization/authorizatiion-modifier.service'
import {UserPermission} from '../../../api/cross-tier/authorization/user-permission.enum'
import {UserRole} from '../../../api/cross-tier/authorization/user-role.enum'
import {LocationMembershipUserService} from '../../../api/location-level/membership/location-membership-user.service'
import {OrgMembershipUserService} from '../../../api/organization-level/membership/org-membership-user.service'
import {PlatformSysUserService} from '../../../api/platform-level/sys-user/platform-sys-user.service'
import {SchemaLevel} from '../../../api/platform-level/table-registry/schema-level.enum'
import {parseError} from '../../../utils/errors'
import {PrettifyEnumPipe} from '../../../utils/pipes/prettify-enum.pipe'
import {LoadingContainerComponent} from '../../reusable/loading-container/loading-container.component'

interface AssignableUser {
  id: EntityId
  displayName: string
}

@Component({
  selector: 'rts-authority-assignment',
  templateUrl: 'authority-assignment.component.html',
  imports: [
    ButtonDirective,
    Chip,
    Card,
    DataView,
    Divider,
    IconField,
    InputIcon,
    InputText,
    NgTemplateOutlet,
    PrettifyEnumPipe,
    LoadingContainerComponent
  ]
})
export class AuthorityAssignmentComponent {
  private readonly platformUserService = inject(PlatformSysUserService)
  private readonly organizationUserService = inject(OrgMembershipUserService)
  private readonly locationUserService = inject(LocationMembershipUserService)
  private readonly authorizationModifierService = inject(AuthorizationModifierService)
  private readonly messageService = inject(MessageService)
  private readonly authorityService = inject(AuthorityService)

  readonly schemaLevel = input.required<SchemaLevel>()
  readonly assign = output<AuthorityAssignmentRequest>()
  readonly cancel = output<void>()

  readonly userLabel = (user: AssignableUser) => user.displayName
  readonly trackByFn = <T>(item: T) => (item as any).id ?? item
  readonly authorityLabel = <T extends UserRole | UserPermission>(item: T) =>
    PrettifyEnumPipe.prototype.transform(item)

  readonly searchTerm = signal('')
  readonly selectedUsers = signal<AssignableUser[]>([])
  readonly selectedRoles = signal<UserRole[]>([])
  readonly selectedPermissions = signal<UserPermission[]>([])
  readonly authorities = this.authorityService.selectForGroup(this.schemaLevel)

  readonly roles = computed(() =>
    this.authorities().filter(auth => auth.type === AuthorityType.ROLE)
      .map(auth => auth.name as UserRole)
  )

  readonly permissions = computed(() =>
    this.authorities().filter(auth => auth.type === AuthorityType.PERMISSION)
      .map(auth => auth.name as UserPermission)
  )

  readonly enableSubmitButton = computed(() =>
    this.selectedUsers().length > 0
    && (this.selectedRoles().length > 0 || this.selectedPermissions().length > 0)
  )

  private readonly usersForSchemaLevel = computed<AssignableUser[]>(() => {
    switch (this.schemaLevel()) {
      case SchemaLevel.ORGANIZATION:
        return this.organizationUserService.selectAll().map(user => ({
          id: user.userId,
          displayName: user.fullName ?? ''
        }))
      case SchemaLevel.LOCATION:
        return this.locationUserService.selectAll().map(user => ({
          id: user.userId,
          displayName: user.fullName ?? ''
        }))
      default:
        return this.platformUserService.selectAll().map(user => ({
          id: user.id,
          displayName: user.fullName ?? ''
        }))
    }
  })

  readonly usersLoading = computed(() => {
    switch (this.schemaLevel()) {
      case SchemaLevel.ORGANIZATION:
        return this.organizationUserService.selectLoading()
      case SchemaLevel.LOCATION:
        return this.locationUserService.selectLoading()
      default:
        return this.platformUserService.selectLoading()
    }
  })

  readonly authoritiesLoading = this.authorityService.selectLoading

  readonly availableUsers = computed(() => {
    const search = this.searchTerm().trim().toLowerCase()
    const selectedIds = new Set(this.selectedUsers().map(user => user.id))
    return this.usersForSchemaLevel()
      .filter(user => !selectedIds.has(user.id)
        && (!search || user.displayName.toLowerCase().includes(search))
      )
  })

  readonly availableRoles = computed(() => {
    const selected = new Set(this.selectedRoles())
    return this.roles().filter(role => !selected.has(role))
  })

  readonly availablePermissions = computed(() => {
    const selected = new Set(this.selectedPermissions())
    return this.permissions().filter(permission => !selected.has(permission))
  })

  readonly assignButtonLabel = computed(() => {
    const count = this.selectedUsers().length
    return `Assign to ${count} user${count === 1 ? '' : 's'}`
  })

  readonly addUser = (user: AssignableUser) => {
    this.selectedUsers.update(users => [...users, user])
  }

  removeUser(user: AssignableUser) {
    this.selectedUsers.update(users => users.filter(u => u.id !== user.id))
  }

  readonly addRole = (role: UserRole) => {
    this.selectedRoles.update(roles => [...roles, role])
  }

  removeRole(role: UserRole) {
    this.selectedRoles.update(roles => roles.filter(r => r !== role))
  }

  readonly addPermission = (permission: UserPermission) => {
    this.selectedPermissions.update(permissions => [...permissions, permission])
  }

  removePermission(permission: UserPermission) {
    this.selectedPermissions.update(permissions => permissions.filter(p => p !== permission))
  }

  submit() {
    const request = this.getAssignmentPayload()

    this.authorizationModifierService.assignAuthorities(request, this.schemaLevel(), {
      onSuccess: () => this.onAssignSuccess(request),
      onFail: (error) => this.onAssignFailed(error)
    })
  }

  private getAssignmentPayload(): AuthorityAssignmentRequest {
    return {
      userIds: this.selectedUsers().map(user => user.id),
      roles: this.selectedRoles(),
      permissions: this.selectedPermissions()
    }
  }

  private onAssignSuccess(request: AuthorityAssignmentRequest) {
    this.messageService.add({
      severity: 'success', summary: 'Success', detail: 'Authorities assigned successfully'
    })

    this.selectedUsers.set([])
    this.selectedRoles.set([])
    this.selectedPermissions.set([])
    this.searchTerm.set('')

    this.assign.emit(request)
  }

  private onAssignFailed(error: unknown) {
    this.messageService.add({
      severity: 'error',
      summary: 'Failed to assign authorities',
      detail: parseError(error)[0] || 'An unknown error occurred'
    })
  }
}
