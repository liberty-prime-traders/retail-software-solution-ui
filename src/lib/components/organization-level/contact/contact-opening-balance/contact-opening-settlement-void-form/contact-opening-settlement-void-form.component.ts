import {Component, inject, input, output, signal} from '@angular/core'
import {form, FormField} from '@angular/forms/signals'
import {InputText} from 'primeng/inputtext'
import {
  ContactOpeningSettlement
} from '../../../../../api/organization-level/contact-opening-settlement/contact-opening-settlement.model'
import {
  ContactOpeningSettlementService
} from '../../../../../api/organization-level/contact-opening-settlement/contact-opening-settlement.service'
import {BaseFormComponent} from '../../../../reusable/base-form.component'
import {FormButtonsComponent} from '../../../../reusable/form-buttons/form-buttons.component'
import {FormFieldLayout} from '../../../../reusable/form-field/form-field-layout'
import {FormFieldComponent} from '../../../../reusable/form-field/form-field.component'

@Component({
  selector: 'rts-contact-opening-settlement-void-form',
  templateUrl: 'contact-opening-settlement-void-form.component.html',
  imports: [FormButtonsComponent, FormFieldComponent, FormField, InputText]
})
export class ContactOpeningSettlementVoidFormComponent extends BaseFormComponent<ContactOpeningSettlementService> {
  readonly settlement = input.required<ContactOpeningSettlement>()

  readonly voided = output()
  readonly cancelled = output()

  protected readonly apiService = inject(ContactOpeningSettlementService)

  readonly FormFieldDirection = FormFieldLayout

  private readonly voidFormValue = signal({reason: ''})
  readonly voidForm = form(this.voidFormValue)

  confirmVoid() {
    this.apiService.voidSettlement(
      {settlementId: this.settlement().id, reason: this.voidFormValue().reason || undefined},
      {onSuccess: () => this.voided.emit()}
    )
  }
}
