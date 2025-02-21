import {AsyncPipe} from '@angular/common'
import {Component, inject, model, OnInit, signal} from '@angular/core'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {JobTitle} from '../../../api/jobtitle/jobtitle.model'
import {JobTitleService} from '../../../api/jobtitle/jobtitle.service'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {AddRowComponent} from '../../reusable/add-row/add-row.component'
import {HasGridComponent} from '../../reusable/has-grid.component'
import {JobTitleFormComponent} from './jobtitle-form/jobtitle-form.component'

@Component({
  standalone: true,
  selector: 'rts-jobtitle',
  templateUrl: 'jobtitle.component.html',
  imports: [
    TableModule,
    AsyncPipe,
    NullSafePipe,
    Button,
    JobTitleFormComponent,
    AddRowComponent
  ]
})
export class JobTitleComponent extends HasGridComponent<JobTitleService> implements OnInit {
  private readonly jobTitleService = inject(JobTitleService)
  readonly loading$ = this.jobTitleService.selectLoading$()
  readonly processingIsUnderWay$ = this.jobTitleService.processingIsUnderWay$()
  readonly jobTitles$ = this.jobTitleService.selectAll$()
  selectedJobTitle = model<JobTitle|undefined>(undefined)

  readonly apiService = this.jobTitleService
  readonly addingIsActive = signal(false)
  readonly rowIsExpanded = signal<boolean>(false)
}
