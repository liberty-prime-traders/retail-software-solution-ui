import {TimezoneAwareDatePipe} from '../../../utils/pipes/timezone-aware-date.pipe'
import {Component, computed, effect, inject, model, OnInit, signal} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {MessageService} from 'primeng/api'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {TagModule} from 'primeng/tag'
import {EndUserJoinRequest} from '../../../api/organization-level/end-user-join-request/end-user-join-request.model'
import {EndUserJoinRequestService} from '../../../api/organization-level/end-user-join-request/end-user-join-request.service'
import {OrganizationUserService} from '../../../api/organization-level/organization_user/organization-user.service'
import {JoinRequestStatus} from '../../../api/util/join-request/join-request-status.enum'
import {JoinRequestStatusSeverityPipe} from '../../../utils/pipes/join-request-status-severity.pipe'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {PrettifyEnumPipe} from '../../../utils/pipes/prettify-enum.pipe'
import {ProcessingStatus} from '../../../utils/types/processing-status.enum'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'
import {GridFilterComponent} from '../../reusable/grid-filter/grid-filter.component'

@Component({
  selector: 'rts-end-user-join-request',
  templateUrl: 'end-user-join-request.component.html',
  imports: [
    TimezoneAwareDatePipe,
    JoinRequestStatusSeverityPipe,
    TableModule,
    NullSafePipe,
    GridFilterComponent,
    TagModule,
    EmptyRowComponent,
    Button,
    PrettifyEnumPipe
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
  private readonly userMadeAtLeastOneApiRequest = signal(false)

  readonly pendingRequestsExist = computed(() =>
    this.joinRequests().some(joinRequest => joinRequest.status === JoinRequestStatus.PENDING)
  )

  readonly ProcessingStatus = ProcessingStatus
  readonly JoinRequestStatus = JoinRequestStatus

  constructor() {
    effect(() => {
      if (this.userMadeAtLeastOneApiRequest()) {
        if (this.processingStatus() === ProcessingStatus.SUCCESS) {
          this.selectedJoinRequests.set([])
          this.organizationUserService.resetStoreAndClearCache()
        } else if (this.processingStatus() === ProcessingStatus.FAILURE) {
          this.onFailure()
        }
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
    this.joinRequestService.respondToJoinRequests$(this.getPendingSelectedJoinRequestIds(), 'admit')
    this.userMadeAtLeastOneApiRequest.set(true)
  }

  rejectSelectedRequests() {
    this.joinRequestService.respondToJoinRequests$(this.getPendingSelectedJoinRequestIds(), 'deny')
    this.userMadeAtLeastOneApiRequest.set(true)
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
