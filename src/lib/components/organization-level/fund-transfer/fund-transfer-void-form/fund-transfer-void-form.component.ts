import {Component, inject, input, output, signal} from '@angular/core'
import {form, FormField} from '@angular/forms/signals'
import {InputText} from 'primeng/inputtext'
import {FundMovement} from '../../../../api/organization-level/fund-transfer/fund-movement.model'
import {FundMovementService} from '../../../../api/organization-level/fund-transfer/fund-movement.service'
import {BaseFormComponent} from '../../../reusable/base-form.component'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldLayout} from '../../../reusable/form-field/form-field-layout'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'

@Component({
  selector: 'rts-fund-transfer-void-form',
  templateUrl: 'fund-transfer-void-form.component.html',
  imports: [FormButtonsComponent, FormFieldComponent, FormField, InputText]
})
export class FundTransferVoidFormComponent extends BaseFormComponent<FundMovementService> {
  readonly fundMovement = input.required<FundMovement>()

  readonly voided = output()
  readonly cancelled = output()

  protected readonly apiService = inject(FundMovementService)

  readonly FormFieldDirection = FormFieldLayout

  private readonly voidFormValue = signal({reason: ''})
  readonly voidForm = form(this.voidFormValue)

  confirmVoid() {
    this.apiService.voidFundMovement(
      {id: String(this.fundMovement().id), reason: this.voidFormValue().reason || undefined},
      {onSuccess: () => this.voided.emit()}
    )
  }
}
