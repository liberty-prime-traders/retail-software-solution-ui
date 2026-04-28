
import {Component, effect, inject, OnInit} from '@angular/core'
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
import {MessageService} from 'primeng/api'
import {ButtonModule} from 'primeng/button'
import {CardModule} from 'primeng/card'
import {Divider} from 'primeng/divider'
import {InputTextModule} from 'primeng/inputtext'
import {SeedDataApplierService} from '../../../api/organization-level/org-profile/seed-data-applier.service'
import {OrganizationService} from '../../../api/platform-level/organization/organization.service'
import {SessionContextService} from '../../../utils/services/session-context.service'
import {ProcessingStatus} from '../../../utils/types/processing-status.enum'
import {FormButtonsComponent} from '../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../reusable/form-field/form-field.component'

@Component({
  selector: 'rts-update-organization',
  templateUrl: 'organization-profile.component.html',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    FormButtonsComponent,
    FormFieldComponent,
    Divider
  ],
  standalone: true
})
export class OrganizationProfileComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder)
  private readonly organizationService = inject(OrganizationService)
  private readonly sessionContextService = inject(SessionContextService)
  private readonly seedDataApplierService = inject(SeedDataApplierService)
  private readonly messageService = inject(MessageService)

  readonly reloadInitialDataInProgress = this.seedDataApplierService.isLoading
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
        this.sessionContextService.selectOrganization(updatedOrganization!, false)
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

  applySeedData() {
    this.seedDataApplierService.applySeedData({
      onSuccess: () => this.messageService.add({
        summary: 'Success',
        detail: 'Request completed with success',
        severity: 'success'
      }),
      onFail: (error) => this.messageService.add({
        summary: 'Error',
        detail: 'Request failed',
        severity: 'error'
      })
    })
  }
}
