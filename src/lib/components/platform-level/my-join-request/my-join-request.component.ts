import {DatePipe} from '@angular/common'
import {Component, inject} from '@angular/core'
import {Router, RouterLink} from '@angular/router'
import {Button} from 'primeng/button'
import {Card} from 'primeng/card'
import {TableModule} from 'primeng/table'
import {TagModule} from 'primeng/tag'
import {MyJoinRequestService} from '../../../api/platform-level/my-join-request/my-join-request.service'
import {ActivityStatusSeverityPipe} from '../../../utils/pipes/activity-status-severity.pipe'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {PrettifyEnumPipe} from '../../../utils/pipes/prettify-enum.pipe'
import {ProcessingStatus} from '../../../utils/types/processing-status.enum'
import {BaseGridComponent} from '../../reusable/base-grid.component'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'
import {GridFilterComponent} from '../../reusable/grid-filter/grid-filter.component'

@Component({
  selector: 'rts-my-join-request',
  templateUrl: 'my-join-request.component.html',
  imports: [
    DatePipe,
    ActivityStatusSeverityPipe,
    TableModule,
    NullSafePipe,
    GridFilterComponent,
    TagModule,
    Card,
    Button,
    RouterLink,
    EmptyRowComponent,
    PrettifyEnumPipe
  ]
})
export class MyJoinRequestsComponent extends BaseGridComponent<MyJoinRequestService> {
  private readonly joinRequestService = inject(MyJoinRequestService)
  private readonly router = inject(Router)
  readonly loading = this.joinRequestService.selectLoading
  readonly myJoinRequests = this.joinRequestService.selectAll

  readonly apiService = this.joinRequestService

  readonly ProcessingStatus = ProcessingStatus

  readonly processingStatus = this.joinRequestService.selectProcessingStatus
  readonly failureMessages = this.joinRequestService.selectFailureMessages

  goBack() {
    this.router.navigate(['/landing']).then()
  }
}
