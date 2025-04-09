import {CommonModule} from '@angular/common'
import {Component, inject, OnInit} from '@angular/core'
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
import {Router} from '@angular/router'
import {FormButtonsComponent} from 'lib/components/reusable/form-buttons/form-buttons.component'
import {ButtonModule} from 'primeng/button'
import {CardModule} from 'primeng/card'
import {InputTextModule} from 'primeng/inputtext'

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
export class CreateOrganizationComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder)
  private readonly router = inject(Router)

  originalDomain = ''
  isDomainVerified = false
  verificationInProgress = false
  errorMessage = ''

  readonly organizationForm = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    description: [''],
    domain: ['', [Validators.required]]
  })

  get domainControl() {
    return this.organizationForm.controls.domain
  }

  resetForm() {
    this.organizationForm.reset()
  }

  verifyDomain() {
    if (this.domainControl.invalid) return

    this.verificationInProgress = true
    this.originalDomain = this.domainControl.value

    // TODO: call actual API and handle response accordingly
    setTimeout(() => {
      /* SIMULATING API SUCCESS */
      const verifiedDomain = 'ajbiz'

      if (verifiedDomain === this.originalDomain) {
        this.errorMessage = ''
      }

      this.organizationForm.patchValue({ domain: verifiedDomain })

      this.isDomainVerified = true
      this.verificationInProgress = false

      /* SIMULATING API ERROR */
      // this.errorMessage = 'Domain verification failed'
      // this.verificationInProgress = false
    }, 1500)
  }

  createOrganization() {
    if (!this.isDomainVerified || this.organizationForm.invalid) return
    
    // TODO: call actual API and handle response accordingly
    console.log(this.organizationForm.getRawValue())

    /* SIMULATING API SUCCESS */
    this.router.navigate(['/landing', 'new-org', 'locations'])
  }

  cancel() {
    this.router.navigate(['/landing'])
  }

  ngOnInit() {
    this.domainControl.valueChanges.subscribe(currentValue => {
      if (this.isDomainVerified && this.originalDomain !== currentValue) {
        this.isDomainVerified = false
      }
    })
  }
}
