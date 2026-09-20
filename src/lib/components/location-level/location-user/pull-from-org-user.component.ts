import {Component, computed, inject, model, output} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {EntityId} from '@ngrx/signals/entities'
import {MessageService} from 'primeng/api'
import {Button} from 'primeng/button'
import {MultiSelect} from 'primeng/multiselect'
import {LocationMembershipUserService} from '../../../api/location-level/membership/location-membership-user.service'
import {OrgMembershipUserService} from '../../../api/organization-level/membership/org-membership-user.service'
import {parseError} from '../../../utils/errors'

@Component({
  selector: 'rts-pull-from-org-user',
  templateUrl: 'pull-from-org-user.component.html',
  imports: [
    FormsModule,
    MultiSelect,
    Button
  ]
})
export class PullFromOrgUserComponent {
  private readonly orgMembershipUserService = inject(OrgMembershipUserService)
  private readonly locationMembershipUserService = inject(LocationMembershipUserService)
  private readonly messageService = inject(MessageService)

  readonly cancel = output<void>()
  readonly pulled = output<void>()

  readonly pulling = this.locationMembershipUserService.selectLoading
  readonly selectedUserIds = model<EntityId[]>([])

  readonly availableOrgUsers = computed(() => {
    const locationUserIds = new Set(this.locationMembershipUserService.selectAll().map(user => user.userId))
    return this.orgMembershipUserService.selectAll().filter(orgUser => !locationUserIds.has(orgUser.userId))
  })

  readonly orgUsersLoading = this.orgMembershipUserService.selectLoading

  constructor() {
    this.orgMembershipUserService.fetch()
  }

  pullSelectedUsers() {
    this.locationMembershipUserService.pullUsersFromOrg(this.selectedUserIds(), {
      onSuccess: () => this.onPullSuccess(),
      onFail: (error) => this.onPullFailed(error)
    })
  }

  private onPullSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Successfully pulled selected user(s) from organization'
    })
    this.selectedUserIds.set([])
    this.pulled.emit()
  }

  private onPullFailed(error: unknown) {
    this.messageService.add({
      severity: 'error',
      summary: 'Failed to pull user(s)',
      detail: parseError(error)[0] || 'An unknown error occurred'
    })
  }
}
