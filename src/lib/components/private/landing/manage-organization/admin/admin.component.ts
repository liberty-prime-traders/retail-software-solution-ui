import {Component, effect, inject, signal} from '@angular/core'
import {DatePipe} from '@angular/common'
import {TableModule} from 'primeng/table'
import {OrganizationAdminService} from '../../../../../api/organization-admin/organization-admin.service'
import {OrganizationAdmin} from '../../../../../api/organization-admin/organization-admin.model'
import {NullSafePipe} from '../../../../../utils/pipes/null-safe.pipe'
import {HasGridComponent} from '../../../../reusable/has-grid.component'
import {FormButtonsComponent} from '../../../../reusable/form-buttons/form-buttons.component'
import {ProcessingStatus} from '../../../../../utils/types/processing-status.enum'

@Component({
  selector: 'rts-admin',
  templateUrl: 'admin.component.html',
  imports: [
    DatePipe,
    TableModule,
    NullSafePipe,
    FormButtonsComponent
  ],
})
export class AdminComponent extends HasGridComponent<OrganizationAdminService> {
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

  readonly selectedOrganizationAdmin = signal<OrganizationAdmin | null>(null)

  constructor() {
    super()
    effect(() => {
      if (this.processingStatus() === ProcessingStatus.SUCCESS) {
        this.selectedOrganizationAdmin.set(null)
        
        if (this.isTerminatingAdmin()) {
          this.organizationAdminService.refetch()
          this.isTerminatingAdmin.set(false)
        }
      }
    })
  }

  terminateSelectedAdmin() {
    this.isTerminatingAdmin.set(true)
    this.organizationAdminService.post({}, `terminate/${this.selectedOrganizationAdmin()?.adminId}`)
  }
  
  addSelectedAdmin() {
    this.organizationAdminService.post({}, this.selectedOrganizationAdmin()?.adminId)
  }
}
