import {Component, computed, effect, inject, OnInit, signal} from '@angular/core'
import {FormField, form} from '@angular/forms/signals'
import {ActivatedRoute, Router, RouterLink} from '@angular/router'
import {BlockUI} from 'primeng/blockui'
import {Button} from 'primeng/button'
import {Card} from 'primeng/card'
import {InputText} from 'primeng/inputtext'
import {OrganizationService} from '../../../api/platform-level/organization/organization.service'
import {ReservedSubdomainService} from '../../../api/platform-level/reserved-subdomain/reserved-subdomain.service'
import {SessionContextService} from '../../../utils/services/session-context.service'
import {ProcessingStatus} from '../../../utils/types/processing-status.enum'
import {FormButtonsComponent} from '../../reusable/form-buttons/form-buttons.component'
import {FormFieldDirection} from '../../reusable/form-field/form-field-direction'
import {FormFieldComponent} from '../../reusable/form-field/form-field.component'
import {CreateOrganizationFormDefinition} from './create-organization-form.definition'

@Component({
  selector: 'rts-create-organization',
  templateUrl: 'create-organization.component.html',
  imports: [
    Button,
    InputText,
    Card,
    FormButtonsComponent,
    FormFieldComponent,
    RouterLink,
    BlockUI,
    FormField
  ]
})
export class CreateOrganizationComponent implements OnInit {
  private readonly router = inject(Router)
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly reservedSubdomainService = inject(ReservedSubdomainService)
  private readonly organizationService = inject(OrganizationService)
  private readonly sessionContextService = inject(SessionContextService)

  readonly FormFieldDirection = FormFieldDirection
  readonly organizationFieldMap = CreateOrganizationFormDefinition.fieldMap

  readonly requestedSubdomain = signal<string | null>(null)

  readonly organizationFormModel = signal<CreateOrganizationFormDefinition.CreateOrganizationFormModel>(
    CreateOrganizationFormDefinition.defaultFormModel
  )

  readonly organizationForm = form(
    this.organizationFormModel,
    CreateOrganizationFormDefinition.formSchema
  )

  readonly organizationProcessingStatus = this.organizationService.selectProcessingStatus
  readonly organizationIsLoading = this.organizationService.selectLoading
  readonly organizationFailureMessages = this.organizationService.selectFailureMessages

  readonly reservedSubdomainProcessingStatus = this.reservedSubdomainService.selectProcessingStatus
  readonly reservedSubdomainIsLoading = this.reservedSubdomainService.selectLoading
  readonly reservedSubdomainFailureMessages = this.reservedSubdomainService.selectFailureMessages

  readonly domainVerified = computed(
    () => this.reservedSubdomainProcessingStatus() === ProcessingStatus.SUCCESS
  )
  readonly domainVerificationFailed = computed(
    () => this.reservedSubdomainProcessingStatus() === ProcessingStatus.FAILURE
  )
  readonly domainWasModifiedByBackend = computed(() =>
    this.requestedSubdomain() !== null
    && this.requestedSubdomain() !== this.organizationFormModel().subdomain
  )
  readonly canVerifyDomain = computed(
    () =>
      !this.reservedSubdomainIsLoading()
      && Boolean(this.organizationFormModel().subdomain)
  )

  constructor() {
    effect(() => {
      if (this.reservedSubdomainProcessingStatus() === ProcessingStatus.SUCCESS) {
        const reservedDomain = this.reservedSubdomainService.selectFirst()
        this.organizationFormModel.update(v => ({
          ...v,
          subdomain: reservedDomain?.subdomain ?? v.subdomain
        }))
      }

      if (this.organizationProcessingStatus() === ProcessingStatus.SUCCESS) {
        const createdOrganization = this.organizationService.selectFirst()
        this.sessionContextService.receiveNewOrganization(createdOrganization!)
        this.router.navigate(['../select-location'], {relativeTo: this.activatedRoute}).then()
      }
    })
  }

  ngOnInit() {
    this.reservedSubdomainService.resetProcessingStatus()
    this.organizationService.resetProcessingStatus()
  }

  resetForm() {
    this.organizationFormModel.set(CreateOrganizationFormDefinition.defaultFormModel)
    this.resetDomainVerification()
  }

  verifyDomain() {
    this.requestedSubdomain.set(this.organizationFormModel().subdomain)
    this.reservedSubdomainService.verifySubdomainAvailability(this.organizationFormModel().subdomain)
    this.organizationService.resetProcessingStatus()
  }

  createOrganization() {
    this.organizationService.post(
      CreateOrganizationFormDefinition.convertToBackendModel(this.organizationFormModel())
    )
  }

  cancel() {
    this.router.navigate(['/landing']).then()
  }

  resetDomainVerification() {
    this.requestedSubdomain.set(null)
    this.reservedSubdomainService.resetProcessingStatus()
  }
}
