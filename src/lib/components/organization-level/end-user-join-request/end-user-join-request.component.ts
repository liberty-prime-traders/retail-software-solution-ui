import {DatePipe} from '@angular/common'
import {Component, effect, inject, model, signal} from '@angular/core'
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
    EmptyRowComponent
  ]
})
export class EndUserJoinRequestComponent extends HasGridComponent<EndUserJoinRequestService> {
  private readonly joinRequestService = inject(EndUserJoinRequestService)
  readonly loading = this.joinRequestService.selectLoading
  readonly processingIsUnderWay = this.joinRequestService.processingIsUnderWay
  readonly joinRequests = this.joinRequestService.selectAll

  readonly apiService = this.joinRequestService
  readonly addingIsActive = signal(false)
  readonly rowIsExpanded = signal(false)
  readonly isAdmittingUsers = signal(false)

  readonly ProcessingStatus = ProcessingStatus

  readonly processingStatus = this.joinRequestService.selectProcessingStatus
  readonly failureMessages = this.joinRequestService.selectFailureMessages

  readonly selectedJoinRequests = model<EndUserJoinRequest[]>([])

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
}
