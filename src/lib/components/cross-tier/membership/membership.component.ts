import {NgClass} from '@angular/common'
import {Component, computed, effect, inject, input, model, untracked} from '@angular/core'
import {MessageService} from 'primeng/api'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {Tag} from 'primeng/tag'
import {AuthorityService} from '../../../api/cross-tier/authorization/authority.service'
import {MembershipUserService} from '../../../api/cross-tier/authorization/membership-user.service'
import {MembershipUserSummary} from '../../../api/cross-tier/authorization/membership-user-summary.model'
import {UserAccessDetailService} from '../../../api/cross-tier/authorization/user-access-detail.service'
import {SchemaLevel} from '../../../api/platform-level/table-registry/schema-level.enum'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'
import {GridFilterComponent} from '../../reusable/grid-filter/grid-filter.component'
import {UserAccessDetailComponent} from '../user-access-detail/user-access-detail.component'

@Component({
  selector: 'rts-membership',
  templateUrl: 'membership.component.html',
  imports: [
    TableModule,
    NullSafePipe,
    GridFilterComponent,
    EmptyRowComponent,
    Button,
    Tag,
    NgClass,
    UserAccessDetailComponent
  ]
})
export class MembershipComponent {
  private readonly membershipUserService = inject(MembershipUserService)
  private readonly authorityService = inject(AuthorityService)
  private readonly userAccessDetailService = inject(UserAccessDetailService)
  private readonly messageService = inject(MessageService)

  readonly schemaLevel = input.required<SchemaLevel>()

  readonly title = computed(() =>
    this.schemaLevel() === SchemaLevel.LOCATION ? 'Location Users' : 'Organization Users'
  )

  readonly loading = this.membershipUserService.selectLoading
  readonly users = this.membershipUserService.selectAll
  readonly selectedUsers = model<MembershipUserSummary[]>([])

  private readonly fetchAuthoritiesAndUsers = effect(() => {
    const schemaLevel = this.schemaLevel()
    untracked(() => {
      this.membershipUserService.fetch()
      schemaLevel === SchemaLevel.LOCATION
        ? this.authorityService.getForLocation()
        : this.authorityService.getForOrganization()
    })
  })

  terminateSelectedUsers() {
    const userIdsToTerminate = this.selectedUsers()
      .filter(user => user.active)
      .map(user => user.userId)

    this.membershipUserService.terminateUsers(
      userIdsToTerminate,
      {
        onSuccess: () => this.onSuccessfulTermination(userIdsToTerminate),
        onFail: () => this.onFailedTermination()
      }
    )
  }

  private onSuccessfulTermination(terminatedUserIds: string[]) {
    terminatedUserIds.forEach(userId => this.userAccessDetailService.evict(userId))
    this.selectedUsers.set([])
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Successfully terminated selected user(s)'
    })
  }

  private onFailedTermination() {
    this.membershipUserService.selectFailureMessages().forEach((parsedError) => {
      this.messageService.add({severity: 'error', detail: parsedError})
    })
  }
}
