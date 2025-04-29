import {CommonModule} from '@angular/common'
import {Component, effect, inject, OnInit} from '@angular/core'
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
import {ButtonModule} from 'primeng/button'
import {CardModule} from 'primeng/card'
import {InputTextModule} from 'primeng/inputtext'
import {OrganizationService} from '../../../../api/organization/organization.service'
import {SessionContextService} from '../../../../utils/services/session-context.service'
import {ProcessingStatus} from '../../../../utils/types/processing-status.enum'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'

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
  private readonly sessionContextService = inject(SessionContextService)

  readonly ProcessingStatus = ProcessingStatus

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
        this.sessionContextService.updateSelectedOrganization(updatedOrganization!)
        this.organizationService.resetProcessingStatus()
      }
    })
  }

  ngOnInit() {
    this.organizationService.resetProcessingStatus()
    this.loadOrganizationData()
  }

  private loadOrganizationData() {
    const organization = this.sessionContextService.selectedOrganization()
    if (organization) {
      this.organizationForm.patchValue({
        name: organization.name,
        description: organization.description
      })
    }
  }

  updateOrganization() {
    this.organizationService.put(this.organizationForm.getRawValue())
  }
}
