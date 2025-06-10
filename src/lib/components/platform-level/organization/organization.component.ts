import {Component, inject, signal} from '@angular/core'
import {HasEditableGridComponent} from '../../reusable/has-editable-grid.component'
import {OrganizationService} from '../../../api/organization/organization.service'
import {Divider} from 'primeng/divider'
import {DatePipe} from '@angular/common'
import {TableModule} from 'primeng/table'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {GridFilterComponent} from '../../reusable/grid-filter/grid-filter.component'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'

@Component({
  selector: 'rts-organization',
  templateUrl: './organization.component.html',
  imports: [
    DatePipe,
    TableModule,
    NullSafePipe,
    GridFilterComponent,
    Divider,
    EmptyRowComponent
  ]
})
export class OrganizationComponent extends HasEditableGridComponent<OrganizationService> {
  private readonly organizationService = inject(OrganizationService)
  readonly loading = this.organizationService.selectLoading
  readonly organizations = this.organizationService.selectAll

  readonly apiService = this.organizationService
  readonly addingIsActive = signal(false)
  readonly rowIsExpanded = signal(false)
}
