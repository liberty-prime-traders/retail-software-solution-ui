import {Component, inject, model, OnInit, signal} from '@angular/core'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {JobTitle} from '../../../api/jobtitle/jobtitle.model'
import {JobTitleService} from '../../../api/jobtitle/jobtitle.service'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {AddRowComponent} from '../../reusable/add-row/add-row.component'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'
import {GridFilterComponent} from '../../reusable/grid-filter/grid-filter.component'
import {HasEditableGridComponent} from '../../reusable/has-editable-grid.component'
import {JobTitleFormComponent} from './jobtitle-form/jobtitle-form.component'

@Component({
  selector: 'rts-jobtitle',
  templateUrl: 'jobtitle.component.html',
  imports: [
    TableModule,
    NullSafePipe,
    Button,
    JobTitleFormComponent,
    AddRowComponent,
    GridFilterComponent,
    EmptyRowComponent
  ]
})
export class JobTitleComponent extends HasEditableGridComponent<JobTitleService> implements OnInit {
  private readonly jobTitleService = inject(JobTitleService)
  readonly loading = this.jobTitleService.selectLoading
  readonly jobTitles = this.jobTitleService.selectAll
  selectedJobTitle = model<JobTitle|undefined>(undefined)

  readonly apiService = this.jobTitleService
  readonly addingIsActive = signal(false)
  readonly rowIsExpanded = signal<boolean>(false)
}
