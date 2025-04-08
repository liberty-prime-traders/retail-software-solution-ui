import {CommonModule} from '@angular/common';
import {Component, inject} from '@angular/core'
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {FormButtonsComponent} from 'lib/components/reusable/form-buttons/form-buttons.component';
import {Button} from 'primeng/button';
import {Card} from 'primeng/card';
import {InputText} from 'primeng/inputtext';

@Component({
  standalone: true,
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
export class LandingComponent {
  private readonly formBuilder = inject(FormBuilder)

  errorMessage = 'Error Message here'
  hasCreateRole = true

  readonly organizationDomainForm = this.formBuilder.nonNullable.group({
    domain: [null, Validators.required]
  })

  resetForm() {
    this.organizationDomainForm.reset()
  }

  submitOrganization() {
    const formvalue = this.organizationDomainForm.getRawValue()
    console.log(formvalue)
  }
}
