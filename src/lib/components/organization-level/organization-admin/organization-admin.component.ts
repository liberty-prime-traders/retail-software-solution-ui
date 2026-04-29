import {DatePipe} from '@angular/common'
import {Component, effect, inject, model, OnInit} from '@angular/core'
import {TableModule} from 'primeng/table'
import {OrganizationAdmin} from '../../../api/platform-level/organization/organization-admin/organization-admin.model'
import {
  OrganizationAdminService
} from '../../../api/platform-level/organization/organization-admin/organization-admin.service'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {ProcessingStatus} from '../../../utils/types/processing-status.enum'
import {GridFilterComponent} from '../../reusable/grid-filter/grid-filter.component'

@Component({
  selector: 'rts-admin',
  templateUrl: 'organization-admin.component.html',
  imports: [
    DatePipe,
    TableModule,
    NullSafePipe,
    GridFilterComponent
  ]
})
export class OrganizationAdminComponent implements OnInit {
  private readonly organizationAdminService = inject(OrganizationAdminService)
  readonly loading = this.organizationAdminService.selectLoading
  readonly organizationAdmins = this.organizationAdminService.selectAll
  readonly processingStatus = this.organizationAdminService.selectProcessingStatus
  readonly failureMessages = this.organizationAdminService.selectFailureMessages
  readonly selectedOrganizationAdmins = model<OrganizationAdmin[]>([])

  readonly ProcessingStatus = ProcessingStatus

  constructor() {
    effect(() => {
      if (this.processingStatus() === ProcessingStatus.SUCCESS) {
        this.selectedOrganizationAdmins.set([])
      }
    })
  }

  ngOnInit() {
    this.organizationAdminService.fetch()
  }
}
