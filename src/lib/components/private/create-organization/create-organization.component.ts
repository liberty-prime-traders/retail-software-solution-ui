import {CommonModule} from '@angular/common'
import {Component, inject, OnDestroy, OnInit} from '@angular/core'
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
import {Router} from '@angular/router'
import {LocalStorageService} from 'lib/utils/services/local-storage.service'
import {Organization} from 'lib/api/organization/organization.model'
import {OrganizationService} from 'lib/api/organization/organization.service'
import {ReservedSubdomainService} from 'lib/api/reserved-subdomain/reserved-subdomain.service'
import {FormButtonsComponent} from 'lib/components/reusable/form-buttons/form-buttons.component'
import {ProcessingStatus} from 'lib/utils/types/processing-status.enum'
import {ButtonModule} from 'primeng/button'
import {CardModule} from 'primeng/card'
import {InputTextModule} from 'primeng/inputtext'
import {Subject, takeUntil} from 'rxjs'
import {LocalStorageKey} from 'lib/utils/types/local-storage-key.enum'

@Component({
  standalone: true,
  selector: 'rts-create-organization',
  templateUrl: 'create-organization.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    FormButtonsComponent
  ]
})
export class CreateOrganizationComponent implements OnInit, OnDestroy {
  private readonly formBuilder = inject(FormBuilder)
  private readonly router = inject(Router)
  private readonly reservedSubdomainService = inject(ReservedSubdomainService)
  private readonly organizationService = inject(OrganizationService)
  private readonly localStorageService = inject(LocalStorageService)

  readonly ProcessingStatus = ProcessingStatus

  originalDomain = ''

  readonly organizationForm = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    description: [''],
    subdomain: ['', [Validators.required]]
  })

  get domainControl() {
    return this.organizationForm.controls.subdomain
  }

  readonly processingStatus$ = this.organizationService.processingStatus$()
  readonly processingIsUnderWay$ = this.organizationService.processingIsUnderWay$()
  readonly failureMessages$ = this.organizationService.failureMessages$()
  readonly selectFirst$ = this.organizationService.selectFirst$()
  
  readonly reservedSubdomainProcessingStatus$ = this.reservedSubdomainService.processingStatus$()
  readonly reservedSubdomainProcessingIsUnderWay$ = this.reservedSubdomainService.processingIsUnderWay$()
  readonly reservedSubdomainFailureMessages$ = this.reservedSubdomainService.failureMessages$()
  readonly selectFirstReservedSubdomain$ = this.reservedSubdomainService.selectFirst$()

  private destroy$ = new Subject<void>()

  ngOnInit() {
    this.reservedSubdomainService.resetProcessingStatus()
    this.organizationService.resetProcessingStatus()

    this.domainControl.valueChanges
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.reservedSubdomainService.resetProcessingStatus()
      })

    this.selectFirstReservedSubdomain$
      .pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (verifiedDomain => {
          this.reservedSubdomainService.resetProcessingStatus()
          this.organizationForm.patchValue({ subdomain: verifiedDomain.subdomain })
        })
      })

    this.selectFirst$
      .pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: ((organization) => {
          if (this.domainControl.value) {
            this.localStorageService.setItem<Organization>(LocalStorageKey.ORGANIZATION, organization)
            this.router.navigate(['/landing', this.domainControl.value, 'locations'])
          }
        })
      })
  }

  resetForm() {
    this.organizationForm.reset()
  }

  verifyDomain() {
    this.originalDomain = this.domainControl.value
    
    this.reservedSubdomainService.removeEntities()
    this.reservedSubdomainService.post(undefined, this.domainControl.value)
  }

  createOrganization() {
    this.organizationService.post(this.organizationForm.getRawValue())
  }

  cancel() {
    this.router.navigate(['/landing'])
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
