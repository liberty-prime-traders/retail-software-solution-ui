import {CommonModule} from '@angular/common'
import {Component, computed, inject, OnInit} from '@angular/core'
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
import {RouterLink} from '@angular/router'
import {Card} from 'primeng/card'
import {InputText} from 'primeng/inputtext'
import {UserContextService} from '../../../utils/services/auth/user-context.service'
import {SessionContextService} from '../../../utils/services/session-context.service'
import {ProcessingStatus} from '../../../utils/types/processing-status.enum'
import {ErrorSummaryComponent} from '../../reusable/error-summary/error-summary.component'
import {FormButtonsComponent} from '../../reusable/form-buttons/form-buttons.component'
import {HasSubscriptionComponent} from '../../reusable/has-subscription.component'
import {NavigationScope} from '../../welcome/top-navigation/navigation-scope.model'
import {
  OrganizationLaunchService
} from '../../welcome/top-navigation/organization-nav-content/organization-launch.service'

@Component({
  selector: 'rts-landing',
  templateUrl: 'landing.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputText,
    RouterLink,
    Card,
    FormButtonsComponent,
    ErrorSummaryComponent
  ]
})
export class LandingComponent extends HasSubscriptionComponent implements OnInit {

  private readonly sessionContextService = inject(SessionContextService)
  private readonly organizationLaunchService = inject(OrganizationLaunchService)
  private readonly userContextService = inject(UserContextService)

  readonly ProcessingStatus = ProcessingStatus

  readonly canCreateOrganization = this.userContextService.canCreateOrganization
  readonly errorMessages = this.organizationLaunchService.errorMessages
  readonly launchingInProgress = this.organizationLaunchService.launchingInProgress

  readonly processingStatus = computed(() =>
    this.launchingInProgress() ? ProcessingStatus.IN_PROGRESS : ProcessingStatus.IDLE
  )

  ngOnInit() {
    if (this.sessionContextService.selectedScope()) {
      this.organizationLaunchService.launchOrganization(
        this.sessionContextService.selectedOrganization()?.subdomain
      )
    } else {
      this.sessionContextService.markAsSelectedScope(NavigationScope.LANDING)
    }
  }

  private readonly formBuilder = inject(FormBuilder)

  readonly organizationDomainForm = this.formBuilder.nonNullable.group({
    domain: ['', Validators.required]
  })

  launchOrganization() {
    if (this.organizationDomainForm.invalid || this.launchingInProgress()) return
    this.organizationLaunchService.launchOrganization(this.organizationDomainForm.value.domain!)
  }

}
