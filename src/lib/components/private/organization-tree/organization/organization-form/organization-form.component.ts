import {AsyncPipe} from '@angular/common'
import {Component, computed, inject, input, OnInit} from '@angular/core'
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
import {isNil} from 'lodash-es'
import {InputText} from 'primeng/inputtext'
import {Organization} from '../../../../../api/organization/organization.model'
import {OrganizationService} from '../../../../../api/organization/organization.service'
import {FormButtonsComponent} from '../../../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../../../reusable/form-field/form-field.component'

@Component({
  selector: 'rts-organization-form',
  templateUrl: 'organization-form.component.html',
  imports: [
    ReactiveFormsModule,
    InputText,
    FormButtonsComponent,
    AsyncPipe,
    FormFieldComponent
  ]
})
export class OrganizationFormComponent implements OnInit {
  readonly organization = input<Organization>()

  private readonly organizationService = inject(OrganizationService)
  private readonly formBuilder = inject(FormBuilder)

  readonly organizationForm = computed(() => this.formBuilder.nonNullable.group({
    id: this.organization()?.id,
    name: [this.organization()?.name, Validators.required],
    description: this.organization()?.description
  }))

  readonly processingStatus$ = this.organizationService.processingStatus$()
  readonly failureMessages$ = this.organizationService.failureMessages$()

  ngOnInit() {
    this.organizationService.resetProcessingStatus()
  }

  resetForm() {
    this.organizationForm().reset(this.organization())
  }

  upsertOrganization() {
    const updatedOrganization: Organization = this.organizationForm().getRawValue()
    if (isNil(updatedOrganization.id)) {
      this.organizationService.post(updatedOrganization)
    } else {
      this.organizationService.put(updatedOrganization)
    }
  }

  deleteOrganization() {
    this.organizationService.delete(this.organization()?.id)
  }
}
