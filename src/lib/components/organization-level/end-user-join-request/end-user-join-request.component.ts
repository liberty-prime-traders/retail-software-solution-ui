import {DatePipe} from '@angular/common'
import {Component, effect, inject, model, signal} from '@angular/core'
import {MessageService} from 'primeng/api'
import {Divider} from 'primeng/divider'
import {TableModule} from 'primeng/table'
import {TagModule} from 'primeng/tag'
import {EndUserJoinRequest} from '../../../api/end-user-join-request/end-user-join-request.model'
import {EndUserJoinRequestService} from '../../../api/end-user-join-request/end-user-join-request.service'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {ProcessingStatus} from '../../../utils/types/processing-status.enum'
import {GridFilterComponent} from '../../reusable/grid-filter/grid-filter.component'
import {HasGridComponent} from '../../reusable/has-grid.component'
import {JoinRequestStatusSeverityPipe} from '../../../utils/pipes/join-request-status-severity.pipe'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'
import {JoinRequestStatus} from '../../../api/join-request/join-request-status.enum'
import {Button} from 'primeng/button'
import {OrganizationService} from '../../../api/organization/organization.service'
import {catchError, tap} from 'rxjs/operators'
import {parseError} from '../../../utils/error.util'
import {finalize, of} from 'rxjs'

@Component({
  selector: 'rts-end-user-join-request',
  templateUrl: 'end-user-join-request.component.html',
  imports: [
    DatePipe,
    JoinRequestStatusSeverityPipe,
    TableModule,
    NullSafePipe,
    GridFilterComponent,
    Divider,
    TagModule,
    EmptyRowComponent,
    Button
  ]
})
export class EndUserJoinRequestComponent extends HasGridComponent<EndUserJoinRequestService> {
  private readonly joinRequestService = inject(EndUserJoinRequestService)
  private readonly organizationService = inject(OrganizationService)
  private readonly messageService = inject(MessageService)

  readonly loading = this.joinRequestService.selectLoading
  readonly processingIsUnderWay = this.joinRequestService.processingIsUnderWay
  readonly joinRequests = this.joinRequestService.selectAll

  readonly apiService = this.joinRequestService
  readonly addingIsActive = signal(false)
  readonly rowIsExpanded = signal(false)
  readonly isAdmittingUsers = signal(false)

  readonly ProcessingStatus = ProcessingStatus
  readonly JoinRequestStatus = JoinRequestStatus

  readonly processingStatus = this.joinRequestService.selectProcessingStatus
  readonly failureMessages = this.joinRequestService.selectFailureMessages

  readonly selectedJoinRequests = model<EndUserJoinRequest[]>([])

  readonly admissionInProgress = signal(false)

  constructor() {
    super()
    effect(() => {
      if (this.processingStatus() === ProcessingStatus.SUCCESS) {
        this.selectedJoinRequests.set([])

        if (this.isAdmittingUsers()) {
          this.joinRequestService.refetch()
          this.isAdmittingUsers.set(false)
        }
      }
    })
  }

  admitSelectedRequests() {
    if (!this.selectedJoinRequests().length) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Error',
        detail: 'Please select at least one user to admit'
      })
      return
    }

    const joinRequestIds = this.selectedJoinRequests()
      .filter(joinRequest => joinRequest.status === JoinRequestStatus.PENDING)
      .map(joinRequest => joinRequest.id)

    this.admissionInProgress.set(true)

    this.organizationService.admitJoinRequests$(joinRequestIds).pipe(
      tap(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Successfully admitted ${joinRequestIds.length} user(s)`
        })
        this.joinRequestService.refetch()
      }),
      catchError((error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: parseError(error).join(', ') ?? 'User(s) admission failed'
        })
        return of(null)
      }),
      finalize(() => {
        this.admissionInProgress.set(false)
      })
    )
      .subscribe()
  }
}
