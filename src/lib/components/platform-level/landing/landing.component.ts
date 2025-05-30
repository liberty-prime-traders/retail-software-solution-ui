import {CommonModule} from '@angular/common'
import {Component, computed, inject, OnInit, signal} from '@angular/core'
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
import {ActivatedRoute, Router, RouterLink} from '@angular/router'
import {Card} from 'primeng/card'
import {InputText} from 'primeng/inputtext'
import {filter, finalize, of} from 'rxjs'
import {catchError, tap} from 'rxjs/operators'
import {OrganizationLaunchResponse} from '../../../api/join-request/organization-launch-response.model'
import {OrganizationAdminService} from '../../../api/organization-admin/organization-admin.service'
import {Organization} from '../../../api/organization/organization.model'
import {SysUserService} from '../../../api/sys-user/sys-user.service'
import {parseError} from '../../../utils/error.util'
import {LocalStorageService} from '../../../utils/services/local-storage.service'
import {RtsOktaService} from '../../../utils/services/rts-okta.service'
import {SessionContextService} from '../../../utils/services/session-context.service'
import {LocalStorageKey} from '../../../utils/types/local-storage-key.enum'
import {UserRole} from '../../../utils/types/user-role.enum'
import {ProcessingStatus} from '../../../utils/types/processing-status.enum'
import {FormButtonsComponent} from '../../reusable/form-buttons/form-buttons.component'
import {HasSubscriptionComponent} from '../../reusable/has-subscription.component'
import {OrganizationService} from '../../../api/organization/organization.service'
import {MessageService} from 'primeng/api'

@Component({
  selector: 'rts-landing',
  templateUrl: 'landing.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputText,
    RouterLink,
    Card,
    FormButtonsComponent
  ]
})
export class LandingComponent extends HasSubscriptionComponent implements OnInit {
  private readonly userService = inject(SysUserService)
  private readonly router = inject(Router)
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly sessionContextService = inject(SessionContextService)
  private readonly localStorageService = inject(LocalStorageService)
  private readonly organizationAdminService = inject(OrganizationAdminService)
  private readonly organizationService = inject(OrganizationService)
  private readonly messageService = inject(MessageService)

  private readonly rtsOktaService = inject(RtsOktaService)
  readonly hasCreateRole$ = this.rtsOktaService.hasRole$(UserRole.ROLE_CREATE_ORGANIZATION)

  readonly ProcessingStatus = ProcessingStatus

  readonly launchingInProgress = signal(false)
  readonly errorMessages = signal<string[] | null>(null)

  readonly processingStatus = computed(() =>
    this.launchingInProgress() ? ProcessingStatus.IN_PROGRESS : ProcessingStatus.IDLE
  )

  ngOnInit() {
    this.userService.post()
    this.proceedToSelectLocation()
  }

  private readonly formBuilder = inject(FormBuilder)

  readonly organizationDomainForm = this.formBuilder.nonNullable.group({
    domain: ['', Validators.required]
  })

  submitOrganization() {
    if (this.organizationDomainForm.invalid || this.launchingInProgress()) return
    this.launchingInProgress.set(true)
    this.errorMessages.set(null)
    this.subscriptions.add(
      this.organizationService.attemptLaunch$(this.organizationDomainForm.value.domain!).pipe(
        tap((response) => this.launchOrganization(response)),
        catchError((error) => {
          this.errorMessages.set(parseError(error) ?? ['Failed to process organization launch'])
          return of(null)
        }),
        finalize(() => {
          this.launchingInProgress.set(false)
        })
      )
        .subscribe()
    )
  }

  private launchOrganization(launchResponse: OrganizationLaunchResponse) {
    if (!launchResponse.accessRequested) {
      this.localStorageService.setItem(LocalStorageKey.ORGANIZATION, launchResponse.organization)
      this.proceedToSelectLocation()
    } else {
      this.messageService.add({
        severity: 'success',
        summary: 'Request Submitted',
        detail: 'Your request to join the organization has been successfully submitted'
      })
    }
  }
  
  private proceedToSelectLocation() {
    const storedOrganization = this.localStorageService.getItem<Organization>(LocalStorageKey.ORGANIZATION)
    if (storedOrganization?.subdomain){
      this.sessionContextService.updateSelectedOrganization(storedOrganization)
      this.router.navigate(['select-location'], {relativeTo: this.activatedRoute}).then()
      this.checkIfUserIsOrganizationAdmin()
    }
  }

  private checkIfUserIsOrganizationAdmin() {
    return this.organizationAdminService.isOrganizationAdmin$().pipe(
      filter(isAdmin => Boolean(isAdmin)),
      tap(() => this.sessionContextService.promoteToOrganizationAdmin())
    )
      .subscribe()
  }
}
