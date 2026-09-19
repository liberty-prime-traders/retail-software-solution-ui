import {NgClass} from '@angular/common'
import {Component, inject, model, OnInit} from '@angular/core'
import {MessageService} from 'primeng/api'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {Tag} from 'primeng/tag'
import {AuthorityService} from '../../../api/cross-tier/authorization/authority.service'
import {MembershipUserSummary} from '../../../api/cross-tier/authorization/membership-user-summary.model'
import {OrgMembershipUserService} from '../../../api/organization-level/membership/org-membership-user.service'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {ProcessingStatus} from '../../../utils/types/processing-status.enum'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'
import {GridFilterComponent} from '../../reusable/grid-filter/grid-filter.component'

@Component({
  selector: 'rts-organization-membership',
  templateUrl: 'organization-membership.component.html',
  imports: [
    TableModule,
    NullSafePipe,
    GridFilterComponent,
    EmptyRowComponent,
    Button,
    Tag,
    NgClass
  ]
})
export class OrganizationMembershipComponent implements OnInit {
  private readonly orgMembershipUserService = inject(OrgMembershipUserService)
  private readonly messageService = inject(MessageService)
  private readonly authorityService = inject(AuthorityService)

  readonly loading = this.orgMembershipUserService.selectLoading
  readonly organizationUsers = this.orgMembershipUserService.selectAll
  readonly processingStatus = this.orgMembershipUserService.selectProcessingStatus
  readonly selectedOrganizationUsers = model<MembershipUserSummary[]>([])

  readonly ProcessingStatus = ProcessingStatus

  ngOnInit() {
    this.authorityService.getForOrganization()
  }

  terminateSelectedUsers() {
    const userIdsToTerminate = this.selectedOrganizationUsers()
      .filter(organizationUser => organizationUser.active)
      .map(organizationUser => organizationUser.id)

    this.orgMembershipUserService.terminateUsers(
      userIdsToTerminate,
      {
        onSuccess: () => this.onSuccessfulTermination(),
        onFail: () => this.onFailedTermination()
      }
    )
  }

  private onSuccessfulTermination() {
    this.selectedOrganizationUsers.set([])
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Successfully terminated selected user(s)'
    })
  }

  private onFailedTermination() {
    this.orgMembershipUserService.selectFailureMessages().forEach((parsedError) => {
      this.messageService.add({severity: 'error', detail: parsedError})
    })
  }
}
