import {NgClass} from '@angular/common'
import {Component, inject, model, OnInit} from '@angular/core'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {JobTitle} from '../../../api/organization-level/jobtitle/jobtitle.model'
import {JobTitleService} from '../../../api/organization-level/jobtitle/jobtitle.service'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {AddRowComponent} from '../../reusable/add-row/add-row.component'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'
import {GridFilterComponent} from '../../reusable/grid-filter/grid-filter.component'
import {GridWithAddButtonComponent} from '../../reusable/grid-with-add-button.component'
import {JobTitleFormComponent} from './job-title-form/job-title-form.component'

@Component({
  selector: 'rts-job-title',
  templateUrl: 'job-title.component.html',
  imports: [
    TableModule,
    NullSafePipe,
    Button,
    JobTitleFormComponent,
    AddRowComponent,
    GridFilterComponent,
    EmptyRowComponent,
    NgClass
  ]
})
export class JobTitleComponent extends GridWithAddButtonComponent<JobTitleService> implements OnInit {
  private readonly jobTitleService = inject(JobTitleService)
  readonly apiService = this.jobTitleService

  readonly jobTitles = this.jobTitleService.selectAll
  selectedJobTitle = model<JobTitle|undefined>(undefined)
}
