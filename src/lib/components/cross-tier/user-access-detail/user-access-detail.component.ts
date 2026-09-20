import {DatePipe} from '@angular/common'
import {Component, computed, effect, inject, input, untracked} from '@angular/core'
import {MessageService} from 'primeng/api'
import {Button} from 'primeng/button'
import {Divider} from 'primeng/divider'
import {Tab, TabList, TabPanel, TabPanels, Tabs} from 'primeng/tabs'
import {Tag} from 'primeng/tag'
import {AuthorizationModifierService} from '../../../api/cross-tier/authorization/authorizatiion-modifier.service'
import {UserAccessDetail} from '../../../api/cross-tier/authorization/authority.model'
import {UserAccessDetailService} from '../../../api/cross-tier/authorization/user-access-detail.service'
import {UserPermission} from '../../../api/cross-tier/authorization/user-permission.enum'
import {UserRole} from '../../../api/cross-tier/authorization/user-role.enum'
import {SchemaLevel} from '../../../api/platform-level/table-registry/schema-level.enum'
import {parseError} from '../../../utils/errors'
import {OrderByPipe} from '../../../utils/pipes/order-by.pipe'
import {PrettifyEnumPipe} from '../../../utils/pipes/prettify-enum.pipe'
import {LoadingContainerComponent} from '../../reusable/loading-container/loading-container.component'
import {RolePermissionsComponent} from '../role-permissions/role-permissions.component'

@Component({
  selector: 'rts-user-access-detail',
  templateUrl: 'user-access-detail.component.html',
  imports: [
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Tag,
    Button,
    DatePipe,
    OrderByPipe,
    PrettifyEnumPipe,
    RolePermissionsComponent,
    LoadingContainerComponent,
    Divider
  ]
})
export class UserAccessDetailComponent {
  private readonly userAccessDetailService = inject(UserAccessDetailService)
  private readonly authorizationModifierService = inject(AuthorizationModifierService)
  private readonly messageService = inject(MessageService)

  readonly userId = input.required<string>()
  readonly schemaLevel = input.required<SchemaLevel>()

  readonly loading = this.userAccessDetailService.selectLoading

  private readonly accessDetails = this.userAccessDetailService.selectForGroup(this.userId)

  readonly accessDetail = computed<UserAccessDetail | undefined>(() => this.accessDetails()[0])

  private readonly refetchAccessDetail = effect(() => {
    const userId = this.userId()
    untracked(() => this.userAccessDetailService.getForUser(userId))
  })

  revokeRole(role: UserRole) {
    this.authorizationModifierService.revokeAuthorities(
      {userIds: [this.userId()], roles: [role], permissions: []},
      this.schemaLevel(),
      {
        onSuccess: () => this.userAccessDetailService.forceRefetch(this.userId()),
        onFail: (error) => this.onRevokeFailed(error)
      }
    )
  }

  revokePermission(permission: UserPermission) {
    this.authorizationModifierService.revokeAuthorities(
      {userIds: [this.userId()], roles: [], permissions: [permission]},
      this.schemaLevel(),
      {
        onSuccess: () => this.userAccessDetailService.forceRefetch(this.userId()),
        onFail: (error) => this.onRevokeFailed(error)
      }
    )
  }

  private onRevokeFailed(error: unknown) {
    this.messageService.add({
      severity: 'error',
      summary: 'Failed to revoke',
      detail: parseError(error)[0] || 'An unknown error occurred'
    })
  }
}
