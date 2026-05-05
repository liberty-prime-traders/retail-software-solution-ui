import {CurrencyPipe, NgStyle} from '@angular/common'
import {Component, computed, inject, OnInit} from '@angular/core'
import {FormField} from '@angular/forms/signals'
import {Card} from 'primeng/card'
import {DatePicker} from 'primeng/datepicker'
import {InputText} from 'primeng/inputtext'
import {Select} from 'primeng/select'
import {Tag} from 'primeng/tag'
import {PurchaseDeliveryService} from '../../../../../api/location-level/delivery/purchase-delivery.service'
import {PurchaseService} from '../../../../../api/location-level/purchase/purchase.service'
import {ContactService} from '../../../../../api/organization-level/contact/contact.service'
import {
  OrganizationUserService
} from '../../../../../api/organization-level/organization_user/organization-user.service'
import {PrettifyEnumPipe} from '../../../../../utils/pipes/prettify-enum.pipe'
import {ErrorSummaryComponent} from '../../../../reusable/error-summary/error-summary.component'
import {FormFieldComponent} from '../../../../reusable/form-field/form-field.component'
import {PaymentStatusSeverityPipe} from '../../payment-status-severity.pipe'
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
    NgStyle,
    InputText,
    PaymentStatusSeverityPipe
  ]
})
export class PurchaseFormGeneralFieldsComponent implements OnInit {
  private readonly purchaseFormContext = inject(PurchaseFormContext)
  private readonly contactService = inject(ContactService)
  private readonly organizationUserService = inject(OrganizationUserService)
  private readonly purchaseService = inject(PurchaseService)
  private readonly purchaseDeliveryService = inject(PurchaseDeliveryService)

  readonly labelColumnSize = 3

  readonly purchaseForm = this.purchaseFormContext.purchaseForm
  readonly generalFieldsForm = this.purchaseForm.generalFields
  readonly purchaseFormFields = PurchaseGeneralFieldsFormDefinition.fieldMap
  readonly suppliers = this.contactService.suppliers
  readonly users = this.organizationUserService.selectAll
  readonly isDraftOrNew = this.purchaseFormContext.isDraftOrNew

  readonly apiErrors = computed(() => {
    const errors = new Set<string>()
    this.purchaseService.selectFailureMessages().forEach(msg => errors.add(msg))
    this.purchaseDeliveryService.selectFailureMessages().forEach(msg => errors.add(msg))
    return Array.from(errors)
  })

  ngOnInit() {
    this.contactService.fetch()
    this.organizationUserService.fetch()
  }


  saveNotes() {
    if(!this.isDraftOrNew()) {
      const payload = this.purchaseFormContext.getSavableFormValue()
      if (payload.id) {
        this.purchaseService.updateNotes(payload.id, payload.notes ?? '')
      }
    }
  }
}
