
import {Component, inject, OnInit} from '@angular/core'
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms'
import {MultiSelectModule} from 'primeng/multiselect'
import {Select} from 'primeng/select'
import {DbMigrationService} from '../../../../api/platform-level/db-migration/db-migration.service'
import {DbVersionService} from '../../../../api/platform-level/db-version/db-version.service'
import {OrganizationLocationService} from '../../../../api/platform-level/organization-location/organization-location.service'
import {OrganizationService} from '../../../../api/platform-level/organization/organization.service'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'

@Component({
  selector: 'rts-run-migration',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MultiSelectModule,
    FormFieldComponent,
    FormButtonsComponent,
    Select
  ],
  templateUrl: './run-migration.component.html'
})
export class RunMigrationComponent implements OnInit {
  private readonly dbMigrationService = inject(DbMigrationService)
  private readonly dbVersionService = inject(DbVersionService)
  private readonly organizationService = inject(OrganizationService)
  private readonly organizationLocationService = inject(OrganizationLocationService)
  private readonly formBuilder = inject(FormBuilder)

  readonly processingStatus = this.dbMigrationService.selectProcessingStatus
  readonly failureMessages = this.dbMigrationService.selectFailureMessages

  readonly dbVersions = this.dbVersionService.selectAll
  readonly organizations = this.organizationService.selectAll
  readonly locations = this.organizationLocationService.selectAll

  readonly loadingOrganizations = this.organizationService.selectLoading
  readonly loadingDbVersions = this.dbVersionService.selectLoading
  readonly loadingLocations = this.organizationLocationService.selectLoading

  readonly migrationForm = this.formBuilder.nonNullable.group({
    organizationId: ['', [Validators.required]],
    locationIdsToMigrate: [[], Validators.required],
    targetDbVersionId: ['', [Validators.required]]
  })

  ngOnInit(): void {
    this.dbMigrationService.resetProcessingStatus()
    this.organizationService.fetch()
    this.dbVersionService.fetch()
  }

  runMigration() {
    if (this.migrationForm.valid) {
      const request = this.migrationForm.getRawValue()
      this.dbMigrationService.runMigration(request)
    }
  }

  resetForm() {
    this.migrationForm.reset()
  }

  onOrganizationChange(organizationId: string) {
    if (organizationId) {
      this.organizationLocationService.refetch(organizationId)
    }
  }
}
