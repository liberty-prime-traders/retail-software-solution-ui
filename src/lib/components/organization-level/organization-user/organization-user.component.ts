import {NgClass} from '@angular/common'
import {TimezoneAwareDatePipe} from '../../../utils/pipes/timezone-aware-date.pipe'
import {Component, effect, inject, model, OnInit, signal} from '@angular/core'
import {MessageService} from 'primeng/api'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {Tag} from 'primeng/tag'
import {OrganizationUser} from '../../../api/organization-level/organization_user/organization-user.model'
import {OrganizationUserService} from '../../../api/organization-level/organization_user/organization-user.service'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {ProcessingStatus} from '../../../utils/types/processing-status.enum'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'
import {GridFilterComponent} from '../../reusable/grid-filter/grid-filter.component'
import {HasSubscriptionComponent} from '../../reusable/has-subscription.component'

@Component({
  selector: 'rts-organization-user',
  templateUrl: 'organization-user.component.html',
  imports: [
    TimezoneAwareDatePipe,
    TableModule,
    NullSafePipe,
    GridFilterComponent,
    EmptyRowComponent,
    Button,
    Tag,
    NgClass
  ]
})
export class OrganizationUserComponent extends HasSubscriptionComponent implements OnInit {
  private readonly organizationUserService = inject(OrganizationUserService)
  private readonly messageService = inject(MessageService)

  readonly loading = this.organizationUserService.selectLoading
  readonly organizationUsers = this.organizationUserService.selectAll
  readonly processingStatus = this.organizationUserService.selectProcessingStatus
  readonly userMadeAtLeastOneTerminationAttempt = signal(false)
  readonly selectedOrganizationUsers = model<OrganizationUser[]>([])

  readonly ProcessingStatus = ProcessingStatus

  constructor() {
    super()
    effect(() => {
      if (this.processingStatus() === ProcessingStatus.SUCCESS) {
        this.selectedOrganizationUsers.set([])
        this.onSuccessfulTermination()
      } else {
        this.onFailedTermination()
      }
    })
  }

  ngOnInit() {
    this.organizationUserService.fetch()
  }

  terminateSelectedUsers() {
    const userIdsToTerminate = this.selectedOrganizationUsers()
      .filter(organizationUser => !organizationUser.endOn)
      .map(organizationUser => organizationUser.id)

    this.organizationUserService.terminateUsers$(userIdsToTerminate)
    this.userMadeAtLeastOneTerminationAttempt.set(true)
  }

  private onSuccessfulTermination() {
    if (this.userMadeAtLeastOneTerminationAttempt()) {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Successfully terminated selected user(s)'
      })
    }
  }

  private onFailedTermination() {
    if (this.userMadeAtLeastOneTerminationAttempt()) {
      this.organizationUserService.selectFailureMessages().forEach((parsedError) => {
        this.messageService.add({severity: 'error', detail: parsedError})
      })
    }
  }
}
