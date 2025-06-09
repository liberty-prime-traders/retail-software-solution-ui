import {DatePipe} from '@angular/common'
import {Component, effect, inject, model, OnInit, signal} from '@angular/core'
import {MessageService} from 'primeng/api'
import {Button} from 'primeng/button'
import {Divider} from 'primeng/divider'
import {TableModule} from 'primeng/table'
import {TagModule} from 'primeng/tag'
import {EntityId} from '@ngrx/signals/entities'
import {EndUserJoinRequest} from '../../../api/end-user-join-request/end-user-join-request.model'
import {EndUserJoinRequestService} from '../../../api/end-user-join-request/end-user-join-request.service'
import {OrganizationUserService} from '../../../api/organization_user/organization-user.service'
import {JoinRequestStatus} from '../../../api/util/join-request/join-request-status.enum'
import {ActivityStatusSeverityPipe} from '../../../utils/pipes/activity-status-severity.pipe'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {ProcessingStatus} from '../../../utils/types/processing-status.enum'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'
import {GridFilterComponent} from '../../reusable/grid-filter/grid-filter.component'

@Component({
  selector: 'rts-end-user-join-request',
  templateUrl: 'end-user-join-request.component.html',
  imports: [
    DatePipe,
    ActivityStatusSeverityPipe,
    TableModule,
    NullSafePipe,
    GridFilterComponent,
    Divider,
    TagModule,
    EmptyRowComponent,
    Button
  ]
})
export class EndUserJoinRequestComponent implements OnInit {
  private readonly joinRequestService = inject(EndUserJoinRequestService)
  private readonly messageService = inject(MessageService)
  private readonly organizationUserService = inject(OrganizationUserService)

  readonly loading = this.joinRequestService.selectLoading
  readonly joinRequests = this.joinRequestService.selectAll
  readonly processingStatus = this.joinRequestService.selectProcessingStatus
  readonly selectedJoinRequests = model<EndUserJoinRequest[]>([])
  private readonly userMadeAtLeastOneActionAttempt = signal(false)

  readonly ProcessingStatus = ProcessingStatus
  readonly JoinRequestStatus = JoinRequestStatus

  constructor() {
    effect(() => {
      if (this.processingStatus() === ProcessingStatus.SUCCESS) {
        this.selectedJoinRequests.set([])
        if (this.userMadeAtLeastOneActionAttempt()) {
          this.organizationUserService.resetStoreAndClearCache()
        }
      } else if (this.processingStatus() === ProcessingStatus.FAILURE) {
        this.onFailure()
      }
    })
  }

  ngOnInit() {
    this.joinRequestService.fetch()
  }

  private getPendingSelectedJoinRequestIds(): EntityId[] {
    return this.selectedJoinRequests()
      .filter(joinRequest => joinRequest.status === JoinRequestStatus.PENDING)
      .map(joinRequest => joinRequest.id)
  }

  admitSelectedRequests() {
    this.joinRequestService.admitJoinRequests$(this.getPendingSelectedJoinRequestIds())
    this.userMadeAtLeastOneActionAttempt.set(true)
  }

  rejectSelectedRequests() {
    this.joinRequestService.rejectJoinRequests$(this.getPendingSelectedJoinRequestIds())
    this.userMadeAtLeastOneActionAttempt.set(true)
  }

  private onFailure() {
    this.joinRequestService.selectFailureMessages().forEach(error => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error,
        life: 5000
      })
    })
  }
}
