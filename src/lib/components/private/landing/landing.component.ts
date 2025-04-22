import {CommonModule} from '@angular/common'
import {Component, inject, OnInit} from '@angular/core'
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
import {Router, RouterLink} from '@angular/router'
import {SysUserService} from 'lib/api/sys-user/sys-user.service'
import {FormButtonsComponent} from 'lib/components/reusable/form-buttons/form-buttons.component'
import {RtsOktaService} from 'lib/utils/services/rts-okta.service'
import {UserRole} from 'lib/utils/types/user-role.enum'
import {Button} from 'primeng/button'
import {Card} from 'primeng/card'
import {InputText} from 'primeng/inputtext'
import {Organization} from '../../../api/organization/organization.model'
import {LocalStorageService} from '../../../utils/services/local-storage.service'
import {LocalStorageKey} from '../../../utils/types/local-storage-key.enum'

@Component({
  selector: 'rts-landing',
  templateUrl: 'landing.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Button,
    InputText,
    RouterLink,
    Card,
    FormButtonsComponent
  ]
})
export class LandingComponent implements OnInit {
  private readonly userService = inject(SysUserService)
  private readonly router = inject(Router)
  private readonly localStorageService = inject(LocalStorageService)

  private readonly rtsOktaService = inject(RtsOktaService)
  readonly hasCreateRole$ = this.rtsOktaService.hasRole$(UserRole.ROLE_CREATE_ORGANIZATION)

  errorMessage = 'Error Message here'

  ngOnInit() {
    this.userService.post()
    this.proceedToOrganizationIfStored()
  }

  private readonly formBuilder = inject(FormBuilder)

  readonly organizationDomainForm = this.formBuilder.nonNullable.group({
    domain: [null, Validators.required]
  })

  submitOrganization() {
    // TODO: Implement the logic to submit the organization domain
  }

  private proceedToOrganizationIfStored() {
    const storedOrganization = this.localStorageService.getItem<Organization>(LocalStorageKey.ORGANIZATION)
    if (storedOrganization?.subdomain){
      this.router.navigate(['/landing', storedOrganization?.subdomain, 'select-location']).then()
    }
  }
}
