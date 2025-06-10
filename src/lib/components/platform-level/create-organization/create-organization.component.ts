import {CommonModule} from '@angular/common'
import {Component, effect, inject, OnInit, Signal, signal} from '@angular/core'
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
import {ActivatedRoute, Router, RouterLink} from '@angular/router'
import {BlockUI} from 'primeng/blockui'
import {ButtonModule} from 'primeng/button'
import {CardModule} from 'primeng/card'
import {InputTextModule} from 'primeng/inputtext'
import {distinctUntilChanged, filter, Subscription} from 'rxjs'
import {tap} from 'rxjs/operators'
import {OrganizationService} from '../../../api/organization/organization.service'
import {ReservedSubdomainService} from '../../../api/reserved-subdomain/reserved-subdomain.service'
import {SessionContextService} from '../../../utils/services/session-context.service'
import {ProcessingStatus} from '../../../utils/types/processing-status.enum'
import {FormButtonsComponent} from '../../reusable/form-buttons/form-buttons.component'
import {FormFieldDirection} from '../../reusable/form-field/form-field-direction'
import {FormFieldComponent} from '../../reusable/form-field/form-field.component'
import {HasSubscriptionComponent} from '../../reusable/has-subscription.component'

@Component({
  selector: 'rts-create-organization',
  templateUrl: 'create-organization.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    FormButtonsComponent,
    FormFieldComponent,
    RouterLink,
    BlockUI
  ]
})
export class CreateOrganizationComponent extends HasSubscriptionComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder)
  private readonly router = inject(Router)
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly reservedSubdomainService = inject(ReservedSubdomainService)
  private readonly organizationService = inject(OrganizationService)
  private readonly sessionContextService = inject(SessionContextService)

  readonly ProcessingStatus = ProcessingStatus
  readonly FormFieldDirection = FormFieldDirection

  readonly requestedSubdomain = signal<string|null>(null)

  readonly organizationForm = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    description: [''],
    subdomain: ['', [Validators.required]]
  })

  get domainControl() {
    return this.organizationForm.controls.subdomain
  }

  readonly organizationProcessingStatus = this.organizationService.selectProcessingStatus
  readonly organizationServiceFailureMessages = this.organizationService.selectFailureMessages
  readonly organizationIsLoading: Signal<boolean> = this.organizationService.selectLoading

  readonly reservedSubdomainProcessingStatus = this.reservedSubdomainService.selectProcessingStatus
  readonly reservedSubdomainIsLoading: Signal<boolean> = this.reservedSubdomainService.selectLoading
  readonly reservedSubdomainFailureMessages: Signal<string[]> = this.reservedSubdomainService.selectFailureMessages

  constructor() {
    super()
    effect(() => {
      if (this.reservedSubdomainProcessingStatus() === ProcessingStatus.SUCCESS) {
        const reservedDomain = this.reservedSubdomainService.selectFirst()
        this.organizationForm.patchValue({subdomain: reservedDomain?.subdomain}, {emitEvent: false})
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
    this.subscriptions.add(this.listenToDomainChanges())
  }

  resetForm() {
    this.organizationForm.reset()
  }

  verifyDomain() {
    this.requestedSubdomain.set(this.domainControl.value)
    this.reservedSubdomainService.refetch({suggestedSubdomain: this.domainControl.value, pathSuffix: 'verify'})
  }

  createOrganization() {
    this.organizationService.post(this.organizationForm.getRawValue())
  }

  cancel() {
    this.router.navigate(['/landing']).then()
  }

  private listenToDomainChanges(): Subscription {
    return this.domainControl.valueChanges.pipe(
      filter(Boolean),
      distinctUntilChanged(),
      tap(() => this.reservedSubdomainService.resetProcessingStatus())
    ).subscribe()
  }
}
