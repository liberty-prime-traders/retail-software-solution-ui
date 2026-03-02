import {CurrencyPipe, DatePipe, NgStyle} from '@angular/common'
import {Component, inject, OnInit} from '@angular/core'
import {FormField} from '@angular/forms/signals'
import {Card} from 'primeng/card'
import {DatePicker} from 'primeng/datepicker'
import {InputText} from 'primeng/inputtext'
import {Select} from 'primeng/select'
import {Tag} from 'primeng/tag'
import {ContactService} from '../../../../../api/organization-level/contact/contact.service'
import {
  OrganizationUserService
} from '../../../../../api/organization-level/organization_user/organization-user.service'
import {PrettifyEnumPipe} from '../../../../../utils/pipes/prettify-enum.pipe'
import {ErrorSummaryComponent} from '../../../../reusable/error-summary/error-summary.component'
import {FormFieldComponent} from '../../../../reusable/form-field/form-field.component'
import {PurchaseStatusSeverityPipe} from '../../purchase-status-severity.pipe'
import {PurchaseFormContext} from '../form-utils/purchase-form-context'
import {PurchaseGeneralFieldsFormDefinition} from '../form-utils/purchase-general-fields-form.definition'

@Component({
  selector: 'rts-purchase-form-general-fields',
  templateUrl: './general-fields.component.html',
  imports: [
    FormFieldComponent,
    Tag,
    Card,
    ErrorSummaryComponent,
    DatePicker,
    Select,
    FormField,
    PurchaseStatusSeverityPipe,
    PrettifyEnumPipe,
    CurrencyPipe,
    DatePipe,
    NgStyle,
    InputText

  ]
})
export class PurchaseFormGeneralFieldsComponent implements OnInit {
  private readonly purchaseFormContext = inject(PurchaseFormContext)
  private readonly contactService = inject(ContactService)
  private readonly organizationUserService = inject(OrganizationUserService)

  readonly purchaseForm = this.purchaseFormContext.purchaseForm

  readonly labelColumnSize = 3
  readonly generalFieldsForm = this.purchaseForm.generalFields

  readonly purchaseFormFields = PurchaseGeneralFieldsFormDefinition.fieldMap
  readonly suppliers = this.contactService.suppliers
  readonly users = this.organizationUserService.selectAll

  ngOnInit() {
    this.contactService.fetch()
    this.organizationUserService.fetch()
  }
}
