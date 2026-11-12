import {Component, computed, inject, input, OnInit, output, signal} from '@angular/core'
import {form, FormField} from '@angular/forms/signals'
import {DatePicker} from 'primeng/datepicker'
import {InputNumber} from 'primeng/inputnumber'
import {InputText} from 'primeng/inputtext'
import {Select} from 'primeng/select'
import {SelectButton} from 'primeng/selectbutton'
import {
  ContactSubledgerDirection
} from '../../../../../api/organization-level/contact-opening-balance/contact-subledger-direction.enum'
import {
  ContactOpeningSettlementService
} from '../../../../../api/organization-level/contact-opening-settlement/contact-opening-settlement.service'
import {Contact} from '../../../../../api/organization-level/contact/contact.model'
import {PaymentOptionService} from '../../../../../api/organization-level/payment-option/payment-option.service'
import {getToday} from '../../../../../utils/dates'
import {CurrencyCodeProviderService} from '../../../../../utils/services/currency-code-provider.service'
import {BaseFormComponent} from '../../../../reusable/base-form.component'
import {FormButtonsComponent} from '../../../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../../../reusable/form-field/form-field.component'
import {ContactOpeningSettlementFormDefinition} from './contact-opening-settlement-form.definition'

@Component({
  selector: 'rts-contact-opening-settlement-form',
  templateUrl: 'contact-opening-settlement-form.component.html',
  imports: [
    FormField,
    FormButtonsComponent,
    FormFieldComponent,
    DatePicker,
    InputNumber,
    InputText,
    Select,
    SelectButton
  ]
})
export class ContactOpeningSettlementFormComponent
  extends BaseFormComponent<ContactOpeningSettlementService> implements OnInit {

  private readonly contactOpeningSettlementService = inject(ContactOpeningSettlementService)
  private readonly paymentOptionService = inject(PaymentOptionService)
  protected override readonly apiService = this.contactOpeningSettlementService
  readonly currencyCodeProviderService = inject(CurrencyCodeProviderService)

  readonly contact = input.required<Contact>()
  readonly receivableOutstanding = input.required<number>()
  readonly payableOutstanding = input.required<number>()
  readonly settlementRecorded = output<void>()

  readonly paymentOptions = this.paymentOptionService.selectAll
  readonly paymentOptionsLoading = this.paymentOptionService.selectLoading
  readonly today = getToday()
  readonly fieldMap = ContactOpeningSettlementFormDefinition.fieldMap

  readonly formValue = signal<ContactOpeningSettlementFormDefinition.FormModel>(
    ContactOpeningSettlementFormDefinition.createDefaultFormModel(null)
  )

  readonly selectedOutstanding = computed(() => this.outstandingFor(this.formValue().subledgerDirection))

  readonly settlementForm = form(
    this.formValue,
    ContactOpeningSettlementFormDefinition.createFormSchema(
      (subledgerDirection) => this.outstandingFor(subledgerDirection)
    )
  )

  readonly directionOptions = [
    {label: 'They paid us', value: ContactSubledgerDirection.RECEIVABLE},
    {label: 'We paid them', value: ContactSubledgerDirection.PAYABLE}
  ]

  override ngOnInit() {
    super.ngOnInit()
    this.paymentOptionService.fetch()
    this.resetForm()
  }

  resetForm() {
    this.settlementForm().reset(
      ContactOpeningSettlementFormDefinition.createDefaultFormModel(this.defaultDirection())
    )
  }

  save() {
    this.contactOpeningSettlementService.recordSettlement(
      ContactOpeningSettlementFormDefinition.convertToRequest(String(this.contact().id), this.formValue()),
      {onSuccess: () => this.settlementRecorded.emit()}
    )
  }

  private defaultDirection(): ContactSubledgerDirection {
    const onlyWeOweThem = this.receivableOutstanding() <= 0 && this.payableOutstanding() > 0
    return onlyWeOweThem ? ContactSubledgerDirection.PAYABLE : ContactSubledgerDirection.RECEIVABLE
  }

  private outstandingFor(subledgerDirection: ContactSubledgerDirection | null): number {
    switch (subledgerDirection) {
      case ContactSubledgerDirection.RECEIVABLE:
        return this.receivableOutstanding()
      case ContactSubledgerDirection.PAYABLE:
        return this.payableOutstanding()
      default:
        return 0
    }
  }
}
