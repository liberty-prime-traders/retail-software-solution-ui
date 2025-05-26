import {DatePipe} from '@angular/common'
import {Component, inject, signal} from '@angular/core'
import {TableModule} from 'primeng/table'
import {TagModule} from 'primeng/tag'
import {MyJoinRequestService} from '../../../api/my-join-request/my-join-request.service'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {ProcessingStatus} from '../../../utils/types/processing-status.enum'
import {GridFilterComponent} from '../../reusable/grid-filter/grid-filter.component'
import {HasGridComponent} from '../../reusable/has-grid.component'
import {Card} from 'primeng/card'
import {Button} from 'primeng/button'
import {Router, RouterLink} from '@angular/router'

@Component({
  selector: 'rts-my-join-request',
  templateUrl: 'my-join-request.component.html',
  imports: [
    DatePipe,
    TableModule,
    NullSafePipe,
    GridFilterComponent,
    TagModule,
    Card,
    Button,
    RouterLink
  ]
})
export class MyJoinRequestsComponent extends HasGridComponent<MyJoinRequestService> {
  private readonly joinRequestService = inject(MyJoinRequestService)
  private readonly router = inject(Router)
  readonly loading = this.joinRequestService.selectLoading
  readonly processingIsUnderWay = this.joinRequestService.processingIsUnderWay
  readonly myJoinRequests = this.joinRequestService.selectAll

  readonly apiService = this.joinRequestService
  readonly addingIsActive = signal(false)
  readonly rowIsExpanded = signal(false)

  readonly ProcessingStatus = ProcessingStatus

  readonly processingStatus = this.joinRequestService.selectProcessingStatus
  readonly failureMessages = this.joinRequestService.selectFailureMessages

  constructor() {
    super()
    this.joinRequestService.refetch()
  }

  getStatusSeverity(status?: string) {
    switch (status) {
    case 'PENDING':
      return 'warn'
    case 'APPROVED':
      return 'success'
    case 'REJECTED':
      return 'danger'
    default:
      return 'info'
    }
  }

  goBack() {
    this.router.navigate(['/landing']).then()
  }
}
