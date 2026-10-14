import {NgClass} from '@angular/common'
import {Component, inject, Input, model, output, signal} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {form, FormField} from '@angular/forms/signals'
import {Checkbox} from 'primeng/checkbox'
import {InputText} from 'primeng/inputtext'
import {MovementType} from '../../../../api/organization-level/stock-movement-reason/movement-type.enum'
import {StockMovementReason} from '../../../../api/organization-level/stock-movement-reason/stock-movement-reason.model'
import {
  StockMovementReasonService
} from '../../../../api/organization-level/stock-movement-reason/stock-movement-reason.service'
import {EnumToDropdownPipe} from '../../../../utils/pipes/enum-to-dropdown.pipe'
import {BaseFormComponent} from '../../../reusable/base-form.component'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {StockMovementReasonFormDefinition} from './stock-movement-reason-form.definition'

@Component({
  selector: 'rts-stock-movement-reason-form',
  templateUrl: 'stock-movement-reason-form.component.html',
  imports: [
    FormButtonsComponent,
    FormFieldComponent,
    FormField,
    FormsModule,
    InputText,
    Checkbox,
    NgClass,
    EnumToDropdownPipe
  ]
})
export class StockMovementReasonFormComponent extends BaseFormComponent<StockMovementReasonService> {

  private readonly stockMovementReasonService = inject(StockMovementReasonService)
  protected override readonly apiService = this.stockMovementReasonService

  readonly stockMovementReasonCreated = output<void>()

  @Input()
  set stockMovementReason(entity: StockMovementReason | null) {
    if (entity) {
      this.originalStockMovementReason.set(entity)
      this.formValue.set(StockMovementReasonFormDefinition.convertToFormModel(entity))
      this.selectedMovementTypes.set(entity.movementTypes)
    }
  }

  readonly originalStockMovementReason = signal<StockMovementReason | undefined>(undefined)
  readonly formValue = signal<StockMovementReasonFormDefinition.StockMovementReasonFormModel>(
    StockMovementReasonFormDefinition.defaultFormModel
  )

  readonly stockMovementReasonForm = form(this.formValue, StockMovementReasonFormDefinition.formSchema)
  readonly fieldMap = StockMovementReasonFormDefinition.fieldMap

  readonly movementType = MovementType
  readonly selectedMovementTypes = model<MovementType[]>([])

  onMovementTypeChecked() {
    this.formValue.update(v => ({...v, movementTypes: this.selectedMovementTypes()}))
    this.stockMovementReasonForm().markAsDirty()
  }

  resetForm() {
    this.formValue.set(StockMovementReasonFormDefinition.convertToFormModel(this.originalStockMovementReason()))
    this.selectedMovementTypes.set(this.originalStockMovementReason()?.movementTypes ?? [])
    this.stockMovementReasonForm().reset()
  }

  upsertStockMovementReason() {
    const payload = StockMovementReasonFormDefinition.convertToBackendModel(this.formValue())
    if (payload.id) {
      this.stockMovementReasonService.put(payload)
    } else {
      this.stockMovementReasonService.post(payload, {onSuccess: () => this.stockMovementReasonCreated.emit()})
    }
  }

  deleteStockMovementReason() {
    this.stockMovementReasonService.delete(this.originalStockMovementReason()?.id)
  }
}
