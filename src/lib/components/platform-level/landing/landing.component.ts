import {CommonModule} from '@angular/common'
import {Component, inject, OnInit} from '@angular/core'
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
import {ActivatedRoute, Router, RouterLink} from '@angular/router'
import {Card} from 'primeng/card'
import {InputText} from 'primeng/inputtext'
import {filter} from 'rxjs'
import {tap} from 'rxjs/operators'
import {OrganizationAdminService} from '../../../api/organization-admin/organization-admin.service'
import {Organization} from '../../../api/organization/organization.model'
import {SysUserService} from '../../../api/sys-user/sys-user.service'
import {LocalStorageService} from '../../../utils/services/local-storage.service'
import {RtsOktaService} from '../../../utils/services/rts-okta.service'
import {SessionContextService} from '../../../utils/services/session-context.service'
import {LocalStorageKey} from '../../../utils/types/local-storage-key.enum'
import {UserRole} from '../../../utils/types/user-role.enum'
import {FormButtonsComponent} from '../../reusable/form-buttons/form-buttons.component'
import {HasSubscriptionComponent} from '../../reusable/has-subscription.component'

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

  private readonly rtsOktaService = inject(RtsOktaService)
  readonly hasCreateRole$ = this.rtsOktaService.hasRole$(UserRole.ROLE_CREATE_ORGANIZATION)

  errorMessage = 'Error Message here'

  ngOnInit() {
    this.userService.post()
    this.proceedToSelectLocation()
  }

  private readonly formBuilder = inject(FormBuilder)

  readonly organizationDomainForm = this.formBuilder.nonNullable.group({
    domain: [null, Validators.required]
  })

  submitOrganization() {
    // TODO: Implement the logic to submit the organization domain
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
      tap(() => this.sessionContextService.promoteToOrganizationAdmin()),
    ).subscribe()
  }
}
