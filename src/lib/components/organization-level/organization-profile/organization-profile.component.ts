import {Component, effect, inject, signal, untracked} from '@angular/core'
import {FormField, form} from '@angular/forms/signals'
import {ButtonModule} from 'primeng/button'
import {CardModule} from 'primeng/card'
import {Divider} from 'primeng/divider'
import {InputTextModule} from 'primeng/inputtext'
import {OrganizationService} from '../../../api/platform-level/organization/organization.service'
import {SessionContextService} from '../../../utils/services/session-context.service'
import {ProcessingStatus} from '../../../utils/types/processing-status.enum'
import {FormButtonsComponent} from '../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../reusable/form-field/form-field.component'
import {OrganizationProfileFormDefinition} from './organization-profile-form.definition'

@Component({
  selector: 'rts-update-organization',
  templateUrl: 'organization-profile.component.html',
  imports: [
    ButtonModule,
    InputTextModule,
    CardModule,
    FormButtonsComponent,
    FormFieldComponent,
    Divider,
    FormField
  ]
})
export class OrganizationProfileComponent {
  private readonly organizationService = inject(OrganizationService)
  private readonly sessionContextService = inject(SessionContextService)

  readonly ProcessingStatus = ProcessingStatus

  readonly organizationFormModel = signal<OrganizationProfileFormDefinition.OrganizationProfileFormModel>(
    OrganizationProfileFormDefinition.defaultOrganizationProfileFormModel
  )
  readonly organizationForm = form(
    this.organizationFormModel,
    OrganizationProfileFormDefinition.organizationProfileFormSchema
  )
  readonly organizationFieldMap = OrganizationProfileFormDefinition.fieldMap

  readonly organizationProcessingStatus = this.organizationService.selectProcessingStatus
  readonly organizationServiceFailureMessages = this.organizationService.selectFailureMessages

  constructor() {
    effect(() => {
      const organization = this.sessionContextService.selectedOrganization()
      untracked(() => {
        this.organizationFormModel.set(
          OrganizationProfileFormDefinition.convertToFormModel(organization)
        )
      })
    })

    effect(() => {
      if (this.organizationProcessingStatus() === ProcessingStatus.SUCCESS) {
        const updatedOrganization = this.organizationService.selectFirst()
        this.sessionContextService.updateSelectedOrganization(updatedOrganization!)
        this.organizationService.resetProcessingStatus()
      }
    })
    this.organizationService.resetProcessingStatus()
  }

  updateOrganization() {
    this.organizationService.put(
      OrganizationProfileFormDefinition.convertToBackendModel(this.organizationFormModel())
    )
  }

  resetForm() {
    this.organizationFormModel.set(
      OrganizationProfileFormDefinition.convertToFormModel(this.sessionContextService.selectedOrganization())
    )
  }
}
