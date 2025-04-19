import {CommonModule} from '@angular/common'
import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core'
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
import {Router} from '@angular/router'
import {ButtonModule} from 'primeng/button'
import {CardModule} from 'primeng/card'
import {InputTextModule} from 'primeng/inputtext'
import {Subscription} from 'rxjs'
import {tap} from 'rxjs/operators'
import {Organization} from '../../../../api/organization/organization.model'
import {OrganizationService} from '../../../../api/organization/organization.service'
import {ReservedSubdomainService} from '../../../../api/reserved-subdomain/reserved-subdomain.service'
import {LocalStorageService} from '../../../../utils/services/local-storage.service'
import {LocalStorageKey} from '../../../../utils/types/local-storage-key.enum'
import {ProcessingStatus} from '../../../../utils/types/processing-status.enum'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldDirection} from '../../../reusable/form-field/form-field-direction'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {HasSubscriptionComponent} from '../../../reusable/has-subscription.component'

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
    FormFieldComponent
  ]
})
export class CreateOrganizationComponent extends HasSubscriptionComponent implements OnInit, OnDestroy {
  private readonly formBuilder = inject(FormBuilder)
  private readonly router = inject(Router)
  private readonly reservedSubdomainService = inject(ReservedSubdomainService)
  private readonly organizationService = inject(OrganizationService)
  private readonly localStorageService = inject(LocalStorageService)

  readonly ProcessingStatus = ProcessingStatus
  readonly FormFieldDirection = FormFieldDirection

  requestedSubdomain = signal<string|null>(null)

  readonly organizationForm = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    description: [''],
    subdomain: ['', [Validators.required]]
  })

  get domainControl() {
    return this.organizationForm.controls.subdomain
  }

  readonly organizationProcessingStatus$ = this.organizationService.processingStatus$()
  readonly organizationServiceFailureMessages$ = this.organizationService.failureMessages$()
  readonly selectFirstOrganization$ = this.organizationService.selectFirst$()

  readonly reservedSubdomainProcessingStatus$ = this.reservedSubdomainService.processingStatus$()
  readonly reservedSubdomainProcessingIsUnderWay$ = this.reservedSubdomainService.processingIsUnderWay$()
  readonly reservedSubdomainFailureMessages$ = this.reservedSubdomainService.failureMessages$()
  readonly selectFirstReservedSubdomain$ = this.reservedSubdomainService.selectFirst$()

  ngOnInit() {
    this.reservedSubdomainService.resetProcessingStatus()
    this.organizationService.resetProcessingStatus()
    this.subscriptions.add(this.listenToDomainChanges())
    this.subscriptions.add(this.listenToDomainReservationCompletion())
    this.subscriptions.add(this.receiveCreatedOrganization())
  }

  resetForm() {
    this.organizationForm.reset()
  }

  verifyDomain() {
    this.requestedSubdomain.set(this.domainControl.value)
    this.reservedSubdomainService.removeEntities()
    this.reservedSubdomainService.post(undefined, this.domainControl.value)
  }

  createOrganization() {
    this.organizationService.post(this.organizationForm.getRawValue())
  }

  cancel() {
    this.router.navigate(['/landing']).then()
  }

  private listenToDomainChanges(): Subscription {
    return this.domainControl.valueChanges.pipe(
      tap(() => this.reservedSubdomainService.resetProcessingStatus())
    ).subscribe()
  }

  private listenToDomainReservationCompletion(): Subscription {
    return this.selectFirstReservedSubdomain$.pipe(
      tap((verifiedDomain) =>
        this.organizationForm.patchValue({subdomain: verifiedDomain.subdomain})
      )
    ).subscribe()
  }

  private receiveCreatedOrganization(): Subscription {
    return this.selectFirstOrganization$.pipe(
      tap((organization) => {
        this.localStorageService.setItem<Organization>(LocalStorageKey.ORGANIZATION, organization)
        this.router.navigate(['/landing', this.domainControl.value, 'select-location']).then()
      })
    ).subscribe()
  }
}
