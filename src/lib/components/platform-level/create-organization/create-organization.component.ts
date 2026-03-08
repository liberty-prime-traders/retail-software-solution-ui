import {Component, computed, effect, inject, OnInit, signal} from '@angular/core'
import {form, FormField} from '@angular/forms/signals'
import {ActivatedRoute, Router, RouterLink} from '@angular/router'
import {BlockUI} from 'primeng/blockui'
import {ButtonModule} from 'primeng/button'
import {CardModule} from 'primeng/card'
import {InputTextModule} from 'primeng/inputtext'
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
    ButtonModule,
    InputTextModule,
    CardModule,
    FormButtonsComponent,
    FormFieldComponent,
    RouterLink,
    BlockUI,
    FormField,
  ]
})
export class CreateOrganizationComponent implements OnInit {
  private readonly router = inject(Router)
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly reservedSubdomainService = inject(ReservedSubdomainService)
  private readonly organizationService = inject(OrganizationService)
  private readonly sessionContextService = inject(SessionContextService)

  readonly FormFieldDirection = FormFieldDirection
  readonly formFields = CreateOrganizationFormDefinition.fieldMap

  readonly requestedSubdomain = signal<string | null>(null)

  readonly formValue = signal<CreateOrganizationFormDefinition.CreateOrganizationFormModel>(
    CreateOrganizationFormDefinition.defaultFormModel
  )

  readonly organizationForm = form(this.formValue, CreateOrganizationFormDefinition.formSchema)

  readonly organizationProcessingStatus = this.organizationService.selectProcessingStatus
  readonly organizationIsLoading = this.organizationService.selectLoading
  readonly organizationFailureMessages = this.organizationService.selectFailureMessages

  readonly reservedSubdomainProcessingStatus = this.reservedSubdomainService.selectProcessingStatus
  readonly reservedSubdomainIsLoading = this.reservedSubdomainService.selectLoading
  readonly reservedSubdomainFailureMessages = this.reservedSubdomainService.selectFailureMessages

  readonly domainVerified = computed(() => this.reservedSubdomainProcessingStatus() === ProcessingStatus.SUCCESS)
  readonly domainVerificationFailed = computed(() => this.reservedSubdomainProcessingStatus() === ProcessingStatus.FAILURE)
  readonly domainWasModifiedByBackend = computed(() =>
    this.requestedSubdomain() !== null && this.requestedSubdomain() !== this.formValue().subdomain
  )
  readonly canVerifyDomain = computed(() => !this.reservedSubdomainIsLoading() && !!this.formValue().subdomain)

  constructor() {
    effect(() => {
      if (this.reservedSubdomainProcessingStatus() === ProcessingStatus.SUCCESS) {
        const reservedDomain = this.reservedSubdomainService.selectFirst()
        this.formValue.update(v => ({...v, subdomain: reservedDomain?.subdomain ?? v.subdomain}))
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
    this.organizationForm().reset(CreateOrganizationFormDefinition.defaultFormModel)
  }

  verifyDomain() {
    this.requestedSubdomain.set(this.formValue().subdomain)
    this.reservedSubdomainService.verifySubdomainAvailability(this.formValue().subdomain)
    this.organizationService.resetProcessingStatus()
  }

  createOrganization() {
    this.organizationService.post(CreateOrganizationFormDefinition.convertToBackendModel(this.formValue()))
  }

  cancel() {
    this.router.navigate(['/landing']).then()
  }

  resetDomainVerification() {
    this.requestedSubdomain.set(null)
    this.reservedSubdomainService.resetProcessingStatus()
  }
}
