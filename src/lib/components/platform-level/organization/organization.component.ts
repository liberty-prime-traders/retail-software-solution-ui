import {DatePipe} from '@angular/common'
import {Component, inject} from '@angular/core'
import {Divider} from 'primeng/divider'
import {TableModule} from 'primeng/table'
import {OrganizationService} from '../../../api/platform-level/organization/organization.service'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {BaseGridComponent} from '../../reusable/base-grid.component'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'
import {GridFilterComponent} from '../../reusable/grid-filter/grid-filter.component'

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
export class OrganizationComponent extends BaseGridComponent<OrganizationService> {
  private readonly organizationService = inject(OrganizationService)
  readonly loading = this.organizationService.selectLoading
  readonly organizations = this.organizationService.selectAll

  readonly apiService = this.organizationService
}
