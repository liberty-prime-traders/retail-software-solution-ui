import {DatePipe} from '@angular/common'
import {Component, computed, effect, inject, input, output, untracked} from '@angular/core'
import {ButtonDirective} from 'primeng/button'
import {Chip} from 'primeng/chip'
import {Divider} from 'primeng/divider'
import {Tag} from 'primeng/tag'
import {GrantedRole} from '../../../api/cross-tier/authorization/authority.model'
import {UserRole} from '../../../api/cross-tier/authorization/user-role.enum'
import {StandalonePermissionService} from '../../../api/cross-tier/authorization/standalone-permission/standalone-permission.service'
import {PrettifyEnumPipe} from '../../../utils/pipes/prettify-enum.pipe'
import {LoadingContainerComponent} from '../../reusable/loading-container/loading-container.component'

@Component({
  selector: 'rts-role-permissions',
  templateUrl: 'role-permissions.component.html',
  imports: [
    Chip,
    Tag,
    PrettifyEnumPipe,
    Divider,
    ButtonDirective,
    LoadingContainerComponent,
    DatePipe
  ]
})
export class RolePermissionsComponent {
  private readonly standalonePermissionService = inject(StandalonePermissionService)

  readonly grantedRole = input.required<GrantedRole>()
  readonly revoke = output<UserRole>()

  readonly role = computed(() => this.grantedRole().role)
  readonly permissions = this.standalonePermissionService.selectForGroup(this.role)
  readonly permissionsLoading = this.standalonePermissionService.selectLoading

  private readonly refetchPermissions = effect(() => {
    const role = this.role()
    untracked(() => this.standalonePermissionService.getForRole(role))
  })

  removePermission() {
    this.revoke.emit(this.role())
  }
}
