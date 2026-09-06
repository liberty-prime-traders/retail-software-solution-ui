import {inject, Injectable, signal} from '@angular/core'
import {Router} from '@angular/router'
import {MessageService} from 'primeng/api'
import {finalize, of} from 'rxjs'
import {catchError, tap} from 'rxjs/operators'
import {LocationService} from '../../../../api/organization-level/location/location.service'
import {
  OrganizationLaunchResponse
} from '../../../../api/platform-level/organization/organization-launch-response.model'
import {OrganizationService} from '../../../../api/platform-level/organization/organization.service'
import {parseError} from '../../../../utils/errors'
import {SessionContextService} from '../../../../utils/services/session-context.service'
import {UserContextService} from '../../../../utils/services/user-context.service'

@Injectable()
export class OrganizationLaunchService {
  private readonly messageService = inject(MessageService)
  private readonly userContextService = inject(UserContextService)
  private readonly router = inject(Router)
  private readonly sessionContextService = inject(SessionContextService)
  private readonly organizationService = inject(OrganizationService)
  private readonly locationService = inject(LocationService)

  private readonly _errorMessages = signal<string[] | undefined>(undefined)
  private readonly _launchingInProgress = signal(false)
  readonly launchingInProgress = this._launchingInProgress.asReadonly()
  readonly errorMessages = this._errorMessages.asReadonly()

  launchOrganization(domain?: string) {
    if (!domain || this.launchingInProgress()) return
    this._launchingInProgress.set(true)
    this._errorMessages.set(undefined)
    this.organizationService.attemptLaunch$(domain).pipe(
      tap((response) => this.handleResponse(response)),
      catchError((error) => {
        this._errorMessages.set(parseError(error) ?? ['Failed to process organization launch'])
        return of(null)
      }),
      finalize(() => this._launchingInProgress.set(false))
    ).subscribe()
  }

  private handleResponse(launchResponse: OrganizationLaunchResponse) {
    if (launchResponse.accessRequested || !launchResponse.organization) {
      this.messageService.add({
        severity: 'success',
        summary: 'Request Submitted',
        detail: 'Your request to join the organization has been successfully submitted'
      })
    } else {
      this.sessionContextService.selectOrganization(launchResponse.organization)
      this.proceedToSelectedOrganization()
      this.router.navigate(['/secure/manage-organization']).then()
    }
  }

  proceedToSelectedOrganization() {
    if (this.sessionContextService.selectedOrganization()){
      this.userContextService.checkOrganizationAdminStatus()
      this.locationService.fetch()
    }
  }
}
