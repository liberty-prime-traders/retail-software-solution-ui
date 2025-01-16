import {Component, inject, model, OnInit, signal} from '@angular/core'
import {AsyncPipe, DatePipe} from '@angular/common'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {AddRowComponent} from '../../reusable/add-row/add-row.component'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {HasSubscriptionComponent} from '../../reusable/has-subscription.component'
import {JobTitleService} from '../../../api/jobtitle/jobtitle.service'
import {JobTitle} from '../../../api/jobtitle/jobtitle.model'
import {ProcessingStatus} from '../../../utils/types/processing-status.enum'
import {delay, Subscription} from 'rxjs'
import {filter, tap} from 'rxjs/operators'
import {JobTitleFormComponent} from './jobtitle-form/jobtitle-form.component'

@Component({
  standalone: true,
  selector: 'rts-jobtitle',
  templateUrl: 'jobtitle.component.html',
  imports: [
    TableModule,
    AsyncPipe,
    NullSafePipe,
    DatePipe,
    Button,
    JobTitleFormComponent,
    AddRowComponent
  ]
})
export class JobTitleComponent extends HasSubscriptionComponent implements OnInit {
  private readonly jobTitleService = inject(JobTitleService)
  readonly loading$ = this.jobTitleService.selectLoading$()
  readonly processingIsUnderWay$ = this.jobTitleService.processingIsUnderWay$()
  readonly jobtitles$ = this.jobTitleService.selectAll$()
  selectedJobTitle = model<JobTitle|undefined>(undefined)

  readonly addingIsActive = signal(false)
  readonly rowIsExpanded = signal<boolean>(false)

  ngOnInit() {
    this.jobTitleService.fetch()
    this.subscriptions.add(this.listenToJobTitleSaveStatus())
  }

  private listenToJobTitleSaveStatus(): Subscription {
    return this.jobTitleService.processingStatus$().pipe(
      filter(status => status === ProcessingStatus.SUCCESS),
      delay(500),
      tap(() => this.addingIsActive.set(false))
    )
      .subscribe()
  }
}
