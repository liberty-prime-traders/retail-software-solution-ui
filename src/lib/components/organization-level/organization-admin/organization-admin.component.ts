import {DatePipe} from '@angular/common'
import {Component, effect, inject, model, signal} from '@angular/core'
import {Divider} from 'primeng/divider'
import {TableModule} from 'primeng/table'
import {OrganizationAdmin} from '../../../api/organization-admin/organization-admin.model'
import {OrganizationAdminService} from '../../../api/organization-admin/organization-admin.service'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {ProcessingStatus} from '../../../utils/types/processing-status.enum'
import {GridFilterComponent} from '../../reusable/grid-filter/grid-filter.component'
import {HasGridComponent} from '../../reusable/has-grid.component'

@Component({
  selector: 'rts-admin',
  templateUrl: 'organization-admin.component.html',
  imports: [
    DatePipe,
    TableModule,
    NullSafePipe,
    GridFilterComponent,
    Divider
  ]
})
export class OrganizationAdminComponent extends HasGridComponent<OrganizationAdminService> {
  private readonly organizationAdminService = inject(OrganizationAdminService)
  readonly loading = this.organizationAdminService.selectLoading
  readonly processingIsUnderWay = this.organizationAdminService.processingIsUnderWay
  readonly organizationAdmins = this.organizationAdminService.selectAll

  readonly apiService = this.organizationAdminService
  readonly addingIsActive = signal(false)
  readonly rowIsExpanded = signal(false)
  readonly isTerminatingAdmin = signal(false)

  readonly ProcessingStatus = ProcessingStatus

  readonly processingStatus = this.organizationAdminService.selectProcessingStatus
  readonly failureMessages = this.organizationAdminService.selectFailureMessages

  readonly selectedOrganizationAdmins = model<OrganizationAdmin[]>([])

  constructor() {
    super()
    effect(() => {
      if (this.processingStatus() === ProcessingStatus.SUCCESS) {
        this.selectedOrganizationAdmins.set([])

        if (this.isTerminatingAdmin()) {
          this.organizationAdminService.refetch()
          this.isTerminatingAdmin.set(false)
        }
      }
    })
  }
}
