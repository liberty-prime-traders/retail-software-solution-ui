import {Component, inject, OnInit} from '@angular/core'
import {FormBuilder, Validators, ReactiveFormsModule, FormsModule} from '@angular/forms'
import {CommonModule} from '@angular/common'
import {DropdownModule} from 'primeng/dropdown'
import {MultiSelectModule} from 'primeng/multiselect'
import {DbVersionService} from '../../../../api/db-version/db-version.service'
import {DbMigrationService} from '../../../../api/db-migration/db-migration.service'
import {OrganizationService} from '../../../../api/organization/organization.service'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldDirection} from '../../../reusable/form-field/form-field-direction'
import {OrganizationLocationService} from '../../../../api/organization-location/organization-location.service'

@Component({
  selector: 'rts-run-migration',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    MultiSelectModule,
    FormFieldComponent,
    FormButtonsComponent
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
    schemaOwnerId: ['', [Validators.required]],
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

  protected readonly FormFieldDirection = FormFieldDirection

  onOrganizationChange(organizationId: string) {
    if (organizationId) {
      this.organizationLocationService.refetch({pathSuffix: `${organizationId}/locations`})
    }
  }
}
