import {Component, computed, inject, output} from '@angular/core'
import {Router} from '@angular/router'
import {Divider} from 'primeng/divider'
import {SessionContextService} from '../../../../utils/services/session-context.service'
import {ErrorSummaryComponent} from '../../../reusable/error-summary/error-summary.component'
import {LoadingContainerComponent} from '../../../reusable/loading-container/loading-container.component'
import {OrganizationLaunchService} from './organization-launch.service'

@Component({
  selector: 'rts-organization-nav-content',
  templateUrl: 'organization-nav-content.component.html',
  imports: [
    Divider,
    LoadingContainerComponent,
    ErrorSummaryComponent
  ]
})
export class OrganizationNavContentComponent {
  private readonly sessionContextService = inject(SessionContextService)
  private readonly router = inject(Router)
  private readonly organizationLaunchService = inject(OrganizationLaunchService)

  readonly closePopOver = output()

  readonly knownOrganizations = this.sessionContextService.knownOrganizations
  readonly selectedOrgId = computed(() => this.sessionContextService.selectedOrganization()?.id)
  readonly launchingInProgress = this.organizationLaunchService.launchingInProgress
  readonly errorMessages = this.organizationLaunchService.errorMessages

  navigateToManualOrgSelection() {
    this.sessionContextService.clearSelectedOrganization()
    this.closePopOver.emit()
    this.router.navigate(['/secure']).then()
  }

  launchOrganization(domain?: string) {
    this.organizationLaunchService.launchOrganization(domain)
    setTimeout(() => window.location.reload(), 200)
  }
}
