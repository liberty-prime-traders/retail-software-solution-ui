import {CommonModule} from '@angular/common'
import {Component, effect, inject, OnInit} from '@angular/core'
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
import {ButtonModule} from 'primeng/button'
import {CardModule} from 'primeng/card'
import {InputTextModule} from 'primeng/inputtext'
import {Organization} from '../../../../../api/organization/organization.model'
import {OrganizationService} from '../../../../../api/organization/organization.service'
import {LocalStorageService} from '../../../../../utils/services/local-storage.service'
import {LocalStorageKey} from '../../../../../utils/types/local-storage-key.enum'
import {ProcessingStatus} from '../../../../../utils/types/processing-status.enum'
import {FormButtonsComponent} from '../../../../reusable/form-buttons/form-buttons.component'
import {FormFieldDirection} from '../../../../reusable/form-field/form-field-direction'
import {FormFieldComponent} from '../../../../reusable/form-field/form-field.component'

@Component({
  selector: 'rts-update-organization',
  templateUrl: 'update-organization.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    FormButtonsComponent,
    FormFieldComponent
  ],
  standalone: true
})
export class UpdateOrganizationComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder)
  private readonly organizationService = inject(OrganizationService)
  private readonly localStorageService = inject(LocalStorageService)

  readonly ProcessingStatus = ProcessingStatus
  readonly FormFieldDirection = FormFieldDirection

  readonly organizationForm = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    description: ['']
  })

  readonly organizationProcessingStatus = this.organizationService.selectProcessingStatus
  readonly organizationServiceFailureMessages = this.organizationService.selectFailureMessages

  constructor() {
    effect(() => {
      if (this.organizationProcessingStatus() === ProcessingStatus.SUCCESS) {
        const updatedOrganization = this.organizationService.selectFirst()
        this.localStorageService.setItem<Organization>(LocalStorageKey.ORGANIZATION, updatedOrganization!)
      }
    })
  }

  ngOnInit() {
    this.organizationService.resetProcessingStatus()
    this.loadOrganizationData()
  }

  private loadOrganizationData() {
    const organization = this.localStorageService.getItem<Organization>(LocalStorageKey.ORGANIZATION)
    if (organization) {
      this.organizationForm.patchValue({
        name: organization.name,
        description: organization.description
      })
    }
  }

  updateOrganization() {
    const organizationId = this.localStorageService.getItem<Organization>(LocalStorageKey.ORGANIZATION)
    if (organizationId) {
      this.organizationService.put({
        ...this.organizationForm.getRawValue(),
        organizationId 
      })
    }
  }
}
